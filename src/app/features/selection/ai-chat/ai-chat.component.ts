import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { catalogDialogConfig } from '../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import {
  VIA_BOT_ADD_ERROR,
  VIA_BOT_ADD_PRESELECTION,
  VIA_BOT_ADD_SUCCESS,
  VIA_BOT_ASSISTANT_TITLE,
  VIA_BOT_CHAT_ERROR,
  VIA_BOT_EMPTY_RESULTS,
  VIA_BOT_INPUT_PLACEHOLDER,
  VIA_BOT_LOAD_ERROR,
  VIA_BOT_NEW_CONVERSATION,
  VIA_BOT_RESET_ERROR,
  VIA_BOT_RESET_SUCCESS,
  VIA_BOT_RESULTS_COUNT,
  VIA_BOT_RESULTS_TITLE,
  VIA_BOT_RESULTS_UPDATED,
  VIA_BOT_SCOPE_APPLICANTS,
  VIA_BOT_SCOPE_LABEL,
  VIA_BOT_SCOPE_POOL,
  VIA_BOT_SELECT_ALL,
  VIA_BOT_SELECT_ONE,
  VIA_BOT_SEND,
  VIA_BOT_WELCOME,
} from '../../../core/i18n/via-bot-labels';
import { ViaBotApiService } from '../../../core/services/via-bot-api.service';
import {
  CandidateProfileDialogComponent,
  CandidateProfileDialogData,
} from '../../candidates/dialogs/candidate-profile-dialog/candidate-profile-dialog.component';
import { ViaBotCandidate, ViaBotScope } from '../../../shared/models/via-bot.model';

type ChatBubble = { role: 'user' | 'ai'; text: string };

type CandidateRow = ViaBotCandidate & { selected: boolean };

@Component({
  selector: 'sh-ai-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly viaBotApi = inject(ViaBotApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialog = inject(MatDialog);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;

  readonly labels = {
    assistantTitle: VIA_BOT_ASSISTANT_TITLE,
    scopeLabel: VIA_BOT_SCOPE_LABEL,
    scopePool: VIA_BOT_SCOPE_POOL,
    scopeApplicants: VIA_BOT_SCOPE_APPLICANTS,
    welcome: VIA_BOT_WELCOME,
    inputPlaceholder: VIA_BOT_INPUT_PLACEHOLDER,
    send: VIA_BOT_SEND,
    newConversation: VIA_BOT_NEW_CONVERSATION,
    resultsTitle: VIA_BOT_RESULTS_TITLE,
    resultsUpdated: VIA_BOT_RESULTS_UPDATED,
    resultsCount: VIA_BOT_RESULTS_COUNT,
    selectAll: VIA_BOT_SELECT_ALL,
    addPreselection: VIA_BOT_ADD_PRESELECTION,
    emptyResults: VIA_BOT_EMPTY_RESULTS,
  };

  loadingConversation = true;
  sending = false;
  resetting = false;
  submitting = false;
  scope: ViaBotScope = 'POOL';
  messages: ChatBubble[] = [{ role: 'ai', text: this.labels.welcome }];
  results: CandidateRow[] = [];

  readonly messageForm = this.fb.nonNullable.group({
    message: ['', [Validators.required, Validators.maxLength(10000)]],
  });

  ngOnInit(): void {
    this.loadConversation();
  }

  get selectedCount(): number {
    return this.results.filter((r) => r.selected).length;
  }

  get allSelected(): boolean {
    return this.results.length > 0 && this.results.every((r) => r.selected);
  }

  get someSelected(): boolean {
    return this.selectedCount > 0 && !this.allSelected;
  }

  loadConversation(): void {
    this.loadingConversation = true;
    this.viaBotApi.getConversation(this.positionId).subscribe({
      next: (res) => {
        this.loadingConversation = false;
        if (!res.exists || !res.messages?.length) {
          this.messages = [{ role: 'ai', text: this.labels.welcome }];
          this.results = [];
          return;
        }
        if (res.scope === 'APPLICANTS' || res.scope === 'POOL') {
          this.scope = res.scope;
        }
        this.messages = res.messages.map((m) => ({
          role: m.role?.toUpperCase() === 'USER' ? 'user' : 'ai',
          text: m.content,
        }));
        this.results = (res.candidates ?? []).map((c) => ({ ...c, selected: true }));
      },
      error: (err) => {
        this.loadingConversation = false;
        this.feedback.showApiError(err, { fallbackMessage: VIA_BOT_LOAD_ERROR });
      },
    });
  }

  send(): void {
    if (this.messageForm.invalid || this.sending) {
      this.messageForm.markAllAsTouched();
      return;
    }
    const text = this.messageForm.controls.message.value.trim();
    if (!text) {
      return;
    }
    this.messages = [...this.messages, { role: 'user', text }];
    this.messageForm.reset({ message: '' });
    this.sending = true;
    this.viaBotApi.chat(this.positionId, { message: text, scope: this.scope }).subscribe({
      next: (res) => {
        this.sending = false;
        this.messages = [...this.messages, { role: 'ai', text: res.response }];
        this.results = (res.candidates ?? []).map((c) => ({ ...c, selected: true }));
      },
      error: (err) => {
        this.sending = false;
        this.feedback.showApiError(err, { fallbackMessage: VIA_BOT_CHAT_ERROR });
      },
    });
  }

  newConversation(): void {
    if (this.resetting) {
      return;
    }
    this.resetting = true;
    this.viaBotApi.reset(this.positionId).subscribe({
      next: () => {
        this.resetting = false;
        this.messages = [{ role: 'ai', text: this.labels.welcome }];
        this.results = [];
        this.feedback.showSuccess(VIA_BOT_RESET_SUCCESS);
      },
      error: (err) => {
        this.resetting = false;
        this.feedback.showApiError(err, { fallbackMessage: VIA_BOT_RESET_ERROR });
      },
    });
  }

  toggleAll(checked: boolean): void {
    this.results.forEach((r) => (r.selected = checked));
  }

  addSelectedToPreselection(): void {
    const candidateIds = this.results.filter((r) => r.selected).map((r) => r.candidateId);
    if (!candidateIds.length) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, VIA_BOT_SELECT_ONE);
      return;
    }
    this.submitting = true;
    this.viaBotApi.addToPreselection(this.positionId, { candidateIds }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.feedback.showSuccess(`${res.updated} ${VIA_BOT_ADD_SUCCESS}`);
        this.messages = [
          ...this.messages,
          { role: 'ai', text: `${res.updated} ${VIA_BOT_ADD_SUCCESS}.` },
        ];
      },
      error: (err) => {
        this.submitting = false;
        this.feedback.showApiError(err, { fallbackMessage: VIA_BOT_ADD_ERROR });
      },
    });
  }

  openProfile(row: ViaBotCandidate): void {
    this.dialog.open<CandidateProfileDialogComponent, CandidateProfileDialogData>(
      CandidateProfileDialogComponent,
      {
        ...catalogDialogConfig('920px'),
        autoFocus: false,
        data: {
          candidateId: row.candidateId,
          candidateName: this.candidateName(row),
        },
      },
    );
  }

  candidateName(c: ViaBotCandidate): string {
    const name = `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim();
    return name || `Candidato #${c.candidateId}`;
  }

  initials(c: ViaBotCandidate): string {
    const first = (c.firstName ?? '').trim().charAt(0);
    const last = (c.lastName ?? '').trim().charAt(0);
    const value = `${first}${last}`.toUpperCase();
    return value || '?';
  }
}
