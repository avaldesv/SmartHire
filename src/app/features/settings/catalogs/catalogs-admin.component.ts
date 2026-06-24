import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { CatalogCareerService } from '../../../core/services/catalog-career.service';
import { CatalogBenefitService } from '../../../core/services/catalog-benefit.service';
import { CatalogBrandService } from '../../../core/services/catalog-brand.service';
import { CatalogClientCompanyService } from '../../../core/services/catalog-client-company.service';
import { CatalogClientService } from '../../../core/services/catalog-client.service';
import { CatalogCompanyService } from '../../../core/services/catalog-company.service';
import { CatalogContractTypeService } from '../../../core/services/catalog-contract-type.service';
import { CatalogEducationLevelService } from '../../../core/services/catalog-education-level.service';
import { CatalogLanguageLevelService } from '../../../core/services/catalog-language-level.service';
import { CatalogRequisitionTypeService } from '../../../core/services/catalog-requisition-type.service';
import { CatalogCoverageTypeService } from '../../../core/services/catalog-coverage-type.service';
import { CatalogCurrencyService } from '../../../core/services/catalog-currency.service';
import { CatalogDocumentTypeService } from '../../../core/services/catalog-document-type.service';
import { CatalogGenderService } from '../../../core/services/catalog-gender.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogKinshipService } from '../../../core/services/catalog-kinship.service';
import { CatalogLanguageService } from '../../../core/services/catalog-language.service';
import { CatalogShiftService } from '../../../core/services/catalog-shift.service';
import { CatalogCareer } from '../../../shared/models/catalog-career.model';
import { CatalogBenefit } from '../../../shared/models/catalog-benefit.model';
import { CatalogBrand } from '../../../shared/models/catalog-brand.model';
import { CatalogClientCompany } from '../../../shared/models/catalog-client-company.model';
import { CatalogClient } from '../../../shared/models/catalog-client.model';
import { CatalogCompany } from '../../../shared/models/catalog-company.model';
import { CatalogContractType } from '../../../shared/models/catalog-contract-type.model';
import { CatalogEducationLevel } from '../../../shared/models/catalog-education-level.model';
import { CatalogLanguageLevel } from '../../../shared/models/catalog-language-level.model';
import { CatalogRequisitionType } from '../../../shared/models/catalog-requisition-type.model';
import { CatalogCoverageType } from '../../../shared/models/catalog-coverage-type.model';
import { CatalogCurrency } from '../../../shared/models/catalog-currency.model';
import { CatalogDocumentType } from '../../../shared/models/catalog-document-type.model';
import { CatalogCountry, CatalogMunicipality, CatalogNeighborhood, CatalogState } from '../../../shared/models/catalog-geography.model';
import { CatalogGender } from '../../../shared/models/catalog-gender.model';
import { CatalogKinship } from '../../../shared/models/catalog-kinship.model';
import { CatalogLanguage } from '../../../shared/models/catalog-language.model';
import { CatalogShift } from '../../../shared/models/catalog-shift.model';
import { PermissionService } from '../../../core/services/permission.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ScopeBadgeComponent } from '../../../shared/components/scope-badge/scope-badge.component';
import { TenantDataScope } from '../../../shared/models/tenant-data-scope.model';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';
import {
  CATALOG_CATEGORIES,
  CatalogCategoryId,
  CatalogPanelKey,
  getCategoryById,
} from './catalog-admin.registry';

@Component({
  selector: 'sh-catalogs-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatRadioModule,
    ScopeBadgeComponent,
  ],
  templateUrl: './catalogs-admin.component.html',
  styleUrl: './catalogs-admin.component.scss',
})
export class CatalogsAdminComponent implements OnInit {
  private readonly permissions = inject(PermissionService);
  private readonly tenantContext = inject(TenantContextService);
  private tenantReloadReady = false;
  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());

  readonly categories = CATALOG_CATEGORIES;
  categoryTabIndex = 0;
  selectedCatalogIdByCategory: Record<CatalogCategoryId, string> = {
    generales: 'gender',
    cuestionario: 'questionnaireCategory',
    notificaciones: 'messages',
    empresas: 'company',
    portal: 'jobPortal',
    datosMp: 'mpCountry',
    smarthireOps: 'kinship',
  };

  private readonly genderService = inject(CatalogGenderService);
  private readonly kinshipService = inject(CatalogKinshipService);
  private readonly companyService = inject(CatalogCompanyService);
  private readonly currencyService = inject(CatalogCurrencyService);
  private readonly careerService = inject(CatalogCareerService);
  private readonly languageService = inject(CatalogLanguageService);
  private readonly shiftService = inject(CatalogShiftService);
  private readonly benefitService = inject(CatalogBenefitService);
  private readonly brandService = inject(CatalogBrandService);
  private readonly educationLevelService = inject(CatalogEducationLevelService);
  private readonly languageLevelService = inject(CatalogLanguageLevelService);
  private readonly requisitionTypeService = inject(CatalogRequisitionTypeService);
  private readonly clientCompanyService = inject(CatalogClientCompanyService);
  private readonly clientService = inject(CatalogClientService);
  private readonly contractTypeService = inject(CatalogContractTypeService);
  private readonly coverageTypeService = inject(CatalogCoverageTypeService);
  private readonly documentTypeService = inject(CatalogDocumentTypeService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly createScopeForm = this.fb.nonNullable.group({
    scope: ['TENANT' as TenantDataScope],
  });

  constructor() {
    effect(() => {
      this.tenantContext.activeCompanyId();
      if (!this.tenantReloadReady) {
        return;
      }
      this.cancelAllForms();
      this.reloadAllCatalogData();
    });
  }

  canEditRecord(companyId?: number | null): boolean {
    return canEditScopedRecord(companyId, this.isGlobalAdmin());
  }

  get activeCategoryId(): CatalogCategoryId {
    return this.categories[this.categoryTabIndex]?.id ?? 'generales';
  }

  get activePanel(): CatalogPanelKey | null {
    const catalogId = this.selectedCatalogIdByCategory[this.activeCategoryId];
    const entry = getCategoryById(this.activeCategoryId).catalogs.find((c) => c.id === catalogId);
    return entry?.panelKey ?? null;
  }

  isPanelVisible(panel: CatalogPanelKey): boolean {
    return this.activePanel === panel;
  }

  isCatalogImplemented(categoryId: CatalogCategoryId, catalogId: string): boolean {
    return getCategoryById(categoryId).catalogs.find((c) => c.id === catalogId)?.implemented ?? false;
  }

  isActiveCatalogImplemented(): boolean {
    return this.isCatalogImplemented(this.activeCategoryId, this.selectedCatalogIdByCategory[this.activeCategoryId]);
  }

  onCategoryTabChange(index: number): void {
    this.categoryTabIndex = index;
    this.cancelAllForms();
    this.loadActiveCatalogData();
  }

  onCatalogSelect(categoryId: CatalogCategoryId, catalogId: string): void {
    this.selectedCatalogIdByCategory[categoryId] = catalogId;
    if (categoryId === this.activeCategoryId) {
      this.cancelAllForms();
      this.loadActiveCatalogData();
    }
  }

  private loadActiveCatalogData(): void {
    const panel = this.activePanel;
    if (!panel) {
      return;
    }
    switch (panel) {
      case 'gender':
        this.loadGenders();
        break;
      case 'kinship':
        this.loadKinships();
        break;
      case 'company':
        this.loadCompanies();
        break;
      case 'currency':
        this.loadCurrencies();
        break;
      case 'career':
        this.loadCareers();
        break;
      case 'language':
        this.loadLanguages();
        break;
      case 'shift':
        this.loadShifts();
        break;
      case 'benefit':
        this.loadBenefits();
        break;
      case 'documentType':
        this.loadDocumentTypes();
        break;
      case 'brand':
        this.loadBrands();
        break;
      case 'contractType':
        this.loadContractTypes();
        break;
      case 'coverageType':
        this.loadCoverageTypes();
        break;
      case 'educationLevel':
        this.loadEducationLevels();
        break;
      case 'languageLevel':
        this.loadLanguageLevels();
        break;
      case 'requisitionType':
        this.loadRequisitionTypes();
        break;
      case 'clientCompany':
        this.loadClientCompanies();
        break;
      case 'client':
        this.loadClients();
        break;
      case 'country':
        this.loadCountryRecords();
        this.reloadCountryDropdown();
        break;
      case 'state':
        this.loadStates();
        break;
      case 'municipality':
        this.loadMunicipalities();
        break;
      case 'neighborhood':
        this.loadNeighborhoods();
        break;
      default:
        break;
    }
  }

  private createScope(): TenantDataScope {
    return this.isGlobalAdmin() ? this.createScopeForm.controls.scope.value : 'TENANT';
  }

  private resetCreateScope(): void {
    this.createScopeForm.controls.scope.setValue('TENANT');
  }

  private withCreateScope<T extends object>(payload: T): T & { scope: TenantDataScope } {
    return { ...payload, scope: this.createScope() };
  }

  countries: CatalogCountry[] = [];
  selectedCountryId: number | null = null;
  stateOptions: CatalogState[] = [];
  selectedStateId: number | null = null;
  municipalityOptions: CatalogMunicipality[] = [];
  selectedMunicipalityId: number | null = null;

  genders: CatalogGender[] = [];
  genderTotal = 0;
  genderPageIndex = 0;
  genderPageSize = 10;
  loadingGenders = false;
  savingGender = false;
  editingGenderId: number | null = null;
  showGenderForm = false;

  kinships: CatalogKinship[] = [];
  kinshipTotal = 0;
  kinshipPageIndex = 0;
  kinshipPageSize = 10;
  loadingKinships = false;
  savingKinship = false;
  editingKinshipId: number | null = null;
  showKinshipForm = false;

  clients: CatalogClient[] = [];
  clientTotal = 0;
  clientPageIndex = 0;
  clientPageSize = 10;
  loadingClients = false;
  savingClient = false;
  editingClientId: number | null = null;
  showClientForm = false;

  companies: CatalogCompany[] = [];
  companyTotal = 0;
  companyPageIndex = 0;
  companyPageSize = 10;
  loadingCompanies = false;
  savingCompany = false;
  editingCompanyId: number | null = null;
  showCompanyForm = false;

  currencies: CatalogCurrency[] = [];
  currencyTotal = 0;
  currencyPageIndex = 0;
  currencyPageSize = 10;
  loadingCurrencies = false;
  savingCurrency = false;
  editingCurrencyId: number | null = null;
  showCurrencyForm = false;

  careers: CatalogCareer[] = [];
  careerTotal = 0;
  careerPageIndex = 0;
  careerPageSize = 10;
  loadingCareers = false;
  savingCareer = false;
  editingCareerId: number | null = null;
  showCareerForm = false;

  languages: CatalogLanguage[] = [];
  languageTotal = 0;
  languagePageIndex = 0;
  languagePageSize = 10;
  loadingLanguages = false;
  savingLanguage = false;
  editingLanguageId: number | null = null;
  showLanguageForm = false;

  shifts: CatalogShift[] = [];
  shiftTotal = 0;
  shiftPageIndex = 0;
  shiftPageSize = 10;
  loadingShifts = false;
  savingShift = false;
  editingShiftId: number | null = null;
  showShiftForm = false;

  benefits: CatalogBenefit[] = [];
  benefitTotal = 0;
  benefitPageIndex = 0;
  benefitPageSize = 10;
  loadingBenefits = false;
  savingBenefit = false;
  editingBenefitId: number | null = null;
  showBenefitForm = false;

  documentTypes: CatalogDocumentType[] = [];
  documentTypeTotal = 0;
  documentTypePageIndex = 0;
  documentTypePageSize = 10;
  loadingDocumentTypes = false;
  savingDocumentType = false;
  editingDocumentTypeId: number | null = null;
  showDocumentTypeForm = false;

  brands: CatalogBrand[] = [];
  brandTotal = 0;
  brandPageIndex = 0;
  brandPageSize = 10;
  loadingBrands = false;
  savingBrand = false;
  editingBrandId: number | null = null;
  showBrandForm = false;

  contractTypes: CatalogContractType[] = [];
  contractTypeTotal = 0;
  contractTypePageIndex = 0;
  contractTypePageSize = 10;
  loadingContractTypes = false;
  savingContractType = false;
  editingContractTypeId: number | null = null;
  showContractTypeForm = false;

  coverageTypes: CatalogCoverageType[] = [];
  coverageTypeTotal = 0;
  coverageTypePageIndex = 0;
  coverageTypePageSize = 10;
  loadingCoverageTypes = false;
  savingCoverageType = false;
  editingCoverageTypeId: number | null = null;
  showCoverageTypeForm = false;

  educationLevels: CatalogEducationLevel[] = [];
  educationLevelTotal = 0;
  educationLevelPageIndex = 0;
  educationLevelPageSize = 10;
  loadingEducationLevels = false;
  savingEducationLevel = false;
  editingEducationLevelId: number | null = null;
  showEducationLevelForm = false;

  languageLevels: CatalogLanguageLevel[] = [];
  languageLevelTotal = 0;
  languageLevelPageIndex = 0;
  languageLevelPageSize = 10;
  loadingLanguageLevels = false;
  savingLanguageLevel = false;
  editingLanguageLevelId: number | null = null;
  showLanguageLevelForm = false;

  requisitionTypes: CatalogRequisitionType[] = [];
  requisitionTypeTotal = 0;
  requisitionTypePageIndex = 0;
  requisitionTypePageSize = 10;
  loadingRequisitionTypes = false;
  savingRequisitionType = false;
  editingRequisitionTypeId: number | null = null;
  showRequisitionTypeForm = false;

  clientCompanies: CatalogClientCompany[] = [];
  clientCompanyTotal = 0;
  clientCompanyPageIndex = 0;
  clientCompanyPageSize = 10;
  loadingClientCompanies = false;
  savingClientCompany = false;
  editingClientCompanyId: number | null = null;
  showClientCompanyForm = false;

  countryRecords: CatalogCountry[] = [];
  countryRecordTotal = 0;
  countryPageIndex = 0;
  countryPageSize = 10;
  loadingCountryRecords = false;
  savingCountry = false;
  editingCountryId: number | null = null;
  showCountryForm = false;

  states: CatalogState[] = [];
  stateTotal = 0;
  statePageIndex = 0;
  statePageSize = 10;
  loadingStates = false;
  savingState = false;
  editingStateId: number | null = null;
  showStateForm = false;

  municipalities: CatalogMunicipality[] = [];
  municipalityTotal = 0;
  municipalityPageIndex = 0;
  municipalityPageSize = 10;
  loadingMunicipalities = false;
  savingMunicipality = false;
  editingMunicipalityId: number | null = null;
  showMunicipalityForm = false;

  neighborhoods: CatalogNeighborhood[] = [];
  neighborhoodTotal = 0;
  neighborhoodPageIndex = 0;
  neighborhoodPageSize = 10;
  loadingNeighborhoods = false;
  savingNeighborhood = false;
  editingNeighborhoodId: number | null = null;
  showNeighborhoodForm = false;

  readonly genderColumns = ['code', 'name', 'value', 'active', 'scope', 'actions'];
  readonly kinshipColumns = ['code', 'name', 'active', 'scope', 'actions'];
  readonly clientColumns = ['code', 'tradeName', 'legalName', 'companyArea', 'contactName', 'active', 'scope', 'actions'];
  readonly companyColumns = ['code', 'name', 'tradeName', 'taxId', 'active', 'scope', 'actions'];
  readonly currencyColumns = ['code', 'name', 'symbol', 'denomination', 'active', 'scope', 'actions'];
  readonly careerColumns = ['code', 'name', 'active', 'scope', 'actions'];
  readonly languageColumns = ['code', 'name', 'active', 'scope', 'actions'];
  readonly shiftColumns = ['code', 'name', 'active', 'scope', 'actions'];
  readonly benefitColumns = ['code', 'name', 'active', 'scope', 'actions'];
  readonly documentTypeColumns = ['code', 'name', 'documentType', 'validatesWithAi', 'active', 'scope', 'actions'];
  readonly brandColumns = ['code', 'name', 'active', 'scope', 'actions'];
  readonly contractTypeColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly coverageTypeColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly educationLevelColumns = ['code', 'name', 'description', 'requiresCareer', 'active', 'scope', 'actions'];
  readonly languageLevelColumns = ['code', 'name', 'appliesToCareer', 'active', 'scope', 'actions'];
  readonly requisitionTypeColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly clientCompanyColumns = ['code', 'name', 'tradeName', 'taxId', 'r3Interface', 'active', 'scope', 'actions'];
  readonly countryColumns = ['code', 'secondaryCode', 'name', 'description', 'manpowerId', 'region', 'active', 'scope', 'actions'];
  readonly stateColumns = ['code', 'name', 'shortDescription', 'active', 'scope', 'actions'];
  readonly municipalityColumns = ['code', 'name', 'active', 'scope', 'actions'];
  readonly neighborhoodColumns = ['name', 'postalCode', 'active', 'scope', 'actions'];

  readonly genderForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    value: [''],
    isActive: [true],
  });

  readonly kinshipForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly companyForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    tradeName: [''],
    taxId: [''],
    countryId: [null as number | null],
    street: [''],
    neighborhood: [''],
    municipality: [''],
    stateName: [''],
    logoUrl: [''],
    bannerUrl: [''],
    r3Interface: [false],
    wsSignature: [false],
    isActive: [true],
  });

  readonly clientForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    companyArea: [''],
    contactName: [''],
    contactPosition: [''],
    phone: [''],
    email: [''],
    tradeName: [''],
    legalName: [''],
    isActive: [true],
  });

  readonly currencyForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    symbol: [''],
    denomination: [''],
    isActive: [true],
  });

  readonly careerForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly languageForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly shiftForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly benefitForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly documentTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    documentType: ['', Validators.required],
    validatesWithAi: [false],
    isActive: [true],
  });

  readonly brandForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly contractTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly coverageTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly educationLevelForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    requiresCareer: [false],
    isActive: [true],
  });

  readonly languageLevelForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    appliesToCareer: [false],
    isActive: [true],
  });

  readonly requisitionTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly clientCompanyForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    tradeName: [''],
    taxId: [''],
    r3Interface: [false],
    isActive: [true],
  });

  readonly countryForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    secondaryCode: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    currencyId: [null as number | null],
    languageId: [null as number | null],
    manpowerId: [null as number | null, Validators.required],
    region: ['', Validators.required],
    jobPortalUrl: [''],
    isActive: [true],
  });

  readonly stateForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    shortDescription: [''],
    isActive: [true],
  });

  readonly municipalityForm = this.fb.nonNullable.group({
    stateId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly neighborhoodForm = this.fb.nonNullable.group({
    municipalityId: [null as number | null, Validators.required],
    name: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    isActive: [true],
  });


  private reloadAllCatalogData(): void {
    this.loadKinships();
    this.loadCompanies();
    this.loadLanguages();
    this.loadCountryRecords();
    this.reloadCountryDropdown();
  }

  private cancelAllForms(): void {
    this.cancelGenderForm();
    this.cancelKinshipForm();
    this.cancelCompanyForm();
    this.cancelCurrencyForm();
    this.cancelCareerForm();
    this.cancelLanguageForm();
    this.cancelShiftForm();
    this.cancelBenefitForm();
    this.cancelBrandForm();
    this.cancelDocumentTypeForm();
    this.cancelContractTypeForm();
    this.cancelCoverageTypeForm();
    this.cancelEducationLevelForm();
    this.cancelLanguageLevelForm();
    this.cancelRequisitionTypeForm();
    this.cancelClientCompanyForm();
    this.cancelClientForm();
    this.cancelCountryForm();
    this.cancelStateForm();
    this.cancelMunicipalityForm();
    this.cancelNeighborhoodForm();
  }

  ngOnInit(): void {
    this.tenantReloadReady = true;
    this.loadKinships();
    this.loadCompanies();
    this.loadLanguages();
    this.loadCountryRecords();
    this.reloadCountryDropdown();
  }

  private reloadCountryDropdown(): void {
    this.geographyService.listCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        const mexico = countries.find((c) => c.code === 'MX');
        if (mexico && this.selectedCountryId == null) {
          this.selectedCountryId = mexico.id;
          this.loadStateOptions();
          this.loadCountryCatalogs();
        } else if (this.selectedCountryId != null) {
          this.loadStateOptions();
          this.loadCountryCatalogs();
        }
      },
      error: () => this.snack.open('No se pudieron cargar los países', 'Cerrar', { duration: 4000 }),
    });
  }

  private loadStateOptions(): void {
    if (this.selectedCountryId == null) return;
    this.geographyService.listStates(this.selectedCountryId).subscribe({
      next: (states) => {
        this.stateOptions = states;
        if (this.selectedStateId == null && states.length > 0) {
          this.selectedStateId = states[0].id;
          this.loadMunicipalityOptions();
          this.loadMunicipalities();
        } else if (this.selectedStateId != null) {
          this.loadMunicipalityOptions();
          this.loadMunicipalities();
        }
      },
      error: () => this.snack.open('No se pudieron cargar entidades para el selector', 'Cerrar', { duration: 4000 }),
    });
  }

  private loadMunicipalityOptions(): void {
    if (this.selectedStateId == null) return;
    this.geographyService.listMunicipalities(this.selectedStateId).subscribe({
      next: (municipalities) => {
        this.municipalityOptions = municipalities;
        if (this.selectedMunicipalityId == null && municipalities.length > 0) {
          this.selectedMunicipalityId = municipalities[0].id;
          this.loadNeighborhoods();
        } else if (this.selectedMunicipalityId != null) {
          this.loadNeighborhoods();
        }
      },
      error: () => this.snack.open('No se pudieron cargar municipios para el selector', 'Cerrar', { duration: 4000 }),
    });
  }

  private loadCountryCatalogs(): void {
    this.loadGenders();
    this.loadCurrencies();
    this.loadCareers();
    this.loadShifts();
    this.loadBenefits();
    this.loadDocumentTypes();
    this.loadBrands();
    this.loadContractTypes();
    this.loadCoverageTypes();
    this.loadEducationLevels();
    this.loadLanguageLevels();
    this.loadRequisitionTypes();
    this.loadClientCompanies();
    this.loadStates();
  }

  onCountryChange(countryId: number): void {
    this.selectedCountryId = countryId;
    this.selectedStateId = null;
    this.selectedMunicipalityId = null;
    this.genderPageIndex = 0;
    this.currencyPageIndex = 0;
    this.careerPageIndex = 0;
    this.shiftPageIndex = 0;
    this.benefitPageIndex = 0;
    this.documentTypePageIndex = 0;
    this.brandPageIndex = 0;
    this.contractTypePageIndex = 0;
    this.coverageTypePageIndex = 0;
    this.educationLevelPageIndex = 0;
    this.languageLevelPageIndex = 0;
    this.requisitionTypePageIndex = 0;
    this.clientCompanyPageIndex = 0;
    this.statePageIndex = 0;
    this.municipalityPageIndex = 0;
    this.neighborhoodPageIndex = 0;
    this.cancelGenderForm();
    this.cancelCurrencyForm();
    this.cancelCareerForm();
    this.cancelShiftForm();
    this.cancelBenefitForm();
    this.cancelDocumentTypeForm();
    this.cancelBrandForm();
    this.cancelContractTypeForm();
    this.cancelCoverageTypeForm();
    this.cancelEducationLevelForm();
    this.cancelLanguageLevelForm();
    this.cancelRequisitionTypeForm();
    this.cancelClientCompanyForm();
    this.cancelClientForm();
    this.cancelStateForm();
    this.cancelMunicipalityForm();
    this.cancelNeighborhoodForm();
    this.loadStateOptions();
    this.loadCountryCatalogs();
  }

  onGeoStateChange(stateId: number): void {
    this.selectedStateId = stateId;
    this.selectedMunicipalityId = null;
    this.municipalityPageIndex = 0;
    this.neighborhoodPageIndex = 0;
    this.cancelMunicipalityForm();
    this.cancelNeighborhoodForm();
    this.loadMunicipalityOptions();
    this.loadMunicipalities();
  }

  onMunicipalityChange(municipalityId: number): void {
    this.selectedMunicipalityId = municipalityId;
    this.neighborhoodPageIndex = 0;
    this.cancelNeighborhoodForm();
    this.loadNeighborhoods();
  }

  loadGenders(): void {
    if (this.selectedCountryId == null) return;
    this.loadingGenders = true;
    this.genderService.list(this.selectedCountryId, this.genderPageIndex, this.genderPageSize).subscribe({
      next: (res) => {
        this.genders = res.items;
        this.genderTotal = res.total;
        this.loadingGenders = false;
      },
      error: () => {
        this.loadingGenders = false;
        this.snack.open('No se pudieron cargar los géneros', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadKinships(): void {
    this.loadingKinships = true;
    this.kinshipService.list(this.kinshipPageIndex, this.kinshipPageSize).subscribe({
      next: (res) => {
        this.kinships = res.items;
        this.kinshipTotal = res.total;
        this.loadingKinships = false;
      },
      error: () => {
        this.loadingKinships = false;
        this.snack.open('No se pudieron cargar los parentescos', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadCurrencies(): void {
    if (this.selectedCountryId == null) return;
    this.loadingCurrencies = true;
    this.currencyService.list(this.selectedCountryId, this.currencyPageIndex, this.currencyPageSize).subscribe({
      next: (res) => {
        this.currencies = res.items;
        this.currencyTotal = res.total;
        this.loadingCurrencies = false;
      },
      error: () => {
        this.loadingCurrencies = false;
        this.snack.open('No se pudieron cargar las monedas', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onGenderPage(e: PageEvent): void {
    this.genderPageIndex = e.pageIndex;
    this.genderPageSize = e.pageSize;
    this.loadGenders();
  }

  onKinshipPage(e: PageEvent): void {
    this.kinshipPageIndex = e.pageIndex;
    this.kinshipPageSize = e.pageSize;
    this.loadKinships();
  }

  loadClients(): void {
    this.loadingClients = true;
    this.clientService.list(this.clientPageIndex, this.clientPageSize).subscribe({
      next: (res) => {
        this.clients = res.items;
        this.clientTotal = res.total;
        this.loadingClients = false;
      },
      error: () => {
        this.loadingClients = false;
        this.snack.open('No se pudieron cargar los clientes', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onClientPage(e: PageEvent): void {
    this.clientPageIndex = e.pageIndex;
    this.clientPageSize = e.pageSize;
    this.loadClients();
  }

  loadCompanies(): void {
    this.loadingCompanies = true;
    this.companyService.list(this.companyPageIndex, this.companyPageSize).subscribe({
      next: (res) => {
        this.companies = res.items;
        this.companyTotal = res.total;
        this.loadingCompanies = false;
      },
      error: () => {
        this.loadingCompanies = false;
        this.snack.open('No se pudieron cargar las compañías', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCompanyPage(e: PageEvent): void {
    this.companyPageIndex = e.pageIndex;
    this.companyPageSize = e.pageSize;
    this.loadCompanies();
  }

  onCurrencyPage(e: PageEvent): void {
    this.currencyPageIndex = e.pageIndex;
    this.currencyPageSize = e.pageSize;
    this.loadCurrencies();
  }

  loadCareers(): void {
    if (this.selectedCountryId == null) return;
    this.loadingCareers = true;
    this.careerService.list(this.selectedCountryId, this.careerPageIndex, this.careerPageSize).subscribe({
      next: (res) => {
        this.careers = res.items;
        this.careerTotal = res.total;
        this.loadingCareers = false;
      },
      error: () => {
        this.loadingCareers = false;
        this.snack.open('No se pudieron cargar las carreras', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadLanguages(): void {
    this.loadingLanguages = true;
    this.languageService.list(this.languagePageIndex, this.languagePageSize).subscribe({
      next: (res) => {
        this.languages = res.items;
        this.languageTotal = res.total;
        this.loadingLanguages = false;
      },
      error: () => {
        this.loadingLanguages = false;
        this.snack.open('No se pudieron cargar los idiomas', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCareerPage(e: PageEvent): void {
    this.careerPageIndex = e.pageIndex;
    this.careerPageSize = e.pageSize;
    this.loadCareers();
  }

  onLanguagePage(e: PageEvent): void {
    this.languagePageIndex = e.pageIndex;
    this.languagePageSize = e.pageSize;
    this.loadLanguages();
  }

  loadShifts(): void {
    if (this.selectedCountryId == null) return;
    this.loadingShifts = true;
    this.shiftService.list(this.selectedCountryId, this.shiftPageIndex, this.shiftPageSize).subscribe({
      next: (res) => {
        this.shifts = res.items;
        this.shiftTotal = res.total;
        this.loadingShifts = false;
      },
      error: () => {
        this.loadingShifts = false;
        this.snack.open('No se pudieron cargar los turnos', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadBenefits(): void {
    if (this.selectedCountryId == null) return;
    this.loadingBenefits = true;
    this.benefitService.list(this.selectedCountryId, this.benefitPageIndex, this.benefitPageSize).subscribe({
      next: (res) => {
        this.benefits = res.items;
        this.benefitTotal = res.total;
        this.loadingBenefits = false;
      },
      error: () => {
        this.loadingBenefits = false;
        this.snack.open('No se pudieron cargar las prestaciones', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadDocumentTypes(): void {
    if (this.selectedCountryId == null) return;
    this.loadingDocumentTypes = true;
    this.documentTypeService.list(this.selectedCountryId, this.documentTypePageIndex, this.documentTypePageSize).subscribe({
      next: (res) => {
        this.documentTypes = res.items;
        this.documentTypeTotal = res.total;
        this.loadingDocumentTypes = false;
      },
      error: () => {
        this.loadingDocumentTypes = false;
        this.snack.open('No se pudieron cargar los tipos de documento', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onShiftPage(e: PageEvent): void {
    this.shiftPageIndex = e.pageIndex;
    this.shiftPageSize = e.pageSize;
    this.loadShifts();
  }

  onBenefitPage(e: PageEvent): void {
    this.benefitPageIndex = e.pageIndex;
    this.benefitPageSize = e.pageSize;
    this.loadBenefits();
  }

  onDocumentTypePage(e: PageEvent): void {
    this.documentTypePageIndex = e.pageIndex;
    this.documentTypePageSize = e.pageSize;
    this.loadDocumentTypes();
  }

  loadBrands(): void {
    if (this.selectedCountryId == null) return;
    this.loadingBrands = true;
    this.brandService.list(this.selectedCountryId, this.brandPageIndex, this.brandPageSize).subscribe({
      next: (res) => {
        this.brands = res.items;
        this.brandTotal = res.total;
        this.loadingBrands = false;
      },
      error: () => {
        this.loadingBrands = false;
        this.snack.open('No se pudieron cargar las marcas', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadContractTypes(): void {
    if (this.selectedCountryId == null) return;
    this.loadingContractTypes = true;
    this.contractTypeService.list(this.selectedCountryId, this.contractTypePageIndex, this.contractTypePageSize).subscribe({
      next: (res) => {
        this.contractTypes = res.items;
        this.contractTypeTotal = res.total;
        this.loadingContractTypes = false;
      },
      error: () => {
        this.loadingContractTypes = false;
        this.snack.open('No se pudieron cargar los tipos de contrato', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadCoverageTypes(): void {
    if (this.selectedCountryId == null) return;
    this.loadingCoverageTypes = true;
    this.coverageTypeService.list(this.selectedCountryId, this.coverageTypePageIndex, this.coverageTypePageSize).subscribe({
      next: (res) => {
        this.coverageTypes = res.items;
        this.coverageTypeTotal = res.total;
        this.loadingCoverageTypes = false;
      },
      error: () => {
        this.loadingCoverageTypes = false;
        this.snack.open('No se pudieron cargar los tipos de cobertura', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onBrandPage(e: PageEvent): void {
    this.brandPageIndex = e.pageIndex;
    this.brandPageSize = e.pageSize;
    this.loadBrands();
  }

  onContractTypePage(e: PageEvent): void {
    this.contractTypePageIndex = e.pageIndex;
    this.contractTypePageSize = e.pageSize;
    this.loadContractTypes();
  }

  onCoverageTypePage(e: PageEvent): void {
    this.coverageTypePageIndex = e.pageIndex;
    this.coverageTypePageSize = e.pageSize;
    this.loadCoverageTypes();
  }

  loadEducationLevels(): void {
    if (this.selectedCountryId == null) return;
    this.loadingEducationLevels = true;
    this.educationLevelService
      .list(this.selectedCountryId, this.educationLevelPageIndex, this.educationLevelPageSize)
      .subscribe({
        next: (res) => {
          this.educationLevels = res.items;
          this.educationLevelTotal = res.total;
          this.loadingEducationLevels = false;
        },
        error: () => {
          this.loadingEducationLevels = false;
          this.snack.open('No se pudieron cargar los niveles de educación', 'Cerrar', { duration: 4000 });
        },
      });
  }

  loadLanguageLevels(): void {
    if (this.selectedCountryId == null) return;
    this.loadingLanguageLevels = true;
    this.languageLevelService
      .list(this.selectedCountryId, this.languageLevelPageIndex, this.languageLevelPageSize)
      .subscribe({
        next: (res) => {
          this.languageLevels = res.items;
          this.languageLevelTotal = res.total;
          this.loadingLanguageLevels = false;
        },
        error: () => {
          this.loadingLanguageLevels = false;
          this.snack.open('No se pudieron cargar los niveles de idioma', 'Cerrar', { duration: 4000 });
        },
      });
  }

  loadRequisitionTypes(): void {
    if (this.selectedCountryId == null) return;
    this.loadingRequisitionTypes = true;
    this.requisitionTypeService
      .list(this.selectedCountryId, this.requisitionTypePageIndex, this.requisitionTypePageSize)
      .subscribe({
        next: (res) => {
          this.requisitionTypes = res.items;
          this.requisitionTypeTotal = res.total;
          this.loadingRequisitionTypes = false;
        },
        error: () => {
          this.loadingRequisitionTypes = false;
          this.snack.open('No se pudieron cargar los tipos de requisición', 'Cerrar', { duration: 4000 });
        },
      });
  }

  loadClientCompanies(): void {
    if (this.selectedCountryId == null) return;
    this.loadingClientCompanies = true;
    this.clientCompanyService
      .list(this.selectedCountryId, this.clientCompanyPageIndex, this.clientCompanyPageSize)
      .subscribe({
        next: (res) => {
          this.clientCompanies = res.items;
          this.clientCompanyTotal = res.total;
          this.loadingClientCompanies = false;
        },
        error: () => {
          this.loadingClientCompanies = false;
          this.snack.open('No se pudieron cargar las empresas cliente', 'Cerrar', { duration: 4000 });
        },
      });
  }

  onEducationLevelPage(e: PageEvent): void {
    this.educationLevelPageIndex = e.pageIndex;
    this.educationLevelPageSize = e.pageSize;
    this.loadEducationLevels();
  }

  onLanguageLevelPage(e: PageEvent): void {
    this.languageLevelPageIndex = e.pageIndex;
    this.languageLevelPageSize = e.pageSize;
    this.loadLanguageLevels();
  }

  onRequisitionTypePage(e: PageEvent): void {
    this.requisitionTypePageIndex = e.pageIndex;
    this.requisitionTypePageSize = e.pageSize;
    this.loadRequisitionTypes();
  }

  onClientCompanyPage(e: PageEvent): void {
    this.clientCompanyPageIndex = e.pageIndex;
    this.clientCompanyPageSize = e.pageSize;
    this.loadClientCompanies();
  }

  openCreateGender(): void {
    this.resetCreateScope();
    this.editingGenderId = null;
    this.showGenderForm = true;
    this.genderForm.reset({ countryId: this.selectedCountryId, code: '', name: '', value: '', isActive: true });
  }

  openEditGender(row: CatalogGender): void {
    this.editingGenderId = row.id;
    this.showGenderForm = true;
    this.genderForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      value: row.value ?? '',
      isActive: row.isActive,
    });
  }

  cancelGenderForm(): void {
    this.showGenderForm = false;
    this.editingGenderId = null;
  }

  saveGender(): void {
    if (this.genderForm.invalid) {
      this.genderForm.markAllAsTouched();
      return;
    }
    const value = this.genderForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      value: value.value || undefined,
      isActive: value.isActive,
    };
    this.savingGender = true;
    const request$ =
      this.editingGenderId != null
        ? this.genderService.update(this.editingGenderId, payload)
        : this.genderService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingGender = false;
        this.cancelGenderForm();
        this.loadGenders();
        this.snack.open('Género guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingGender = false;
        this.snack.open('No se pudo guardar el género', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateKinship(): void {
    this.resetCreateScope();
    this.editingKinshipId = null;
    this.showKinshipForm = true;
    this.kinshipForm.reset({ code: '', name: '', isActive: true });
  }

  openEditKinship(row: CatalogKinship): void {
    this.editingKinshipId = row.id;
    this.showKinshipForm = true;
    this.kinshipForm.patchValue({ code: row.code, name: row.name, isActive: row.isActive });
  }

  cancelKinshipForm(): void {
    this.showKinshipForm = false;
    this.editingKinshipId = null;
  }

  saveKinship(): void {
    if (this.kinshipForm.invalid) {
      this.kinshipForm.markAllAsTouched();
      return;
    }
    const value = this.kinshipForm.getRawValue();
    this.savingKinship = true;
    const request$ =
      this.editingKinshipId != null
        ? this.kinshipService.update(this.editingKinshipId, value)
        : this.kinshipService.create(this.withCreateScope(value));
    request$.subscribe({
      next: () => {
        this.savingKinship = false;
        this.cancelKinshipForm();
        this.loadKinships();
        this.snack.open('Parentesco guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingKinship = false;
        this.snack.open('No se pudo guardar el parentesco', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateClient(): void {
    this.resetCreateScope();
    this.editingClientId = null;
    this.showClientForm = true;
    this.clientForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      companyArea: '',
      contactName: '',
      contactPosition: '',
      phone: '',
      email: '',
      tradeName: '',
      legalName: '',
      isActive: true,
    });
  }

  openEditClient(row: CatalogClient): void {
    this.editingClientId = row.id;
    this.showClientForm = true;
    this.clientForm.patchValue({
      countryId: row.countryId ?? null,
      code: row.code,
      companyArea: row.companyArea ?? '',
      contactName: row.contactName ?? '',
      contactPosition: row.contactPosition ?? '',
      phone: row.phone ?? '',
      email: row.email ?? '',
      tradeName: row.tradeName ?? '',
      legalName: row.legalName ?? '',
      isActive: row.isActive,
    });
  }

  cancelClientForm(): void {
    this.showClientForm = false;
    this.editingClientId = null;
  }

  saveClient(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }
    const value = this.clientForm.getRawValue();
    this.savingClient = true;
    const request$ =
      this.editingClientId != null
        ? this.clientService.update(this.editingClientId, value)
        : this.clientService.create(this.withCreateScope(value));
    request$.subscribe({
      next: () => {
        this.savingClient = false;
        this.cancelClientForm();
        this.loadClients();
        this.snack.open('Cliente guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingClient = false;
        this.snack.open('No se pudo guardar el cliente', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateCompany(): void {
    this.resetCreateScope();
    this.editingCompanyId = null;
    this.showCompanyForm = true;
    this.companyForm.reset({
      code: '',
      name: '',
      description: '',
      tradeName: '',
      taxId: '',
      countryId: null,
      street: '',
      neighborhood: '',
      municipality: '',
      stateName: '',
      logoUrl: '',
      bannerUrl: '',
      r3Interface: false,
      wsSignature: false,
      isActive: true,
    });
  }

  openEditCompany(row: CatalogCompany): void {
    this.editingCompanyId = row.id;
    this.showCompanyForm = true;
    this.companyForm.patchValue({
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      tradeName: row.tradeName ?? '',
      taxId: row.taxId ?? '',
      countryId: row.countryId ?? null,
      street: row.street ?? '',
      neighborhood: row.neighborhood ?? '',
      municipality: row.municipality ?? '',
      stateName: row.stateName ?? '',
      logoUrl: row.logoUrl ?? '',
      bannerUrl: row.bannerUrl ?? '',
      r3Interface: row.r3Interface ?? false,
      wsSignature: row.wsSignature ?? false,
      isActive: row.isActive,
    });
  }

  cancelCompanyForm(): void {
    this.showCompanyForm = false;
    this.editingCompanyId = null;
  }

  saveCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    const value = this.companyForm.getRawValue();
    this.savingCompany = true;
    const request$ =
      this.editingCompanyId != null
        ? this.companyService.update(this.editingCompanyId, value)
        : this.companyService.create(value);
    request$.subscribe({
      next: () => {
        this.savingCompany = false;
        this.cancelCompanyForm();
        this.loadCompanies();
        this.snack.open('Compañía guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCompany = false;
        this.snack.open('No se pudo guardar la compañía', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateCurrency(): void {
    this.resetCreateScope();
    this.editingCurrencyId = null;
    this.showCurrencyForm = true;
    this.currencyForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      symbol: '',
      denomination: '',
      isActive: true,
    });
  }

  openEditCurrency(row: CatalogCurrency): void {
    this.editingCurrencyId = row.id;
    this.showCurrencyForm = true;
    this.currencyForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      symbol: row.symbol ?? '',
      denomination: row.denomination ?? '',
      isActive: row.isActive,
    });
  }

  cancelCurrencyForm(): void {
    this.showCurrencyForm = false;
    this.editingCurrencyId = null;
  }

  saveCurrency(): void {
    if (this.currencyForm.invalid) {
      this.currencyForm.markAllAsTouched();
      return;
    }
    const value = this.currencyForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      symbol: value.symbol || undefined,
      denomination: value.denomination || undefined,
      isActive: value.isActive,
    };
    this.savingCurrency = true;
    const request$ =
      this.editingCurrencyId != null
        ? this.currencyService.update(this.editingCurrencyId, payload)
        : this.currencyService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingCurrency = false;
        this.cancelCurrencyForm();
        this.loadCurrencies();
        this.snack.open('Moneda guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCurrency = false;
        this.snack.open('No se pudo guardar la moneda', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateCareer(): void {
    this.resetCreateScope();
    this.editingCareerId = null;
    this.showCareerForm = true;
    this.careerForm.reset({ countryId: this.selectedCountryId, code: '', name: '', isActive: true });
  }

  openEditCareer(row: CatalogCareer): void {
    this.editingCareerId = row.id;
    this.showCareerForm = true;
    this.careerForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      isActive: row.isActive,
    });
  }

  cancelCareerForm(): void {
    this.showCareerForm = false;
    this.editingCareerId = null;
  }

  saveCareer(): void {
    if (this.careerForm.invalid) {
      this.careerForm.markAllAsTouched();
      return;
    }
    const value = this.careerForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      isActive: value.isActive,
    };
    this.savingCareer = true;
    const request$ =
      this.editingCareerId != null
        ? this.careerService.update(this.editingCareerId, payload)
        : this.careerService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingCareer = false;
        this.cancelCareerForm();
        this.loadCareers();
        this.snack.open('Carrera guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCareer = false;
        this.snack.open('No se pudo guardar la carrera', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateLanguage(): void {
    this.resetCreateScope();
    this.editingLanguageId = null;
    this.showLanguageForm = true;
    this.languageForm.reset({ code: '', name: '', isActive: true });
  }

  openEditLanguage(row: CatalogLanguage): void {
    this.editingLanguageId = row.id;
    this.showLanguageForm = true;
    this.languageForm.patchValue({ code: row.code, name: row.name, isActive: row.isActive });
  }

  cancelLanguageForm(): void {
    this.showLanguageForm = false;
    this.editingLanguageId = null;
  }

  saveLanguage(): void {
    if (this.languageForm.invalid) {
      this.languageForm.markAllAsTouched();
      return;
    }
    const value = this.languageForm.getRawValue();
    this.savingLanguage = true;
    const request$ =
      this.editingLanguageId != null
        ? this.languageService.update(this.editingLanguageId, value)
        : this.languageService.create(this.withCreateScope(value));
    request$.subscribe({
      next: () => {
        this.savingLanguage = false;
        this.cancelLanguageForm();
        this.loadLanguages();
        this.snack.open('Idioma guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingLanguage = false;
        this.snack.open('No se pudo guardar el idioma', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateShift(): void {
    this.resetCreateScope();
    this.editingShiftId = null;
    this.showShiftForm = true;
    this.shiftForm.reset({ countryId: this.selectedCountryId, code: '', name: '', isActive: true });
  }

  openEditShift(row: CatalogShift): void {
    this.editingShiftId = row.id;
    this.showShiftForm = true;
    this.shiftForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      isActive: row.isActive,
    });
  }

  cancelShiftForm(): void {
    this.showShiftForm = false;
    this.editingShiftId = null;
  }

  saveShift(): void {
    if (this.shiftForm.invalid) {
      this.shiftForm.markAllAsTouched();
      return;
    }
    const value = this.shiftForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      isActive: value.isActive,
    };
    this.savingShift = true;
    const request$ =
      this.editingShiftId != null
        ? this.shiftService.update(this.editingShiftId, payload)
        : this.shiftService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingShift = false;
        this.cancelShiftForm();
        this.loadShifts();
        this.snack.open('Turno guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingShift = false;
        this.snack.open('No se pudo guardar el turno', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateBenefit(): void {
    this.resetCreateScope();
    this.editingBenefitId = null;
    this.showBenefitForm = true;
    this.benefitForm.reset({ countryId: this.selectedCountryId, code: '', name: '', isActive: true });
  }

  openEditBenefit(row: CatalogBenefit): void {
    this.editingBenefitId = row.id;
    this.showBenefitForm = true;
    this.benefitForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      isActive: row.isActive,
    });
  }

  cancelBenefitForm(): void {
    this.showBenefitForm = false;
    this.editingBenefitId = null;
  }

  saveBenefit(): void {
    if (this.benefitForm.invalid) {
      this.benefitForm.markAllAsTouched();
      return;
    }
    const value = this.benefitForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      isActive: value.isActive,
    };
    this.savingBenefit = true;
    const request$ =
      this.editingBenefitId != null
        ? this.benefitService.update(this.editingBenefitId, payload)
        : this.benefitService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingBenefit = false;
        this.cancelBenefitForm();
        this.loadBenefits();
        this.snack.open('Prestación guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingBenefit = false;
        this.snack.open('No se pudo guardar la prestación', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateDocumentType(): void {
    this.resetCreateScope();
    this.editingDocumentTypeId = null;
    this.showDocumentTypeForm = true;
    this.documentTypeForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      documentType: '',
      validatesWithAi: false,
      isActive: true,
    });
  }

  openEditDocumentType(row: CatalogDocumentType): void {
    this.editingDocumentTypeId = row.id;
    this.showDocumentTypeForm = true;
    this.documentTypeForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      documentType: row.documentType,
      validatesWithAi: row.validatesWithAi,
      isActive: row.isActive,
    });
  }

  cancelDocumentTypeForm(): void {
    this.showDocumentTypeForm = false;
    this.editingDocumentTypeId = null;
  }

  saveDocumentType(): void {
    if (this.documentTypeForm.invalid) {
      this.documentTypeForm.markAllAsTouched();
      return;
    }
    const value = this.documentTypeForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      documentType: value.documentType,
      validatesWithAi: value.validatesWithAi,
      isActive: value.isActive,
    };
    this.savingDocumentType = true;
    const request$ =
      this.editingDocumentTypeId != null
        ? this.documentTypeService.update(this.editingDocumentTypeId, payload)
        : this.documentTypeService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingDocumentType = false;
        this.cancelDocumentTypeForm();
        this.loadDocumentTypes();
        this.snack.open('Tipo de documento guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingDocumentType = false;
        this.snack.open('No se pudo guardar el tipo de documento', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateBrand(): void {
    this.resetCreateScope();
    this.editingBrandId = null;
    this.showBrandForm = true;
    this.brandForm.reset({ countryId: this.selectedCountryId, code: '', name: '', isActive: true });
  }

  openEditBrand(row: CatalogBrand): void {
    this.editingBrandId = row.id;
    this.showBrandForm = true;
    this.brandForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      isActive: row.isActive,
    });
  }

  cancelBrandForm(): void {
    this.showBrandForm = false;
    this.editingBrandId = null;
  }

  saveBrand(): void {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }
    const value = this.brandForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      isActive: value.isActive,
    };
    this.savingBrand = true;
    const request$ =
      this.editingBrandId != null
        ? this.brandService.update(this.editingBrandId, payload)
        : this.brandService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingBrand = false;
        this.cancelBrandForm();
        this.loadBrands();
        this.snack.open('Marca guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingBrand = false;
        this.snack.open('No se pudo guardar la marca', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateContractType(): void {
    this.resetCreateScope();
    this.editingContractTypeId = null;
    this.showContractTypeForm = true;
    this.contractTypeForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      isActive: true,
    });
  }

  openEditContractType(row: CatalogContractType): void {
    this.editingContractTypeId = row.id;
    this.showContractTypeForm = true;
    this.contractTypeForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelContractTypeForm(): void {
    this.showContractTypeForm = false;
    this.editingContractTypeId = null;
  }

  saveContractType(): void {
    if (this.contractTypeForm.invalid) {
      this.contractTypeForm.markAllAsTouched();
      return;
    }
    const value = this.contractTypeForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingContractType = true;
    const request$ =
      this.editingContractTypeId != null
        ? this.contractTypeService.update(this.editingContractTypeId, payload)
        : this.contractTypeService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingContractType = false;
        this.cancelContractTypeForm();
        this.loadContractTypes();
        this.snack.open('Tipo de contrato guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingContractType = false;
        this.snack.open('No se pudo guardar el tipo de contrato', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateCoverageType(): void {
    this.resetCreateScope();
    this.editingCoverageTypeId = null;
    this.showCoverageTypeForm = true;
    this.coverageTypeForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      isActive: true,
    });
  }

  openEditCoverageType(row: CatalogCoverageType): void {
    this.editingCoverageTypeId = row.id;
    this.showCoverageTypeForm = true;
    this.coverageTypeForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelCoverageTypeForm(): void {
    this.showCoverageTypeForm = false;
    this.editingCoverageTypeId = null;
  }

  saveCoverageType(): void {
    if (this.coverageTypeForm.invalid) {
      this.coverageTypeForm.markAllAsTouched();
      return;
    }
    const value = this.coverageTypeForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingCoverageType = true;
    const request$ =
      this.editingCoverageTypeId != null
        ? this.coverageTypeService.update(this.editingCoverageTypeId, payload)
        : this.coverageTypeService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingCoverageType = false;
        this.cancelCoverageTypeForm();
        this.loadCoverageTypes();
        this.snack.open('Tipo de cobertura guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCoverageType = false;
        this.snack.open('No se pudo guardar el tipo de cobertura', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateEducationLevel(): void {
    this.resetCreateScope();
    this.editingEducationLevelId = null;
    this.showEducationLevelForm = true;
    this.educationLevelForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      requiresCareer: false,
      isActive: true,
    });
  }

  openEditEducationLevel(row: CatalogEducationLevel): void {
    this.editingEducationLevelId = row.id;
    this.showEducationLevelForm = true;
    this.educationLevelForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      requiresCareer: row.requiresCareer,
      isActive: row.isActive,
    });
  }

  cancelEducationLevelForm(): void {
    this.showEducationLevelForm = false;
    this.editingEducationLevelId = null;
  }

  saveEducationLevel(): void {
    if (this.educationLevelForm.invalid) {
      this.educationLevelForm.markAllAsTouched();
      return;
    }
    const value = this.educationLevelForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      requiresCareer: value.requiresCareer,
      isActive: value.isActive,
    };
    this.savingEducationLevel = true;
    const request$ =
      this.editingEducationLevelId != null
        ? this.educationLevelService.update(this.editingEducationLevelId, payload)
        : this.educationLevelService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingEducationLevel = false;
        this.cancelEducationLevelForm();
        this.loadEducationLevels();
        this.snack.open('Nivel de educación guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingEducationLevel = false;
        this.snack.open('No se pudo guardar el nivel de educación', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateLanguageLevel(): void {
    this.resetCreateScope();
    this.editingLanguageLevelId = null;
    this.showLanguageLevelForm = true;
    this.languageLevelForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      appliesToCareer: false,
      isActive: true,
    });
  }

  openEditLanguageLevel(row: CatalogLanguageLevel): void {
    this.editingLanguageLevelId = row.id;
    this.showLanguageLevelForm = true;
    this.languageLevelForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      appliesToCareer: row.appliesToCareer,
      isActive: row.isActive,
    });
  }

  cancelLanguageLevelForm(): void {
    this.showLanguageLevelForm = false;
    this.editingLanguageLevelId = null;
  }

  saveLanguageLevel(): void {
    if (this.languageLevelForm.invalid) {
      this.languageLevelForm.markAllAsTouched();
      return;
    }
    const value = this.languageLevelForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      appliesToCareer: value.appliesToCareer,
      isActive: value.isActive,
    };
    this.savingLanguageLevel = true;
    const request$ =
      this.editingLanguageLevelId != null
        ? this.languageLevelService.update(this.editingLanguageLevelId, payload)
        : this.languageLevelService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingLanguageLevel = false;
        this.cancelLanguageLevelForm();
        this.loadLanguageLevels();
        this.snack.open('Nivel de idioma guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingLanguageLevel = false;
        this.snack.open('No se pudo guardar el nivel de idioma', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateRequisitionType(): void {
    this.resetCreateScope();
    this.editingRequisitionTypeId = null;
    this.showRequisitionTypeForm = true;
    this.requisitionTypeForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      isActive: true,
    });
  }

  openEditRequisitionType(row: CatalogRequisitionType): void {
    this.editingRequisitionTypeId = row.id;
    this.showRequisitionTypeForm = true;
    this.requisitionTypeForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelRequisitionTypeForm(): void {
    this.showRequisitionTypeForm = false;
    this.editingRequisitionTypeId = null;
  }

  saveRequisitionType(): void {
    if (this.requisitionTypeForm.invalid) {
      this.requisitionTypeForm.markAllAsTouched();
      return;
    }
    const value = this.requisitionTypeForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingRequisitionType = true;
    const request$ =
      this.editingRequisitionTypeId != null
        ? this.requisitionTypeService.update(this.editingRequisitionTypeId, payload)
        : this.requisitionTypeService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingRequisitionType = false;
        this.cancelRequisitionTypeForm();
        this.loadRequisitionTypes();
        this.snack.open('Tipo de requisición guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingRequisitionType = false;
        this.snack.open('No se pudo guardar el tipo de requisición', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateClientCompany(): void {
    this.resetCreateScope();
    this.editingClientCompanyId = null;
    this.showClientCompanyForm = true;
    this.clientCompanyForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      tradeName: '',
      taxId: '',
      r3Interface: false,
      isActive: true,
    });
  }

  openEditClientCompany(row: CatalogClientCompany): void {
    this.editingClientCompanyId = row.id;
    this.showClientCompanyForm = true;
    this.clientCompanyForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      tradeName: row.tradeName ?? '',
      taxId: row.taxId ?? '',
      r3Interface: row.r3Interface,
      isActive: row.isActive,
    });
  }

  cancelClientCompanyForm(): void {
    this.showClientCompanyForm = false;
    this.editingClientCompanyId = null;
  }

  saveClientCompany(): void {
    if (this.clientCompanyForm.invalid) {
      this.clientCompanyForm.markAllAsTouched();
      return;
    }
    const value = this.clientCompanyForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      tradeName: value.tradeName || undefined,
      taxId: value.taxId || undefined,
      r3Interface: value.r3Interface,
      isActive: value.isActive,
    };
    this.savingClientCompany = true;
    const request$ =
      this.editingClientCompanyId != null
        ? this.clientCompanyService.update(this.editingClientCompanyId, payload)
        : this.clientCompanyService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingClientCompany = false;
        this.cancelClientCompanyForm();
        this.loadClientCompanies();
        this.snack.open('Empresa cliente guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingClientCompany = false;
        this.snack.open('No se pudo guardar la empresa cliente', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadCountryRecords(): void {
    this.loadingCountryRecords = true;
    this.geographyService.listCountriesPage(this.countryPageIndex, this.countryPageSize).subscribe({
      next: (res) => {
        this.countryRecords = res.items;
        this.countryRecordTotal = res.total;
        this.loadingCountryRecords = false;
      },
      error: () => {
        this.loadingCountryRecords = false;
        this.snack.open('No se pudieron cargar los países', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadStates(): void {
    if (this.selectedCountryId == null) return;
    this.loadingStates = true;
    this.geographyService.listStatesPage(this.selectedCountryId, this.statePageIndex, this.statePageSize).subscribe({
      next: (res) => {
        this.states = res.items;
        this.stateTotal = res.total;
        this.loadingStates = false;
      },
      error: () => {
        this.loadingStates = false;
        this.snack.open('No se pudieron cargar las entidades federativas', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCountryPage(e: PageEvent): void {
    this.countryPageIndex = e.pageIndex;
    this.countryPageSize = e.pageSize;
    this.loadCountryRecords();
  }

  onStatePage(e: PageEvent): void {
    this.statePageIndex = e.pageIndex;
    this.statePageSize = e.pageSize;
    this.loadStates();
  }

  openCreateCountry(): void {
    this.resetCreateScope();
    this.editingCountryId = null;
    this.showCountryForm = true;
    this.countryForm.reset({
      code: '',
      secondaryCode: '',
      name: '',
      description: '',
      currencyId: null,
      languageId: null,
      manpowerId: null,
      region: '',
      jobPortalUrl: '',
      isActive: true,
    });
  }

  openEditCountry(row: CatalogCountry): void {
    this.editingCountryId = row.id;
    this.showCountryForm = true;
    this.countryForm.patchValue({
      code: row.code,
      secondaryCode: row.secondaryCode ?? '',
      name: row.name,
      description: row.description ?? '',
      currencyId: row.currencyId ?? null,
      languageId: row.languageId ?? null,
      manpowerId: row.manpowerId ?? null,
      region: row.region ?? '',
      jobPortalUrl: row.jobPortalUrl ?? '',
      isActive: row.isActive,
    });
  }

  cancelCountryForm(): void {
    this.showCountryForm = false;
    this.editingCountryId = null;
  }

  saveCountry(): void {
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }
    const value = this.countryForm.getRawValue();
    const payload = {
      code: value.code,
      secondaryCode: value.secondaryCode || undefined,
      name: value.name,
      description: value.description,
      currencyId: value.currencyId ?? undefined,
      languageId: value.languageId ?? undefined,
      manpowerId: value.manpowerId!,
      region: value.region,
      jobPortalUrl: value.jobPortalUrl || undefined,
      isActive: value.isActive,
    };
    this.savingCountry = true;
    const request$ =
      this.editingCountryId != null
        ? this.geographyService.updateCountry(this.editingCountryId, payload)
        : this.geographyService.createCountry(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingCountry = false;
        this.cancelCountryForm();
        this.loadCountryRecords();
        this.reloadCountryDropdown();
        this.snack.open('País guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCountry = false;
        this.snack.open('No se pudo guardar el país', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateState(): void {
    this.resetCreateScope();
    this.editingStateId = null;
    this.showStateForm = true;
    this.stateForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      shortDescription: '',
      isActive: true,
    });
  }

  openEditState(row: CatalogState): void {
    this.editingStateId = row.id;
    this.showStateForm = true;
    this.stateForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      shortDescription: row.shortDescription ?? '',
      isActive: row.isActive,
    });
  }

  cancelStateForm(): void {
    this.showStateForm = false;
    this.editingStateId = null;
  }

  saveState(): void {
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      return;
    }
    const value = this.stateForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      shortDescription: value.shortDescription,
      isActive: value.isActive,
    };
    this.savingState = true;
    const request$ =
      this.editingStateId != null
        ? this.geographyService.updateState(this.editingStateId, payload)
        : this.geographyService.createState(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingState = false;
        this.cancelStateForm();
        this.loadStates();
        this.snack.open('Entidad federativa guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingState = false;
        this.snack.open('No se pudo guardar la entidad federativa', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadMunicipalities(): void {
    if (this.selectedStateId == null) return;
    this.loadingMunicipalities = true;
    this.geographyService
      .listMunicipalitiesPage(this.selectedStateId, this.municipalityPageIndex, this.municipalityPageSize)
      .subscribe({
        next: (res) => {
          this.municipalities = res.items;
          this.municipalityTotal = res.total;
          this.loadingMunicipalities = false;
        },
        error: () => {
          this.loadingMunicipalities = false;
          this.snack.open('No se pudieron cargar los municipios', 'Cerrar', { duration: 4000 });
        },
      });
  }

  loadNeighborhoods(): void {
    if (this.selectedMunicipalityId == null) return;
    this.loadingNeighborhoods = true;
    this.geographyService
      .listNeighborhoodsPage(this.selectedMunicipalityId, this.neighborhoodPageIndex, this.neighborhoodPageSize)
      .subscribe({
        next: (res) => {
          this.neighborhoods = res.items;
          this.neighborhoodTotal = res.total;
          this.loadingNeighborhoods = false;
        },
        error: () => {
          this.loadingNeighborhoods = false;
          this.snack.open('No se pudieron cargar las colonias', 'Cerrar', { duration: 4000 });
        },
      });
  }

  onMunicipalityPage(e: PageEvent): void {
    this.municipalityPageIndex = e.pageIndex;
    this.municipalityPageSize = e.pageSize;
    this.loadMunicipalities();
  }

  onNeighborhoodPage(e: PageEvent): void {
    this.neighborhoodPageIndex = e.pageIndex;
    this.neighborhoodPageSize = e.pageSize;
    this.loadNeighborhoods();
  }

  openCreateMunicipality(): void {
    this.resetCreateScope();
    this.editingMunicipalityId = null;
    this.showMunicipalityForm = true;
    this.municipalityForm.reset({ stateId: this.selectedStateId, code: '', name: '', isActive: true });
  }

  openEditMunicipality(row: CatalogMunicipality): void {
    this.editingMunicipalityId = row.id;
    this.showMunicipalityForm = true;
    this.municipalityForm.patchValue({
      stateId: row.stateId,
      code: row.code ?? '',
      name: row.name,
      isActive: row.isActive,
    });
  }

  cancelMunicipalityForm(): void {
    this.showMunicipalityForm = false;
    this.editingMunicipalityId = null;
  }

  saveMunicipality(): void {
    if (this.municipalityForm.invalid) {
      this.municipalityForm.markAllAsTouched();
      return;
    }
    const value = this.municipalityForm.getRawValue();
    const payload = {
      stateId: value.stateId!,
      code: value.code,
      name: value.name,
      isActive: value.isActive,
    };
    this.savingMunicipality = true;
    const request$ =
      this.editingMunicipalityId != null
        ? this.geographyService.updateMunicipality(this.editingMunicipalityId, payload)
        : this.geographyService.createMunicipality(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingMunicipality = false;
        this.cancelMunicipalityForm();
        this.loadMunicipalities();
        this.loadMunicipalityOptions();
        this.snack.open('Municipio guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingMunicipality = false;
        this.snack.open('No se pudo guardar el municipio', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateNeighborhood(): void {
    this.resetCreateScope();
    this.editingNeighborhoodId = null;
    this.showNeighborhoodForm = true;
    this.neighborhoodForm.reset({
      municipalityId: this.selectedMunicipalityId,
      name: '',
      postalCode: '',
      isActive: true,
    });
  }

  openEditNeighborhood(row: CatalogNeighborhood): void {
    this.editingNeighborhoodId = row.id;
    this.showNeighborhoodForm = true;
    this.neighborhoodForm.patchValue({
      municipalityId: row.municipalityId,
      name: row.name,
      postalCode: row.postalCode,
      isActive: row.isActive,
    });
  }

  cancelNeighborhoodForm(): void {
    this.showNeighborhoodForm = false;
    this.editingNeighborhoodId = null;
  }

  saveNeighborhood(): void {
    if (this.neighborhoodForm.invalid) {
      this.neighborhoodForm.markAllAsTouched();
      return;
    }
    const value = this.neighborhoodForm.getRawValue();
    const payload = {
      municipalityId: value.municipalityId!,
      name: value.name,
      postalCode: value.postalCode,
      isActive: value.isActive,
    };
    this.savingNeighborhood = true;
    const request$ =
      this.editingNeighborhoodId != null
        ? this.geographyService.updateNeighborhood(this.editingNeighborhoodId, payload)
        : this.geographyService.createNeighborhood(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingNeighborhood = false;
        this.cancelNeighborhoodForm();
        this.loadNeighborhoods();
        this.snack.open('Colonia guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingNeighborhood = false;
        this.snack.open('No se pudo guardar la colonia', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
