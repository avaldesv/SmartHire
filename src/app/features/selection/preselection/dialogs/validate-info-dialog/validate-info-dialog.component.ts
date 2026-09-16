import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { catalogDialogConfig } from '../../../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../../../core/feedback/feedback-dialog.service';
import {
  VALIDATE_INFO_ADD,
  VALIDATE_INFO_DIALOG_BACK,
  VALIDATE_INFO_DIALOG_CANCEL,
  VALIDATE_INFO_DIALOG_CLOSE,
  VALIDATE_INFO_DIALOG_LOAD_ERROR,
  VALIDATE_INFO_DIALOG_LOADING,
  VALIDATE_INFO_DIALOG_NEXT,
  VALIDATE_INFO_DIALOG_SAVE,
  VALIDATE_INFO_DIALOG_SAVE_ERROR,
  VALIDATE_INFO_DIALOG_SAVING,
  VALIDATE_INFO_DIALOG_TITLE,
  VALIDATE_INFO_ERR_BENEFICIARY_DRAFT,
  VALIDATE_INFO_ERR_BENEFICIARY_ROW,
  VALIDATE_INFO_ERR_EMERGENCY_DRAFT,
  VALIDATE_INFO_ERR_EMERGENCY_MIN,
  VALIDATE_INFO_ERR_EMERGENCY_ROW,
  VALIDATE_INFO_ERR_EMPTY_BENEFICIARIES,
  VALIDATE_INFO_ERR_PERCENT,
  VALIDATE_INFO_ERR_PERSONAL,
  VALIDATE_INFO_FIELD_AGE,
  VALIDATE_INFO_FIELD_BIRTH_DATE,
  VALIDATE_INFO_FIELD_COUNTRY,
  VALIDATE_INFO_FIELD_CURP,
  VALIDATE_INFO_FIELD_EDU_LEVEL,
  VALIDATE_INFO_FIELD_EMAIL,
  VALIDATE_INFO_FIELD_EXPERIENCE,
  VALIDATE_INFO_FIELD_EXT_NUM,
  VALIDATE_INFO_FIELD_FIRST_NAME,
  VALIDATE_INFO_FIELD_GENDER,
  VALIDATE_INFO_FIELD_INFONAVIT,
  VALIDATE_INFO_FIELD_INSTITUTION,
  VALIDATE_INFO_FIELD_INT_NUM,
  VALIDATE_INFO_FIELD_IRREVOCABLE,
  VALIDATE_INFO_FIELD_KINSHIP,
  VALIDATE_INFO_FIELD_LAST_NAME,
  VALIDATE_INFO_FIELD_MARITAL,
  VALIDATE_INFO_FIELD_MATERNAL,
  VALIDATE_INFO_FIELD_MUNICIPALITY,
  VALIDATE_INFO_FIELD_NEIGHBORHOOD,
  VALIDATE_INFO_FIELD_NSS,
  VALIDATE_INFO_FIELD_NSSDV,
  VALIDATE_INFO_FIELD_PERCENT,
  VALIDATE_INFO_FIELD_PHONE,
  VALIDATE_INFO_FIELD_POSITION,
  VALIDATE_INFO_FIELD_POSTAL,
  VALIDATE_INFO_FIELD_PREFIX,
  VALIDATE_INFO_FIELD_RFC,
  VALIDATE_INFO_FIELD_RFC_POSTAL,
  VALIDATE_INFO_FIELD_SALARY,
  VALIDATE_INFO_FIELD_STATE,
  VALIDATE_INFO_FIELD_STREET,
  VALIDATE_INFO_FIELD_TAX_REGIME,
  VALIDATE_INFO_FIELD_TYPE,
  VALIDATE_INFO_FIELD_YES,
  VALIDATE_INFO_HINT_BENEFICIARIES,
  VALIDATE_INFO_HINT_EMERGENCY,
  VALIDATE_INFO_NO_ITEMS,
  VALIDATE_INFO_REMOVE,
  VALIDATE_INFO_SEARCH_SOON,
  VALIDATE_INFO_SEARCH_TAX,
  VALIDATE_INFO_SECTION_BENEFICIARIES_LIST,
  VALIDATE_INFO_SECTION_BENEFICIARY,
  VALIDATE_INFO_SECTION_BIRTH,
  VALIDATE_INFO_SECTION_CONTACTS,
  VALIDATE_INFO_SECTION_CONTACTS_LIST,
  VALIDATE_INFO_SECTION_GENERAL,
  VALIDATE_INFO_SECTION_GOV,
  VALIDATE_INFO_SECTION_RESIDENCE,
  VALIDATE_INFO_SECTION_STUDIES,
  VALIDATE_INFO_SECTION_TAX,
  VALIDATE_INFO_SELECT,
  VALIDATE_INFO_TAB_BENEFICIARIES,
  VALIDATE_INFO_TAB_EMERGENCY,
  VALIDATE_INFO_TAB_PERSONAL,
  VALIDATE_INFO_TYPE_CONTINGENT,
  VALIDATE_INFO_TYPE_PRIMARY,
  validateInfoDialogSubtitle,
} from '../../../../../core/i18n/validate-info-dialog-labels';
import { CandidateApplicationApiService } from '../../../../../core/services/candidate-application-api.service';
import {
  ApplicationCompleteInfoBeneficiary,
  ApplicationCompleteInfoEmergencyContact,
  ApplicationCompleteInfoLookupItem,
  ApplicationCompleteInfoLookups,
  ApplicationCompleteInfoPersonalData,
  ApplicationCompleteInfoResponse,
  SubmitApplicationCompleteInfoRequest,
} from '../../../../../shared/models/application-complete-info.model';

export type ValidateInfoTabKey = 'PERSONAL' | 'BENEFICIARIES' | 'EMERGENCY_CONTACTS';

export interface ValidateInfoDialogData {
  applicationId: number;
  candidateName?: string;
}

export interface ValidateInfoDialogResult {
  saved: boolean;
  infoValidated?: boolean;
}

interface BeneficiaryRow {
  beneficiaryType: 'PRIMARY' | 'CONTINGENT';
  firstName: string;
  lastName: string;
  secondLastName: string;
  kinshipId: number | null;
  irrevocable: boolean;
  age: number | null;
  percent: number | null;
  country: string;
  phone: string;
  email: string;
  isActive: boolean;
}

interface EmergencyRow {
  firstName: string;
  lastName: string;
  secondLastName: string;
  kinshipId: number | null;
  phonePrefix: string;
  phone: string;
  email: string;
  isActive: boolean;
}

const EMPTY_LOOKUPS: ApplicationCompleteInfoLookups = {
  genders: [],
  maritalStatuses: [],
  educationLevels: [],
  countries: [],
  states: [],
  kinships: [],
};

export const VALIDATE_INFO_DIALOG_WIDTH = '96vw';
export const VALIDATE_INFO_DIALOG_MAX_WIDTH = '1280px';

export function validateInfoDialogConfig(extra: MatDialogConfig = {}): MatDialogConfig {
  return catalogDialogConfig(VALIDATE_INFO_DIALOG_WIDTH, {
    maxWidth: VALIDATE_INFO_DIALOG_MAX_WIDTH,
    maxHeight: '92vh',
    autoFocus: false,
    panelClass: ['sh-catalog-form-dialog-panel', 'sh-validate-info-dialog-panel'],
    ...extra,
  });
}

@Component({
  selector: 'sh-validate-info-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './validate-info-dialog.component.html',
  styleUrl: './validate-info-dialog.component.scss',
})
export class ValidateInfoDialogComponent implements OnInit {
  private readonly dialogRef = inject(
    MatDialogRef<ValidateInfoDialogComponent, ValidateInfoDialogResult | null>,
  );
  readonly data = inject<ValidateInfoDialogData>(MAT_DIALOG_DATA);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly labels = {
    title: VALIDATE_INFO_DIALOG_TITLE,
    loading: VALIDATE_INFO_DIALOG_LOADING,
    cancel: VALIDATE_INFO_DIALOG_CANCEL,
    close: VALIDATE_INFO_DIALOG_CLOSE,
    back: VALIDATE_INFO_DIALOG_BACK,
    next: VALIDATE_INFO_DIALOG_NEXT,
    save: VALIDATE_INFO_DIALOG_SAVE,
    saving: VALIDATE_INFO_DIALOG_SAVING,
    tabPersonal: VALIDATE_INFO_TAB_PERSONAL,
    tabBeneficiaries: VALIDATE_INFO_TAB_BENEFICIARIES,
    tabEmergency: VALIDATE_INFO_TAB_EMERGENCY,
    sectionGeneral: VALIDATE_INFO_SECTION_GENERAL,
    sectionGov: VALIDATE_INFO_SECTION_GOV,
    sectionTax: VALIDATE_INFO_SECTION_TAX,
    sectionBirth: VALIDATE_INFO_SECTION_BIRTH,
    sectionResidence: VALIDATE_INFO_SECTION_RESIDENCE,
    sectionStudies: VALIDATE_INFO_SECTION_STUDIES,
    sectionBeneficiary: VALIDATE_INFO_SECTION_BENEFICIARY,
    sectionBeneficiariesList: VALIDATE_INFO_SECTION_BENEFICIARIES_LIST,
    sectionContacts: VALIDATE_INFO_SECTION_CONTACTS,
    sectionContactsList: VALIDATE_INFO_SECTION_CONTACTS_LIST,
    firstName: VALIDATE_INFO_FIELD_FIRST_NAME,
    lastName: VALIDATE_INFO_FIELD_LAST_NAME,
    maternal: VALIDATE_INFO_FIELD_MATERNAL,
    position: VALIDATE_INFO_FIELD_POSITION,
    experience: VALIDATE_INFO_FIELD_EXPERIENCE,
    salary: VALIDATE_INFO_FIELD_SALARY,
    email: VALIDATE_INFO_FIELD_EMAIL,
    phone: VALIDATE_INFO_FIELD_PHONE,
    country: VALIDATE_INFO_FIELD_COUNTRY,
    gender: VALIDATE_INFO_FIELD_GENDER,
    marital: VALIDATE_INFO_FIELD_MARITAL,
    curp: VALIDATE_INFO_FIELD_CURP,
    nss: VALIDATE_INFO_FIELD_NSS,
    nssDv: VALIDATE_INFO_FIELD_NSSDV,
    infonavit: VALIDATE_INFO_FIELD_INFONAVIT,
    rfc: VALIDATE_INFO_FIELD_RFC,
    taxRegime: VALIDATE_INFO_FIELD_TAX_REGIME,
    rfcPostal: VALIDATE_INFO_FIELD_RFC_POSTAL,
    state: VALIDATE_INFO_FIELD_STATE,
    birthDate: VALIDATE_INFO_FIELD_BIRTH_DATE,
    postal: VALIDATE_INFO_FIELD_POSTAL,
    municipality: VALIDATE_INFO_FIELD_MUNICIPALITY,
    neighborhood: VALIDATE_INFO_FIELD_NEIGHBORHOOD,
    street: VALIDATE_INFO_FIELD_STREET,
    extNum: VALIDATE_INFO_FIELD_EXT_NUM,
    intNum: VALIDATE_INFO_FIELD_INT_NUM,
    eduLevel: VALIDATE_INFO_FIELD_EDU_LEVEL,
    institution: VALIDATE_INFO_FIELD_INSTITUTION,
    type: VALIDATE_INFO_FIELD_TYPE,
    kinship: VALIDATE_INFO_FIELD_KINSHIP,
    irrevocable: VALIDATE_INFO_FIELD_IRREVOCABLE,
    percent: VALIDATE_INFO_FIELD_PERCENT,
    age: VALIDATE_INFO_FIELD_AGE,
    prefix: VALIDATE_INFO_FIELD_PREFIX,
    yes: VALIDATE_INFO_FIELD_YES,
    select: VALIDATE_INFO_SELECT,
    searchTax: VALIDATE_INFO_SEARCH_TAX,
    add: VALIDATE_INFO_ADD,
    remove: VALIDATE_INFO_REMOVE,
    noItems: VALIDATE_INFO_NO_ITEMS,
    typePrimary: VALIDATE_INFO_TYPE_PRIMARY,
    typeContingent: VALIDATE_INFO_TYPE_CONTINGENT,
    hintBeneficiaries: VALIDATE_INFO_HINT_BENEFICIARIES,
    hintEmergency: VALIDATE_INFO_HINT_EMERGENCY,
  };

  readonly beneficiaryColumns = [
    'beneficiaryType',
    'firstName',
    'lastName',
    'secondLastName',
    'percent',
    'email',
    'phone',
    'age',
    'actions',
  ];
  readonly emergencyColumns = ['firstName', 'lastNames', 'email', 'phone', 'actions'];

  loading = true;
  saving = false;
  formError = '';
  taxSearchHint = '';
  selectedTabIndex = 0;

  info: ApplicationCompleteInfoResponse | null = null;
  enabledTabs: ValidateInfoTabKey[] = [];
  lookups: ApplicationCompleteInfoLookups = { ...EMPTY_LOOKUPS };
  personal: ApplicationCompleteInfoPersonalData = this.emptyPersonal();
  beneficiaries: BeneficiaryRow[] = [];
  emergencyContacts: EmergencyRow[] = [];
  beneficiaryDraft: BeneficiaryRow = this.emptyBeneficiary();
  emergencyDraft: EmergencyRow = this.emptyEmergency();

  get activeTab(): ValidateInfoTabKey {
    return this.enabledTabs[this.selectedTabIndex] || 'PERSONAL';
  }

  get isLastTab(): boolean {
    return this.selectedTabIndex >= this.enabledTabs.length - 1;
  }

  get subtitle(): string {
    return validateInfoDialogSubtitle(this.data.candidateName);
  }

  ngOnInit(): void {
    this.load();
  }

  tabLabel(tab: ValidateInfoTabKey): string {
    if (tab === 'PERSONAL') return this.labels.tabPersonal;
    if (tab === 'BENEFICIARIES') return this.labels.tabBeneficiaries;
    return this.labels.tabEmergency;
  }

  selectTab(tab: ValidateInfoTabKey): void {
    const index = this.enabledTabs.indexOf(tab);
    if (index >= 0) {
      this.selectedTabIndex = index;
      this.formError = '';
      this.taxSearchHint = '';
    }
  }

  statesFor(countryId: number | null | undefined): ApplicationCompleteInfoLookupItem[] {
    if (countryId == null) {
      return [];
    }
    return (this.lookups.states || []).filter((s) => s.countryId === countryId);
  }

  onBirthCountryChange(): void {
    this.personal.birthStateId = null;
  }

  onResidenceCountryChange(): void {
    this.personal.residenceStateId = null;
  }

  searchTaxData(): void {
    this.taxSearchHint = VALIDATE_INFO_SEARCH_SOON;
  }

  goBack(): void {
    if (this.selectedTabIndex > 0) {
      this.selectedTabIndex -= 1;
      this.formError = '';
      this.taxSearchHint = '';
    }
  }

  goNext(): void {
    if (!this.validateCurrentTab()) {
      return;
    }
    if (!this.isLastTab) {
      this.selectedTabIndex += 1;
      this.formError = '';
      this.taxSearchHint = '';
    }
  }

  addBeneficiaryFromDraft(): void {
    const d = this.beneficiaryDraft;
    if (
      !d.firstName.trim() ||
      !d.lastName.trim() ||
      !d.secondLastName.trim() ||
      d.kinshipId == null ||
      d.percent == null
    ) {
      this.formError = VALIDATE_INFO_ERR_BENEFICIARY_DRAFT;
      return;
    }
    this.beneficiaries = [
      ...this.beneficiaries,
      {
        ...d,
        firstName: d.firstName.trim(),
        lastName: d.lastName.trim(),
        secondLastName: d.secondLastName.trim(),
        percent: Number(d.percent),
        age: d.age != null ? Number(d.age) : null,
        country: (d.country || '').trim(),
        phone: (d.phone || '').trim(),
        email: (d.email || '').trim(),
      },
    ];
    this.beneficiaryDraft = this.emptyBeneficiary();
    this.formError = '';
  }

  removeBeneficiary(index: number): void {
    this.beneficiaries = this.beneficiaries.filter((_, i) => i !== index);
  }

  addEmergencyFromDraft(): void {
    const d = this.emergencyDraft;
    if (!d.firstName.trim() || !d.lastName.trim() || !d.phone.trim()) {
      this.formError = VALIDATE_INFO_ERR_EMERGENCY_DRAFT;
      return;
    }
    this.emergencyContacts = [
      ...this.emergencyContacts,
      {
        ...d,
        firstName: d.firstName.trim(),
        lastName: d.lastName.trim(),
        secondLastName: (d.secondLastName || '').trim(),
        phonePrefix: (d.phonePrefix || '').trim(),
        phone: d.phone.trim(),
        email: (d.email || '').trim(),
      },
    ];
    this.emergencyDraft = this.emptyEmergency();
    this.formError = '';
  }

  removeEmergency(index: number): void {
    this.emergencyContacts = this.emergencyContacts.filter((_, i) => i !== index);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    if (this.saving) {
      return;
    }
    for (let i = 0; i < this.enabledTabs.length; i++) {
      this.selectedTabIndex = i;
      if (!this.validateCurrentTab()) {
        return;
      }
    }
    this.selectedTabIndex = this.enabledTabs.length - 1;

    const body: SubmitApplicationCompleteInfoRequest = {};
    if (this.enabledTabs.includes('PERSONAL')) {
      body.personal = {
        ...this.personal,
        firstName: (this.personal.firstName || '').trim(),
        lastName: (this.personal.lastName || '').trim(),
        maternalLastName: (this.personal.maternalLastName || '').trim() || null,
        email: (this.personal.email || '').trim(),
        phone: this.personal.phone || null,
        experienceYears:
          this.personal.experienceYears != null ? Number(this.personal.experienceYears) : null,
        desiredSalary:
          this.personal.desiredSalary != null ? Number(this.personal.desiredSalary) : null,
      };
    }
    if (this.enabledTabs.includes('BENEFICIARIES')) {
      body.beneficiaries = this.beneficiaries.map((b) => ({
        beneficiaryType: b.beneficiaryType,
        firstName: b.firstName.trim(),
        lastName: b.lastName.trim(),
        secondLastName: b.secondLastName || null,
        kinshipId: b.kinshipId,
        irrevocable: b.irrevocable,
        age: b.age,
        percent: b.percent != null ? Number(b.percent) : null,
        country: b.country || null,
        phone: b.phone || null,
        email: b.email || null,
        isActive: b.isActive,
      }));
    }
    if (this.enabledTabs.includes('EMERGENCY_CONTACTS')) {
      body.emergencyContacts = this.emergencyContacts.map((e) => ({
        firstName: e.firstName.trim(),
        lastName: e.lastName.trim(),
        secondLastName: e.secondLastName || null,
        kinshipId: e.kinshipId,
        phonePrefix: e.phonePrefix || null,
        phone: e.phone.trim(),
        email: e.email || null,
        isActive: e.isActive,
      }));
    }

    this.saving = true;
    this.formError = '';
    this.applicationApi.saveCompleteInfo(this.data.applicationId, body).subscribe({
      next: (res) => {
        this.saving = false;
        this.dialogRef.close({
          saved: true,
          infoValidated: res.infoValidated ?? true,
        });
      },
      error: (err) => {
        this.saving = false;
        this.feedback.showApiError(err, { fallbackMessage: VALIDATE_INFO_DIALOG_SAVE_ERROR });
      },
    });
  }

  private load(): void {
    this.loading = true;
    this.applicationApi.getCompleteInfo(this.data.applicationId).subscribe({
      next: (info) => {
        this.info = info;
        this.lookups = info.lookups ?? { ...EMPTY_LOOKUPS };
        this.enabledTabs = (info.enabledTabs || []).filter(
          (t): t is ValidateInfoTabKey =>
            t === 'PERSONAL' || t === 'BENEFICIARIES' || t === 'EMERGENCY_CONTACTS',
        );
        if (!this.enabledTabs.length) {
          this.enabledTabs = ['PERSONAL'];
        }
        this.personal = {
          ...this.emptyPersonal(),
          ...(info.personal || {}),
          experienceYears: info.personal?.experienceYears ?? null,
        };
        if (this.personal.birthDate && this.personal.birthDate.length > 10) {
          this.personal.birthDate = this.personal.birthDate.slice(0, 10);
        }
        this.beneficiaries = (info.beneficiaries || []).map((b) => this.mapBeneficiary(b));
        this.emergencyContacts = (info.emergencyContacts || []).map((e) => this.mapEmergency(e));
        this.beneficiaryDraft = this.emptyBeneficiary();
        this.emergencyDraft = this.emptyEmergency();
        this.selectedTabIndex = 0;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: VALIDATE_INFO_DIALOG_LOAD_ERROR });
        this.dialogRef.close(null);
      },
    });
  }

  private validateCurrentTab(): boolean {
    const tab = this.enabledTabs[this.selectedTabIndex];
    if (tab === 'PERSONAL') {
      if (
        !(this.personal.firstName || '').trim() ||
        !(this.personal.lastName || '').trim() ||
        !(this.personal.maternalLastName || '').trim() ||
        !(this.personal.email || '').trim()
      ) {
        this.formError = VALIDATE_INFO_ERR_PERSONAL;
        return false;
      }
    }
    if (tab === 'BENEFICIARIES') {
      if (!this.beneficiaries.length) {
        this.formError = VALIDATE_INFO_ERR_EMPTY_BENEFICIARIES;
        return false;
      }
      for (const b of this.beneficiaries) {
        if (!b.firstName.trim() || !b.lastName.trim() || b.percent == null) {
          this.formError = VALIDATE_INFO_ERR_BENEFICIARY_ROW;
          return false;
        }
      }
      if (!this.percentSumsValid()) {
        this.formError = VALIDATE_INFO_ERR_PERCENT;
        return false;
      }
    }
    if (tab === 'EMERGENCY_CONTACTS') {
      if (this.emergencyContacts.length < 2) {
        this.formError = VALIDATE_INFO_ERR_EMERGENCY_MIN;
        return false;
      }
      for (const e of this.emergencyContacts) {
        if (!e.firstName.trim() || !e.lastName.trim() || !e.phone.trim()) {
          this.formError = VALIDATE_INFO_ERR_EMERGENCY_ROW;
          return false;
        }
      }
    }
    this.formError = '';
    return true;
  }

  private percentSumsValid(): boolean {
    const sums = new Map<string, number>();
    for (const b of this.beneficiaries) {
      const type = b.beneficiaryType;
      sums.set(type, (sums.get(type) || 0) + Number(b.percent || 0));
    }
    for (const value of sums.values()) {
      if (Math.abs(value - 100) > 0.01) {
        return false;
      }
    }
    return sums.size > 0;
  }

  private mapBeneficiary(b: ApplicationCompleteInfoBeneficiary): BeneficiaryRow {
    const type = (b.beneficiaryType || 'PRIMARY').toUpperCase();
    return {
      beneficiaryType: type === 'CONTINGENT' ? 'CONTINGENT' : 'PRIMARY',
      firstName: b.firstName || '',
      lastName: b.lastName || '',
      secondLastName: b.secondLastName || '',
      kinshipId: b.kinshipId,
      irrevocable: !!b.irrevocable,
      age: b.age,
      percent: b.percent != null ? Number(b.percent) : null,
      country: b.country || '',
      phone: b.phone || '',
      email: b.email || '',
      isActive: b.isActive !== false,
    };
  }

  private mapEmergency(e: ApplicationCompleteInfoEmergencyContact): EmergencyRow {
    return {
      firstName: e.firstName || '',
      lastName: e.lastName || '',
      secondLastName: e.secondLastName || '',
      kinshipId: e.kinshipId,
      phonePrefix: e.phonePrefix || '',
      phone: e.phone || '',
      email: e.email || '',
      isActive: e.isActive !== false,
    };
  }

  private emptyPersonal(): ApplicationCompleteInfoPersonalData {
    return {
      firstName: '',
      lastName: '',
      maternalLastName: '',
      email: '',
      phone: '',
      phoneCountryId: null,
      curp: '',
      rfc: '',
      nss: '',
      nssDv: '',
      infonavit: '',
      taxRegime: '',
      rfcPostalCode: '',
      maritalStatusId: null,
      birthDate: null,
      birthCountryId: null,
      birthStateId: null,
      genderId: null,
      residenceCountryId: null,
      residenceStateId: null,
      postalCode: '',
      municipality: '',
      neighborhood: '',
      street: '',
      exteriorNumber: '',
      interiorNumber: '',
      educationLevelId: null,
      educationInstitution: '',
      desiredSalary: null,
      experienceYears: null,
    };
  }

  private emptyBeneficiary(): BeneficiaryRow {
    return {
      beneficiaryType: 'PRIMARY',
      firstName: '',
      lastName: '',
      secondLastName: '',
      kinshipId: null,
      irrevocable: false,
      age: null,
      percent: null,
      country: '',
      phone: '',
      email: '',
      isActive: true,
    };
  }

  private emptyEmergency(): EmergencyRow {
    return {
      firstName: '',
      lastName: '',
      secondLastName: '',
      kinshipId: null,
      phonePrefix: '',
      phone: '',
      email: '',
      isActive: true,
    };
  }
}
