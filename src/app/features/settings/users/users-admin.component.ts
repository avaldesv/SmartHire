import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime } from 'rxjs';
import { SettingsService } from '../../../mock/services/settings.service';
import { SystemUser } from '../../../shared/models';

@Component({
  selector: 'sh-users-admin',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.scss',
})
export class UsersAdminComponent implements OnInit {
  private readonly settings = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  loading = true;
  data: SystemUser[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });
  readonly columns = ['username', 'firstName', 'lastName', 'email', 'profile', 'branch', 'active'];

  ngOnInit(): void {
    this.load();
    this.searchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  load(): void {
    this.loading = true;
    this.settings
      .listUsers({ search: this.searchForm.controls.search.value || undefined, page: this.pageIndex + 1, pageSize: this.pageSize })
      .subscribe((res) => {
        this.data = res.items;
        this.total = res.total;
        this.loading = false;
      });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }
}
