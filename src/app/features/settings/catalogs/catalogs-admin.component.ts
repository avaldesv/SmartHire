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
import { CatalogClientService } from '../../../core/services/catalog-client.service';
import { CatalogCompanyService } from '../../../core/services/catalog-company.service';
import { CatalogCoverageCategoryService } from '../../../core/services/catalog-coverage-category.service';
import { CatalogCoverageCategory } from '../../../shared/models/catalog-coverage-category.model';
import { CatalogCharacteristicService } from '../../../core/services/catalog-characteristic.service';
import { CatalogCharacteristic } from '../../../shared/models/catalog-characteristic.model';
import { CatalogCategoryService } from '../../../core/services/catalog-category.service';
import { CatalogGeneralCategoryService } from '../../../core/services/catalog-general-category.service';
import { CatalogCategory } from '../../../shared/models/catalog-category.model';
import { CatalogGeneralCategory } from '../../../shared/models/catalog-general-category.model';
import { CatalogMaritalStatusService } from '../../../core/services/catalog-marital-status.service';
import { CatalogMaritalStatus } from '../../../shared/models/catalog-marital-status.model';
import { CatalogExperienceLevelService } from '../../../core/services/catalog-experience-level.service';
import { CatalogExperienceLevel } from '../../../shared/models/catalog-experience-level.model';
import { CatalogToolService } from '../../../core/services/catalog-tool.service';
import { CatalogTool } from '../../../shared/models/catalog-tool.model';
import { CatalogWorkScheduleService } from '../../../core/services/catalog-work-schedule.service';
import { CatalogWorkSchedule } from '../../../shared/models/catalog-work-schedule.model';
import { CatalogWorkplaceService } from '../../../core/services/catalog-workplace.service';
import { CatalogWorkplace } from '../../../shared/models/catalog-workplace.model';
import { CatalogRequirementService } from '../../../core/services/catalog-requirement.service';
import { CatalogRequirement } from '../../../shared/models/catalog-requirement.model';
import { CatalogResponsibilityLevelService } from '../../../core/services/catalog-responsibility-level.service';
import { CatalogResponsibilityLevel } from '../../../shared/models/catalog-responsibility-level.model';
import { CatalogDisabilityTypeService } from '../../../core/services/catalog-disability-type.service';
import { CatalogDisabilityType } from '../../../shared/models/catalog-disability-type.model';
import { CatalogBusinessUnitService } from '../../../core/services/catalog-business-unit.service';
import { CatalogBusinessUnit } from '../../../shared/models/catalog-business-unit.model';
import { CatalogPositionTypeService } from '../../../core/services/catalog-position-type.service';
import { CatalogPositionType } from '../../../shared/models/catalog-position-type.model';
import { CatalogCompanyAreaService } from '../../../core/services/catalog-company-area.service';
import { CatalogCompanyArea } from '../../../shared/models/catalog-company-area.model';
import { CatalogCompanyDepartmentService } from '../../../core/services/catalog-company-department.service';
import { CatalogCompanyDepartment } from '../../../shared/models/catalog-company-department.model';
import { CatalogBranchService } from '../../../core/services/catalog-branch.service';
import { CatalogBranch } from '../../../shared/models/catalog-branch.model';
import { SecurityRecruiterGroupService } from '../../../core/services/security-recruiter-group.service';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { CatalogJobPortalService } from '../../../core/services/catalog-job-portal.service';
import { CatalogJobPortal } from '../../../shared/models/catalog-job-portal.model';
import { QuestionnaireQuestionService } from '../../../core/services/questionnaire-question.service';
import { QuestionnaireQuestion } from '../../../shared/models/questionnaire-question.model';
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
import { NotificationsAdminComponent } from '../notifications/notifications-admin.component';
import { ScopeBadgeComponent } from '../../../shared/components/scope-badge/scope-badge.component';
import { CatalogListActionsComponent } from './catalog-list-actions.component';
import { CatalogTableImportExportActionsComponent } from './catalog-table-import-export-actions.component';
import { TenantDataScope } from '../../../shared/models/tenant-data-scope.model';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';
import {
  CATALOG_CATEGORIES,
  CatalogCategoryId,
  CatalogPanelKey,
  ensureValidCatalogSelection,
  getCategoryById,
  resolveVisibleCategories,
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
    NotificationsAdminComponent,
    CatalogListActionsComponent,
    CatalogTableImportExportActionsComponent,
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
  readonly visibleCategories = computed(() => resolveVisibleCategories(this.isGlobalAdmin()));
  categoryTabIndex = 0;
  selectedCatalogIdByCategory: Record<CatalogCategoryId, string> = {
    generales: 'gender',
    cuestionario: 'questionnaireCategory',
    notificaciones: 'messages',
    empresas: 'companyArea',
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
  private readonly clientService = inject(CatalogClientService);
  private readonly recruiterGroupService = inject(SecurityRecruiterGroupService);
  private readonly jobPortalService = inject(CatalogJobPortalService);
  private readonly contractTypeService = inject(CatalogContractTypeService);
  private readonly companyAreaService = inject(CatalogCompanyAreaService);
  private readonly companyDepartmentService = inject(CatalogCompanyDepartmentService);
  private readonly branchService = inject(CatalogBranchService);
  private readonly coverageCategoryService = inject(CatalogCoverageCategoryService);
  private readonly characteristicService = inject(CatalogCharacteristicService);
  private readonly generalCategoryService = inject(CatalogGeneralCategoryService);
  private readonly catalogCategoryService = inject(CatalogCategoryService);
  private readonly questionnaireQuestionService = inject(QuestionnaireQuestionService);
  private readonly maritalStatusService = inject(CatalogMaritalStatusService);
  private readonly experienceLevelService = inject(CatalogExperienceLevelService);
  private readonly toolService = inject(CatalogToolService);
  private readonly workScheduleService = inject(CatalogWorkScheduleService);
  private readonly workplaceService = inject(CatalogWorkplaceService);
  private readonly requirementService = inject(CatalogRequirementService);
  private readonly responsibilityLevelService = inject(CatalogResponsibilityLevelService);
  private readonly disabilityTypeService = inject(CatalogDisabilityTypeService);
  private readonly businessUnitService = inject(CatalogBusinessUnitService);
  private readonly positionTypeService = inject(CatalogPositionTypeService);
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
      this.isGlobalAdmin();
      if (!this.tenantReloadReady) {
        return;
      }
      this.normalizeCatalogSelections();
      this.cancelAllForms();
      this.reloadAllCatalogData();
    });
  }

  private normalizeCatalogSelections(): void {
    const isGlobalAdmin = this.isGlobalAdmin();
    for (const category of CATALOG_CATEGORIES) {
      this.selectedCatalogIdByCategory[category.id] = ensureValidCatalogSelection(
        category.id,
        this.selectedCatalogIdByCategory[category.id],
        isGlobalAdmin,
      );
    }
    const visible = this.visibleCategories();
    if (this.categoryTabIndex >= visible.length) {
      this.categoryTabIndex = 0;
    }
  }

  canEditRecord(companyId?: number | null): boolean {
    return canEditScopedRecord(companyId, this.isGlobalAdmin());
  }

  reloadCatalogAfterImport(panel: CatalogPanelKey): void {
    switch (panel) {
      case 'gender':
        this.loadGenders();
        break;
      case 'career':
        this.loadCareers();
        break;
      case 'currency':
        this.loadCurrencies();
        break;
      case 'shift':
        this.loadShifts();
        break;
      case 'benefit':
        this.loadBenefits();
        break;
      case 'contractType':
        this.loadContractTypes();
        break;
      case 'educationLevel':
        this.loadEducationLevels();
        break;
      case 'languageLevel':
        this.loadLanguageLevels();
        break;
      case 'coverageType':
        this.loadCoverageTypes();
        break;
      case 'coverageCategory':
        this.loadCoverageCategorys();
        break;
      case 'characteristic':
        this.loadCharacteristics();
        break;
      case 'category':
        this.loadCategorys();
        break;
      case 'maritalStatus':
        this.loadMaritalStatuss();
        break;
      case 'experienceLevel':
        this.loadExperienceLevels();
        break;
      case 'tool':
        this.loadTools();
        break;
      case 'workSchedule':
        this.loadWorkSchedules();
        break;
      case 'workplace':
        this.loadWorkplaces();
        break;
      case 'requirement':
        this.loadRequirements();
        break;
      case 'responsibilityLevel':
        this.loadResponsibilityLevels();
        break;
      case 'disabilityType':
        this.loadDisabilityTypes();
        break;
      case 'businessUnit':
        this.loadBusinessUnits();
        break;
      case 'positionType':
        this.loadPositionTypes();
        break;
      case 'brand':
        this.loadBrands();
        break;
      case 'requisitionType':
        this.loadRequisitionTypes();
        break;
      case 'jobPortal':
        this.loadJobPortals();
        break;
      case 'language':
        this.loadLanguages();
        break;
      case 'kinship':
        this.loadKinships();
        break;
      case 'client':
        this.loadClients();
        break;
      case 'documentType':
        this.loadDocumentTypes();
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
      case 'companyArea':
        this.loadCompanyAreas();
        break;
      case 'companyDepartment':
        this.loadCompanyDepartments();
        break;
      case 'branch':
        this.loadBranchs();
        break;
      case 'questionnaireCategory':
        this.loadQuestionnaireCategorys();
        break;
      case 'questionnaireQuestion':
        this.loadQuestionnaireQuestions();
        break;
      case 'recruiterGroup':
        this.loadRecruiterGroups();
        break;
    }
  }

  get activeCategoryId(): CatalogCategoryId {
    return this.visibleCategories()[this.categoryTabIndex]?.id ?? 'generales';
  }

  get activePanel(): CatalogPanelKey | null {
    const catalogId = this.selectedCatalogIdByCategory[this.activeCategoryId];
    const entry = this.visibleCategories()
      .find((category) => category.id === this.activeCategoryId)
      ?.catalogs.find((catalog) => catalog.id === catalogId);
    return entry?.panelKey ?? null;
  }

  isPanelVisible(panel: CatalogPanelKey): boolean {
    return this.activePanel === panel;
  }

  isCatalogImplemented(categoryId: CatalogCategoryId, catalogId: string): boolean {
    const category =
      this.visibleCategories().find((item) => item.id === categoryId) ?? getCategoryById(categoryId);
    return category.catalogs.find((catalog) => catalog.id === catalogId)?.implemented ?? false;
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
    this.loadCoverageCategorys();
    this.loadCharacteristics();
    this.loadCategorys();
    this.loadMaritalStatuss();
    this.loadExperienceLevels();
    this.loadTools();
    this.loadWorkSchedules();
    this.loadWorkplaces();
    this.loadRequirements();
    this.loadResponsibilityLevels();
    this.loadDisabilityTypes();
    this.loadBusinessUnits();
    this.loadPositionTypes();
        break;
      case 'recruiterGroup':
        this.loadRecruiterGroups();
        break;
      case 'jobPortal':
        this.loadJobPortals();
        break;
      case 'questionnaireCategory':
        this.loadQuestionnaireCategorys();
        break;
      case 'questionnaireQuestion':
        this.loadQuestionnaireCategoryOptions();
        this.loadQuestionnaireQuestions();
        break;
      case 'companyArea':
        this.ensureCompaniesLoaded();
        this.loadCompanyAreas();
        break;
      case 'companyDepartment':
        this.ensureCompaniesLoaded();
        this.loadCompanyDepartments();
        break;
      case 'branch':
        this.ensureCompaniesLoaded();
        this.loadBranchs();
        break;
      case 'client':
        this.loadClients();
        break;
      case 'coverageCategory':
        this.loadCoverageCategorys();
        break;
      case 'characteristic':
        this.loadCharacteristics();
        break;
      case 'category':
        this.loadCategorys();
        break;
      case 'maritalStatus':
        this.loadMaritalStatuss();
        break;
      case 'experienceLevel':
        this.loadExperienceLevels();
        break;
      case 'tool':
        this.loadTools();
        break;
      case 'workSchedule':
        this.loadWorkSchedules();
        break;
      case 'workplace':
        this.loadWorkplaces();
        break;
      case 'requirement':
        this.loadRequirements();
        break;
      case 'responsibilityLevel':
        this.loadResponsibilityLevels();
        break;
      case 'disabilityType':
        this.loadDisabilityTypes();
        break;
      case 'businessUnit':
        this.loadBusinessUnits();
        break;
      case 'positionType':
        this.loadPositionTypes();
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

  deletingCatalogId: number | null = null;
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

  coverageCategories: CatalogCoverageCategory[] = [];
  coverageCategoryTotal = 0;
  coverageCategoryPageIndex = 0;
  coverageCategoryPageSize = 10;
  loadingCoverageCategories = false;
  savingCoverageCategory = false;
  editingCoverageCategoryId: number | null = null;
  showCoverageCategoryForm = false;
  characteristics: CatalogCharacteristic[] = [];
  characteristicTotal = 0;
  characteristicPageIndex = 0;
  characteristicPageSize = 10;
  loadingCharacteristics = false;
  savingCharacteristic = false;
  editingCharacteristicId: number | null = null;
  showCharacteristicForm = false;
  catalogCategories: CatalogGeneralCategory[] = [];
  categoryTotal = 0;
  categoryPageIndex = 0;
  categoryPageSize = 10;
  loadingCategories = false;
  savingCategory = false;
  editingCategoryId: number | null = null;
  showCategoryForm = false;
  maritalStatuses: CatalogMaritalStatus[] = [];
  maritalStatusTotal = 0;
  maritalStatusPageIndex = 0;
  maritalStatusPageSize = 10;
  loadingMaritalStatuses = false;
  savingMaritalStatus = false;
  editingMaritalStatusId: number | null = null;
  showMaritalStatusForm = false;
  experienceLevels: CatalogExperienceLevel[] = [];
  experienceLevelTotal = 0;
  experienceLevelPageIndex = 0;
  experienceLevelPageSize = 10;
  loadingExperienceLevels = false;
  savingExperienceLevel = false;
  editingExperienceLevelId: number | null = null;
  showExperienceLevelForm = false;
  tools: CatalogTool[] = [];
  toolTotal = 0;
  toolPageIndex = 0;
  toolPageSize = 10;
  loadingTools = false;
  savingTool = false;
  editingToolId: number | null = null;
  showToolForm = false;
  workSchedules: CatalogWorkSchedule[] = [];
  workScheduleTotal = 0;
  workSchedulePageIndex = 0;
  workSchedulePageSize = 10;
  loadingWorkSchedules = false;
  savingWorkSchedule = false;
  editingWorkScheduleId: number | null = null;
  showWorkScheduleForm = false;
  workplaces: CatalogWorkplace[] = [];
  workplaceTotal = 0;
  workplacePageIndex = 0;
  workplacePageSize = 10;
  loadingWorkplaces = false;
  savingWorkplace = false;
  editingWorkplaceId: number | null = null;
  showWorkplaceForm = false;
  requirements: CatalogRequirement[] = [];
  requirementTotal = 0;
  requirementPageIndex = 0;
  requirementPageSize = 10;
  loadingRequirements = false;
  savingRequirement = false;
  editingRequirementId: number | null = null;
  showRequirementForm = false;
  responsibilityLevels: CatalogResponsibilityLevel[] = [];
  responsibilityLevelTotal = 0;
  responsibilityLevelPageIndex = 0;
  responsibilityLevelPageSize = 10;
  loadingResponsibilityLevels = false;
  savingResponsibilityLevel = false;
  editingResponsibilityLevelId: number | null = null;
  showResponsibilityLevelForm = false;
  disabilityTypes: CatalogDisabilityType[] = [];
  disabilityTypeTotal = 0;
  disabilityTypePageIndex = 0;
  disabilityTypePageSize = 10;
  loadingDisabilityTypes = false;
  savingDisabilityType = false;
  editingDisabilityTypeId: number | null = null;
  showDisabilityTypeForm = false;
  businessUnits: CatalogBusinessUnit[] = [];
  businessUnitTotal = 0;
  businessUnitPageIndex = 0;
  businessUnitPageSize = 10;
  loadingBusinessUnits = false;
  savingBusinessUnit = false;
  editingBusinessUnitId: number | null = null;
  showBusinessUnitForm = false;
  positionTypes: CatalogPositionType[] = [];
  positionTypeTotal = 0;
  positionTypePageIndex = 0;
  positionTypePageSize = 10;
  loadingPositionTypes = false;
  savingPositionType = false;
  editingPositionTypeId: number | null = null;
  showPositionTypeForm = false;

  selectedCatalogCompanyId: number | null = null;
  companyAreas: CatalogCompanyArea[] = [];
  companyAreaTotal = 0;
  companyAreaPageIndex = 0;
  companyAreaPageSize = 10;
  loadingCompanyAreas = false;
  savingCompanyArea = false;
  editingCompanyAreaId: number | null = null;
  showCompanyAreaForm = false;
  companyDepartments: CatalogCompanyDepartment[] = [];
  companyDepartmentTotal = 0;
  companyDepartmentPageIndex = 0;
  companyDepartmentPageSize = 10;
  loadingCompanyDepartments = false;
  savingCompanyDepartment = false;
  editingCompanyDepartmentId: number | null = null;
  showCompanyDepartmentForm = false;
  branches: CatalogBranch[] = [];
  branchTotal = 0;
  branchPageIndex = 0;
  branchPageSize = 10;
  loadingBranches = false;
  savingBranch = false;
  editingBranchId: number | null = null;
  showBranchForm = false;

  recruiterGroups: SecurityRecruiterGroup[] = [];
  recruiterGroupTotal = 0;
  recruiterGroupPageIndex = 0;
  recruiterGroupPageSize = 10;
  loadingRecruiterGroups = false;
  savingRecruiterGroup = false;
  editingRecruiterGroupId: number | null = null;
  showRecruiterGroupForm = false;

  jobPortals: CatalogJobPortal[] = [];
  jobPortalTotal = 0;
  jobPortalPageIndex = 0;
  jobPortalPageSize = 10;
  loadingJobPortals = false;
  savingJobPortal = false;
  editingJobPortalId: number | null = null;
  showJobPortalForm = false;

  questionnaireCategories: CatalogCategory[] = [];
  questionnaireCategoryTotal = 0;
  questionnaireCategoryPageIndex = 0;
  questionnaireCategoryPageSize = 10;
  loadingQuestionnaireCategories = false;
  savingQuestionnaireCategory = false;
  editingQuestionnaireCategoryId: number | null = null;
  showQuestionnaireCategoryForm = false;

  questionnaireQuestions: QuestionnaireQuestion[] = [];
  questionnaireQuestionTotal = 0;
  questionnaireQuestionPageIndex = 0;
  questionnaireQuestionPageSize = 10;
  loadingQuestionnaireQuestions = false;
  savingQuestionnaireQuestion = false;
  editingQuestionnaireQuestionId: number | null = null;
  showQuestionnaireQuestionForm = false;
  questionnaireCategoryOptions: CatalogCategory[] = [];
  loadingQuestionnaireCategoryOptions = false;

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
  readonly coverageCategoryColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly characteristicColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly categoryColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly maritalStatusColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly experienceLevelColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly toolColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly workScheduleColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly workplaceColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly requirementColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly responsibilityLevelColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly disabilityTypeColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly businessUnitColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly positionTypeColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly clientColumns = ['code', 'tradeName', 'legalName', 'companyArea', 'contactName', 'active', 'scope', 'actions'];
  readonly companyColumns = ['code', 'name', 'tradeName', 'taxId', 'country', 'active', 'actions'];
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
  readonly companyAreaColumns = ['name', 'description', 'active', 'scope', 'actions'];
  readonly companyDepartmentColumns = ['name', 'description', 'active', 'scope', 'actions'];
  readonly branchColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];
  readonly recruiterGroupColumns = ['code', 'description', 'legacyManpowerId', 'coreAts', 'coreAppian', 'active', 'scope', 'actions'];

  readonly recruiterGroupForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    description: ['', Validators.required],
    legacyManpowerId: [null as number | null, Validators.required],
    coreAts: [''],
    coreAppian: ['', Validators.required],
    isActive: [true],
  });

  readonly jobPortalColumns = ['code', 'name', 'description', 'active', 'scope', 'actions'];

  readonly jobPortalForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly questionnaireCategoryColumns = ['code', 'name', 'description', 'active', 'actions'];

  readonly questionnaireCategoryForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly questionnaireQuestionColumns = ['category', 'questionType', 'questionText', 'description', 'active', 'actions'];

  readonly questionnaireQuestionForm = this.fb.nonNullable.group({
    categoryId: [null as number | null, Validators.required],
    questionType: [''],
    questionText: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly countryColumns = ['code', 'secondaryCode', 'name', 'description', 'manpowerId', 'region', 'active', 'scope', 'actions'];
  readonly stateColumns = ['code', 'name', 'shortDescription', 'active', 'scope', 'actions'];
  readonly municipalityColumns = ['code', 'name', 'active', 'scope', 'actions'];
  readonly neighborhoodColumns = ['name', 'postalCode', 'active', 'scope', 'actions'];

  readonly genderForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
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
    countryId: [null as number | null, Validators.required],
    billingMessage: [''],
    atsCode: [null as number | null],
    noPurchaseOrder: [false],
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

  readonly coverageCategoryForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly characteristicForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly categoryForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });
  readonly maritalStatusForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly experienceLevelForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly toolForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly workScheduleForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly workplaceForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly requirementForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly responsibilityLevelForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly disabilityTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly businessUnitForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
    isActive: [true],
  });
  readonly positionTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    legacyManpowerId: [null as number | null],
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
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    symbol: [''],
    denomination: [''],
    isActive: [true],
  });

  readonly careerForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
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
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly benefitForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly documentTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    documentType: ['', Validators.required],
    validatesWithAi: [false],
    isActive: [true],
  });

  readonly brandForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly contractTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly coverageTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly educationLevelForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    requiresCareer: [false],
    isActive: [true],
  });

  readonly languageLevelForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    appliesToCareer: [false],
    isActive: [true],
  });

  readonly requisitionTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly companyAreaForm = this.fb.nonNullable.group({
    catalogCompanyId: [null as number | null, Validators.required],
    countryId: [null as number | null],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });
  readonly companyDepartmentForm = this.fb.nonNullable.group({
    catalogCompanyId: [null as number | null, Validators.required],
    countryId: [null as number | null],
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });
  readonly branchForm = this.fb.nonNullable.group({
    catalogCompanyId: [null as number | null],
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
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
    this.cancelClientForm();
    this.cancelCoverageCategoryForm();
    this.cancelCharacteristicForm();
    this.cancelCategoryForm();
    this.cancelMaritalStatusForm();
    this.cancelExperienceLevelForm();
    this.cancelToolForm();
    this.cancelWorkScheduleForm();
    this.cancelWorkplaceForm();
    this.cancelRequirementForm();
    this.cancelResponsibilityLevelForm();
    this.cancelDisabilityTypeForm();
    this.cancelBusinessUnitForm();
    this.cancelPositionTypeForm();
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
    this.loadCoverageCategorys();
    this.loadCharacteristics();
    this.loadCategorys();
    this.loadMaritalStatuss();
    this.loadExperienceLevels();
    this.loadTools();
    this.loadWorkSchedules();
    this.loadWorkplaces();
    this.loadRequirements();
    this.loadResponsibilityLevels();
    this.loadDisabilityTypes();
    this.loadBusinessUnits();
    this.loadPositionTypes();
    this.loadQuestionnaireCategorys();
    this.loadQuestionnaireQuestions();
    this.loadRecruiterGroups();
    this.loadJobPortals();
    this.loadBranchs();
    this.loadCompanies();
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
    this.coverageCategoryPageIndex = 0;
    this.characteristicPageIndex = 0;
    this.categoryPageIndex = 0;
    this.maritalStatusPageIndex = 0;
    this.experienceLevelPageIndex = 0;
    this.toolPageIndex = 0;
    this.workSchedulePageIndex = 0;
    this.workplacePageIndex = 0;
    this.requirementPageIndex = 0;
    this.responsibilityLevelPageIndex = 0;
    this.disabilityTypePageIndex = 0;
    this.businessUnitPageIndex = 0;
    this.positionTypePageIndex = 0;
    this.questionnaireCategoryPageIndex = 0;
    this.questionnaireQuestionPageIndex = 0;
    this.jobPortalPageIndex = 0;
    this.recruiterGroupPageIndex = 0;
    this.branchPageIndex = 0;
    this.companyPageIndex = 0;
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
    this.cancelClientForm();
    this.cancelCoverageCategoryForm();
    this.cancelCharacteristicForm();
    this.cancelCategoryForm();
    this.cancelMaritalStatusForm();
    this.cancelExperienceLevelForm();
    this.cancelToolForm();
    this.cancelWorkScheduleForm();
    this.cancelWorkplaceForm();
    this.cancelRequirementForm();
    this.cancelResponsibilityLevelForm();
    this.cancelDisabilityTypeForm();
    this.cancelBusinessUnitForm();
    this.cancelPositionTypeForm();
    this.cancelQuestionnaireCategoryForm();
    this.cancelQuestionnaireQuestionForm();
    this.cancelRecruiterGroupForm();
    this.cancelJobPortalForm();
    this.cancelBranchForm();
    this.cancelCompanyForm();
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

  loadCoverageCategorys(): void {
    if (this.selectedCountryId == null) return;
    this.loadingCoverageCategories = true;
    this.coverageCategoryService.list(this.selectedCountryId, this.coverageCategoryPageIndex, this.coverageCategoryPageSize).subscribe({
      next: (res) => {
        this.coverageCategories = res.items;
        this.coverageCategoryTotal = res.total;
        this.loadingCoverageCategories = false;
      },
      error: () => {
        this.loadingCoverageCategories = false;
        this.snack.open('No se pudieron cargar c categoría cubrimiento', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCoverageCategoryPage(e: PageEvent): void {
    this.coverageCategoryPageIndex = e.pageIndex;
    this.coverageCategoryPageSize = e.pageSize;
    this.loadCoverageCategorys();
  }
  loadCharacteristics(): void {
    if (this.selectedCountryId == null) return;
    this.loadingCharacteristics = true;
    this.characteristicService.list(this.selectedCountryId, this.characteristicPageIndex, this.characteristicPageSize).subscribe({
      next: (res) => {
        this.characteristics = res.items;
        this.characteristicTotal = res.total;
        this.loadingCharacteristics = false;
      },
      error: () => {
        this.loadingCharacteristics = false;
        this.snack.open('No se pudieron cargar características', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCharacteristicPage(e: PageEvent): void {
    this.characteristicPageIndex = e.pageIndex;
    this.characteristicPageSize = e.pageSize;
    this.loadCharacteristics();
  }
  loadCategorys(): void {
    if (this.selectedCountryId == null) return;
    this.loadingCategories = true;
    this.generalCategoryService.list(this.selectedCountryId, this.categoryPageIndex, this.categoryPageSize).subscribe({
      next: (res) => {
        this.catalogCategories = res.items;
        this.categoryTotal = res.total;
        this.loadingCategories = false;
      },
      error: () => {
        this.loadingCategories = false;
        this.snack.open('No se pudieron cargar categoría', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCategoryPage(e: PageEvent): void {
    this.categoryPageIndex = e.pageIndex;
    this.categoryPageSize = e.pageSize;
    this.loadCategorys();
  }
  loadMaritalStatuss(): void {
    if (this.selectedCountryId == null) return;
    this.loadingMaritalStatuses = true;
    this.maritalStatusService.list(this.selectedCountryId, this.maritalStatusPageIndex, this.maritalStatusPageSize).subscribe({
      next: (res) => {
        this.maritalStatuses = res.items;
        this.maritalStatusTotal = res.total;
        this.loadingMaritalStatuses = false;
      },
      error: () => {
        this.loadingMaritalStatuses = false;
        this.snack.open('No se pudieron cargar estado civil', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onMaritalStatusPage(e: PageEvent): void {
    this.maritalStatusPageIndex = e.pageIndex;
    this.maritalStatusPageSize = e.pageSize;
    this.loadMaritalStatuss();
  }
  loadExperienceLevels(): void {
    if (this.selectedCountryId == null) return;
    this.loadingExperienceLevels = true;
    this.experienceLevelService.list(this.selectedCountryId, this.experienceLevelPageIndex, this.experienceLevelPageSize).subscribe({
      next: (res) => {
        this.experienceLevels = res.items;
        this.experienceLevelTotal = res.total;
        this.loadingExperienceLevels = false;
      },
      error: () => {
        this.loadingExperienceLevels = false;
        this.snack.open('No se pudieron cargar experiencia', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onExperienceLevelPage(e: PageEvent): void {
    this.experienceLevelPageIndex = e.pageIndex;
    this.experienceLevelPageSize = e.pageSize;
    this.loadExperienceLevels();
  }
  loadTools(): void {
    if (this.selectedCountryId == null) return;
    this.loadingTools = true;
    this.toolService.list(this.selectedCountryId, this.toolPageIndex, this.toolPageSize).subscribe({
      next: (res) => {
        this.tools = res.items;
        this.toolTotal = res.total;
        this.loadingTools = false;
      },
      error: () => {
        this.loadingTools = false;
        this.snack.open('No se pudieron cargar herramienta', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onToolPage(e: PageEvent): void {
    this.toolPageIndex = e.pageIndex;
    this.toolPageSize = e.pageSize;
    this.loadTools();
  }
  loadWorkSchedules(): void {
    if (this.selectedCountryId == null) return;
    this.loadingWorkSchedules = true;
    this.workScheduleService.list(this.selectedCountryId, this.workSchedulePageIndex, this.workSchedulePageSize).subscribe({
      next: (res) => {
        this.workSchedules = res.items;
        this.workScheduleTotal = res.total;
        this.loadingWorkSchedules = false;
      },
      error: () => {
        this.loadingWorkSchedules = false;
        this.snack.open('No se pudieron cargar horario trabajo', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onWorkSchedulePage(e: PageEvent): void {
    this.workSchedulePageIndex = e.pageIndex;
    this.workSchedulePageSize = e.pageSize;
    this.loadWorkSchedules();
  }
  loadWorkplaces(): void {
    if (this.selectedCountryId == null) return;
    this.loadingWorkplaces = true;
    this.workplaceService.list(this.selectedCountryId, this.workplacePageIndex, this.workplacePageSize).subscribe({
      next: (res) => {
        this.workplaces = res.items;
        this.workplaceTotal = res.total;
        this.loadingWorkplaces = false;
      },
      error: () => {
        this.loadingWorkplaces = false;
        this.snack.open('No se pudieron cargar lugar trabajo', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onWorkplacePage(e: PageEvent): void {
    this.workplacePageIndex = e.pageIndex;
    this.workplacePageSize = e.pageSize;
    this.loadWorkplaces();
  }
  loadRequirements(): void {
    if (this.selectedCountryId == null) return;
    this.loadingRequirements = true;
    this.requirementService.list(this.selectedCountryId, this.requirementPageIndex, this.requirementPageSize).subscribe({
      next: (res) => {
        this.requirements = res.items;
        this.requirementTotal = res.total;
        this.loadingRequirements = false;
      },
      error: () => {
        this.loadingRequirements = false;
        this.snack.open('No se pudieron cargar requisitos', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onRequirementPage(e: PageEvent): void {
    this.requirementPageIndex = e.pageIndex;
    this.requirementPageSize = e.pageSize;
    this.loadRequirements();
  }
  loadResponsibilityLevels(): void {
    if (this.selectedCountryId == null) return;
    this.loadingResponsibilityLevels = true;
    this.responsibilityLevelService.list(this.selectedCountryId, this.responsibilityLevelPageIndex, this.responsibilityLevelPageSize).subscribe({
      next: (res) => {
        this.responsibilityLevels = res.items;
        this.responsibilityLevelTotal = res.total;
        this.loadingResponsibilityLevels = false;
      },
      error: () => {
        this.loadingResponsibilityLevels = false;
        this.snack.open('No se pudieron cargar responsabilidad', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onResponsibilityLevelPage(e: PageEvent): void {
    this.responsibilityLevelPageIndex = e.pageIndex;
    this.responsibilityLevelPageSize = e.pageSize;
    this.loadResponsibilityLevels();
  }
  loadDisabilityTypes(): void {
    if (this.selectedCountryId == null) return;
    this.loadingDisabilityTypes = true;
    this.disabilityTypeService.list(this.selectedCountryId, this.disabilityTypePageIndex, this.disabilityTypePageSize).subscribe({
      next: (res) => {
        this.disabilityTypes = res.items;
        this.disabilityTypeTotal = res.total;
        this.loadingDisabilityTypes = false;
      },
      error: () => {
        this.loadingDisabilityTypes = false;
        this.snack.open('No se pudieron cargar tipo discapacidad', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onDisabilityTypePage(e: PageEvent): void {
    this.disabilityTypePageIndex = e.pageIndex;
    this.disabilityTypePageSize = e.pageSize;
    this.loadDisabilityTypes();
  }
  loadBusinessUnits(): void {
    if (this.selectedCountryId == null) return;
    this.loadingBusinessUnits = true;
    this.businessUnitService.list(this.selectedCountryId, this.businessUnitPageIndex, this.businessUnitPageSize).subscribe({
      next: (res) => {
        this.businessUnits = res.items;
        this.businessUnitTotal = res.total;
        this.loadingBusinessUnits = false;
      },
      error: () => {
        this.loadingBusinessUnits = false;
        this.snack.open('No se pudieron cargar unidad de negocio', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onBusinessUnitPage(e: PageEvent): void {
    this.businessUnitPageIndex = e.pageIndex;
    this.businessUnitPageSize = e.pageSize;
    this.loadBusinessUnits();
  }
  loadPositionTypes(): void {
    if (this.selectedCountryId == null) return;
    this.loadingPositionTypes = true;
    this.positionTypeService.list(this.selectedCountryId, this.positionTypePageIndex, this.positionTypePageSize).subscribe({
      next: (res) => {
        this.positionTypes = res.items;
        this.positionTypeTotal = res.total;
        this.loadingPositionTypes = false;
      },
      error: () => {
        this.loadingPositionTypes = false;
        this.snack.open('No se pudieron cargar puesto', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onPositionTypePage(e: PageEvent): void {
    this.positionTypePageIndex = e.pageIndex;
    this.positionTypePageSize = e.pageSize;
    this.loadPositionTypes();
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
    this.companyService.list(this.companyPageIndex, this.companyPageSize, this.selectedCountryId ?? undefined).subscribe({
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

  countryName(countryId: number | null | undefined): string {
    if (countryId == null) {
      return '—';
    }
    return this.countries.find((country) => country.id === countryId)?.name ?? String(countryId);
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

  loadCompanyAreas(): void {
    if (this.selectedCatalogCompanyId == null) return;
    this.loadingCompanyAreas = true;
    this.companyAreaService.list(this.selectedCatalogCompanyId!, this.companyAreaPageIndex, this.companyAreaPageSize).subscribe({
      next: (res) => {
        this.companyAreas = res.items;
        this.companyAreaTotal = res.total;
        this.loadingCompanyAreas = false;
      },
      error: () => {
        this.loadingCompanyAreas = false;
        this.snack.open('No se pudieron cargar áreas', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCompanyAreaPage(e: PageEvent): void {
    this.companyAreaPageIndex = e.pageIndex;
    this.companyAreaPageSize = e.pageSize;
    this.loadCompanyAreas();
  }
  loadCompanyDepartments(): void {
    if (this.selectedCatalogCompanyId == null) return;
    this.loadingCompanyDepartments = true;
    this.companyDepartmentService.list(this.selectedCatalogCompanyId!, this.companyDepartmentPageIndex, this.companyDepartmentPageSize).subscribe({
      next: (res) => {
        this.companyDepartments = res.items;
        this.companyDepartmentTotal = res.total;
        this.loadingCompanyDepartments = false;
      },
      error: () => {
        this.loadingCompanyDepartments = false;
        this.snack.open('No se pudieron cargar departamentos', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCompanyDepartmentPage(e: PageEvent): void {
    this.companyDepartmentPageIndex = e.pageIndex;
    this.companyDepartmentPageSize = e.pageSize;
    this.loadCompanyDepartments();
  }
  loadBranchs(): void {
    if (this.selectedCountryId == null) return;
    this.loadingBranches = true;
    this.branchService.list(this.selectedCountryId!, this.branchPageIndex, this.branchPageSize).subscribe({
      next: (res) => {
        this.branches = res.items;
        this.branchTotal = res.total;
        this.loadingBranches = false;
      },
      error: () => {
        this.loadingBranches = false;
        this.snack.open('No se pudieron cargar sucursales', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onBranchPage(e: PageEvent): void {
    this.branchPageIndex = e.pageIndex;
    this.branchPageSize = e.pageSize;
    this.loadBranchs();
  }

  ensureCompaniesLoaded(): void {
    if (this.companies.length > 0) return;
    this.companyService.list(0, 200).subscribe({
      next: (res) => {
        this.companies = res.items;
        if (this.selectedCatalogCompanyId == null && res.items.length > 0) {
          this.selectedCatalogCompanyId = res.items[0].id;
        }
      },
    });
  }

  onCatalogCompanyChange(companyId: number): void {
    this.selectedCatalogCompanyId = companyId;
    this.companyAreaPageIndex = 0;
    this.companyDepartmentPageIndex = 0;
    if (this.isPanelVisible('companyArea')) this.loadCompanyAreas();
    if (this.isPanelVisible('companyDepartment')) this.loadCompanyDepartments();
  }



  loadRecruiterGroups(): void {
    if (this.selectedCountryId == null) return;
    this.loadingRecruiterGroups = true;
    this.recruiterGroupService.list(this.selectedCountryId, this.recruiterGroupPageIndex, this.recruiterGroupPageSize).subscribe({
      next: (res) => {
        this.recruiterGroups = res.items;
        this.recruiterGroupTotal = res.total;
        this.loadingRecruiterGroups = false;
      },
      error: () => {
        this.loadingRecruiterGroups = false;
        this.snack.open('No se pudieron cargar grupos reclutadores', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onRecruiterGroupPage(e: PageEvent): void {
    this.recruiterGroupPageIndex = e.pageIndex;
    this.recruiterGroupPageSize = e.pageSize;
    this.loadRecruiterGroups();
  }

  openCreateRecruiterGroup(): void {
    this.resetCreateScope();
    this.editingRecruiterGroupId = null;
    this.showRecruiterGroupForm = true;
    this.recruiterGroupForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      description: '',
      legacyManpowerId: null,
      coreAts: '',
      coreAppian: '',
      isActive: true,
    });
  }

  openEditRecruiterGroup(row: SecurityRecruiterGroup): void {
    this.editingRecruiterGroupId = row.id;
    this.showRecruiterGroupForm = true;
    this.recruiterGroupForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      description: row.description,
      legacyManpowerId: row.legacyManpowerId,
      coreAts: row.coreAts ?? '',
      coreAppian: row.coreAppian,
      isActive: row.isActive,
    });
  }

  cancelRecruiterGroupForm(): void {
    this.showRecruiterGroupForm = false;
    this.editingRecruiterGroupId = null;
  }

  saveRecruiterGroup(): void {
    if (this.recruiterGroupForm.invalid) {
      this.recruiterGroupForm.markAllAsTouched();
      return;
    }
    const value = this.recruiterGroupForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      description: value.description,
      legacyManpowerId: value.legacyManpowerId!,
      coreAts: value.coreAts || undefined,
      coreAppian: value.coreAppian,
      isActive: value.isActive,
    };
    this.savingRecruiterGroup = true;
    const request$ =
      this.editingRecruiterGroupId != null
        ? this.recruiterGroupService.update(this.editingRecruiterGroupId, payload)
        : this.recruiterGroupService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingRecruiterGroup = false;
        this.cancelRecruiterGroupForm();
        this.loadRecruiterGroups();
        this.snack.open('Grupo guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingRecruiterGroup = false;
        this.snack.open('No se pudo guardar el grupo', 'Cerrar', { duration: 4000 });
      },
    });
  }

  deleteRecruiterGroup(row: SecurityRecruiterGroup): void {
    this.deleteCatalogRow(
      row,
      row.description || row.code,
      this.recruiterGroupService.delete(row.id),
      () => this.loadRecruiterGroups(),
      this.editingRecruiterGroupId,
      () => this.cancelRecruiterGroupForm(),
    );
  }

  loadJobPortals(): void {
    if (this.selectedCountryId == null) return;
    this.loadingJobPortals = true;
    this.jobPortalService.list(this.selectedCountryId, this.jobPortalPageIndex, this.jobPortalPageSize).subscribe({
      next: (res) => {
        this.jobPortals = res.items;
        this.jobPortalTotal = res.total;
        this.loadingJobPortals = false;
      },
      error: () => {
        this.loadingJobPortals = false;
        this.snack.open('No se pudieron cargar portales', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onJobPortalPage(e: PageEvent): void {
    this.jobPortalPageIndex = e.pageIndex;
    this.jobPortalPageSize = e.pageSize;
    this.loadJobPortals();
  }

  openCreateJobPortal(): void {
    this.resetCreateScope();
    this.editingJobPortalId = null;
    this.showJobPortalForm = true;
    this.jobPortalForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      isActive: true,
    });
  }

  openEditJobPortal(row: CatalogJobPortal): void {
    this.editingJobPortalId = row.id;
    this.showJobPortalForm = true;
    this.jobPortalForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelJobPortalForm(): void {
    this.showJobPortalForm = false;
    this.editingJobPortalId = null;
  }

  saveJobPortal(): void {
    if (this.jobPortalForm.invalid) {
      this.jobPortalForm.markAllAsTouched();
      return;
    }
    const value = this.jobPortalForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingJobPortal = true;
    const request$ =
      this.editingJobPortalId != null
        ? this.jobPortalService.update(this.editingJobPortalId, payload)
        : this.jobPortalService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingJobPortal = false;
        this.cancelJobPortalForm();
        this.loadJobPortals();
        this.snack.open('Portal guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingJobPortal = false;
        this.snack.open('No se pudo guardar el portal', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadQuestionnaireCategorys(): void {
    if (this.selectedCountryId == null) return;
    this.loadingQuestionnaireCategories = true;
    this.catalogCategoryService.list(this.selectedCountryId, this.questionnaireCategoryPageIndex, this.questionnaireCategoryPageSize).subscribe({
      next: (res) => {
        this.questionnaireCategories = res.items;
        this.questionnaireCategoryTotal = res.total;
        this.loadingQuestionnaireCategories = false;
      },
      error: () => {
        this.loadingQuestionnaireCategories = false;
        this.snack.open('No se pudieron cargar categorías de cuestionario', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onQuestionnaireCategoryPage(e: PageEvent): void {
    this.questionnaireCategoryPageIndex = e.pageIndex;
    this.questionnaireCategoryPageSize = e.pageSize;
    this.loadQuestionnaireCategorys();
  }

  openCreateQuestionnaireCategory(): void {
    this.questionnaireCategoryForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      isActive: true,
    });
    this.editingQuestionnaireCategoryId = null;
    this.showQuestionnaireCategoryForm = true;
  }

  openEditQuestionnaireCategory(row: CatalogCategory): void {
    this.editingQuestionnaireCategoryId = row.id;
    this.showQuestionnaireCategoryForm = true;
    this.questionnaireCategoryForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelQuestionnaireCategoryForm(): void {
    this.showQuestionnaireCategoryForm = false;
    this.editingQuestionnaireCategoryId = null;
  }

  saveQuestionnaireCategory(): void {
    if (this.questionnaireCategoryForm.invalid) {
      this.questionnaireCategoryForm.markAllAsTouched();
      return;
    }
    const value = this.questionnaireCategoryForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingQuestionnaireCategory = true;
    const request$ =
      this.editingQuestionnaireCategoryId != null
        ? this.catalogCategoryService.update(this.editingQuestionnaireCategoryId, payload)
        : this.catalogCategoryService.create(payload);
    request$.subscribe({
      next: () => {
        this.savingQuestionnaireCategory = false;
        this.cancelQuestionnaireCategoryForm();
        this.loadQuestionnaireCategorys();
        this.snack.open('Categoría guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingQuestionnaireCategory = false;
        this.snack.open('No se pudo guardar la categoría', 'Cerrar', { duration: 4000 });
      },
    });
  }

  deleteQuestionnaireCategory(row: CatalogCategory): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.catalogCategoryService.delete(row.id),
      () => this.loadQuestionnaireCategorys(),
      this.editingQuestionnaireCategoryId,
      () => this.cancelQuestionnaireCategoryForm(),
    );
  }

  loadQuestionnaireCategoryOptions(): void {
    if (this.selectedCountryId == null) return;
    this.loadingQuestionnaireCategoryOptions = true;
    this.catalogCategoryService.list(this.selectedCountryId, 0, 500).subscribe({
      next: (res) => {
        this.questionnaireCategoryOptions = res.items;
        this.loadingQuestionnaireCategoryOptions = false;
      },
      error: () => {
        this.loadingQuestionnaireCategoryOptions = false;
        this.snack.open('No se pudieron cargar categorías para el formulario', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadQuestionnaireQuestions(): void {
    if (this.selectedCountryId == null) return;
    this.loadingQuestionnaireQuestions = true;
    this.questionnaireQuestionService
      .list(this.selectedCountryId, this.questionnaireQuestionPageIndex, this.questionnaireQuestionPageSize)
      .subscribe({
        next: (res) => {
          this.questionnaireQuestions = res.items;
          this.questionnaireQuestionTotal = res.total;
          this.loadingQuestionnaireQuestions = false;
        },
        error: () => {
          this.loadingQuestionnaireQuestions = false;
          this.snack.open('No se pudieron cargar las preguntas', 'Cerrar', { duration: 4000 });
        },
      });
  }

  onQuestionnaireQuestionPage(e: PageEvent): void {
    this.questionnaireQuestionPageIndex = e.pageIndex;
    this.questionnaireQuestionPageSize = e.pageSize;
    this.loadQuestionnaireQuestions();
  }

  openCreateQuestionnaireQuestion(): void {
    if (this.selectedCountryId == null) return;
    this.editingQuestionnaireQuestionId = null;
    this.showQuestionnaireQuestionForm = true;
    this.catalogCategoryService.list(this.selectedCountryId, 0, 500).subscribe({
      next: (res) => {
        this.questionnaireCategoryOptions = res.items;
        this.questionnaireQuestionForm.reset({
          categoryId: res.items[0]?.id ?? null,
          questionType: '',
          questionText: '',
          description: '',
          isActive: true,
        });
      },
      error: () => this.snack.open('No se pudieron cargar categorías para el formulario', 'Cerrar', { duration: 4000 }),
    });
  }

  openEditQuestionnaireQuestion(row: QuestionnaireQuestion): void {
    if (this.selectedCountryId == null) return;
    this.editingQuestionnaireQuestionId = row.id;
    this.showQuestionnaireQuestionForm = true;
    this.catalogCategoryService.list(this.selectedCountryId, 0, 500).subscribe({
      next: (res) => {
        this.questionnaireCategoryOptions = res.items;
        this.questionnaireQuestionForm.patchValue({
          categoryId: row.categoryId,
          questionType: row.questionType ?? '',
          questionText: row.questionText,
          description: row.description ?? '',
          isActive: row.active,
        });
      },
      error: () => this.snack.open('No se pudieron cargar categorías para el formulario', 'Cerrar', { duration: 4000 }),
    });
  }

  cancelQuestionnaireQuestionForm(): void {
    this.showQuestionnaireQuestionForm = false;
    this.editingQuestionnaireQuestionId = null;
  }

  saveQuestionnaireQuestion(): void {
    if (this.questionnaireQuestionForm.invalid) {
      this.questionnaireQuestionForm.markAllAsTouched();
      return;
    }
    const value = this.questionnaireQuestionForm.getRawValue();
    if (value.categoryId == null) {
      return;
    }
    const payload = {
      categoryId: value.categoryId,
      questionType: value.questionType || undefined,
      questionText: value.questionText,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingQuestionnaireQuestion = true;
    const request$ =
      this.editingQuestionnaireQuestionId != null
        ? this.questionnaireQuestionService.update(this.editingQuestionnaireQuestionId, payload)
        : this.questionnaireQuestionService.create(payload);
    request$.subscribe({
      next: () => {
        this.savingQuestionnaireQuestion = false;
        this.cancelQuestionnaireQuestionForm();
        this.loadQuestionnaireQuestions();
        this.snack.open('Pregunta guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingQuestionnaireQuestion = false;
        this.snack.open('No se pudo guardar la pregunta', 'Cerrar', { duration: 4000 });
      },
    });
  }

  deleteQuestionnaireQuestion(row: QuestionnaireQuestion): void {
    this.deleteCatalogRow(
      row,
      row.questionText,
      this.questionnaireQuestionService.delete(row.id),
      () => this.loadQuestionnaireQuestions(),
      this.editingQuestionnaireQuestionId,
      () => this.cancelQuestionnaireQuestionForm(),
    );
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
    this.loadCoverageCategorys();
    this.loadCharacteristics();
    this.loadCategorys();
    this.loadMaritalStatuss();
    this.loadExperienceLevels();
    this.loadTools();
    this.loadWorkSchedules();
    this.loadWorkplaces();
    this.loadRequirements();
    this.loadResponsibilityLevels();
    this.loadDisabilityTypes();
    this.loadBusinessUnits();
    this.loadPositionTypes();
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
      countryId: value.countryId ?? null,
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

  openCreateCoverageCategory(): void {
    this.resetCreateScope();
    this.editingCoverageCategoryId = null;
    this.showCoverageCategoryForm = true;
    this.coverageCategoryForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditCoverageCategory(row: CatalogCoverageCategory): void {
    this.editingCoverageCategoryId = row.id;
    this.showCoverageCategoryForm = true;
    this.coverageCategoryForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelCoverageCategoryForm(): void {
    this.showCoverageCategoryForm = false;
    this.editingCoverageCategoryId = null;
  }

  saveCoverageCategory(): void {
    if (this.coverageCategoryForm.invalid) {
      this.coverageCategoryForm.markAllAsTouched();
      return;
    }
    const value = this.coverageCategoryForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingCoverageCategory = true;
    const request$ =
      this.editingCoverageCategoryId != null
        ? this.coverageCategoryService.update(this.editingCoverageCategoryId, payload)
        : this.coverageCategoryService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingCoverageCategory = false;
        this.cancelCoverageCategoryForm();
        this.loadCoverageCategorys();
        this.snack.open('C Categoría cubrimiento guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCoverageCategory = false;
        this.snack.open('No se pudo guardar c categoría cubrimiento', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateCharacteristic(): void {
    this.resetCreateScope();
    this.editingCharacteristicId = null;
    this.showCharacteristicForm = true;
    this.characteristicForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditCharacteristic(row: CatalogCharacteristic): void {
    this.editingCharacteristicId = row.id;
    this.showCharacteristicForm = true;
    this.characteristicForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelCharacteristicForm(): void {
    this.showCharacteristicForm = false;
    this.editingCharacteristicId = null;
  }

  saveCharacteristic(): void {
    if (this.characteristicForm.invalid) {
      this.characteristicForm.markAllAsTouched();
      return;
    }
    const value = this.characteristicForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingCharacteristic = true;
    const request$ =
      this.editingCharacteristicId != null
        ? this.characteristicService.update(this.editingCharacteristicId, payload)
        : this.characteristicService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingCharacteristic = false;
        this.cancelCharacteristicForm();
        this.loadCharacteristics();
        this.snack.open('Características guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCharacteristic = false;
        this.snack.open('No se pudo guardar características', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateCategory(): void {
    this.resetCreateScope();
    this.editingCategoryId = null;
    this.showCategoryForm = true;
    this.categoryForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      isActive: true,
    });
  }

  openEditCategory(row: CatalogGeneralCategory): void {
    this.editingCategoryId = row.id;
    this.showCategoryForm = true;
    this.categoryForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelCategoryForm(): void {
    this.showCategoryForm = false;
    this.editingCategoryId = null;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    const value = this.categoryForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingCategory = true;
    const request$ =
      this.editingCategoryId != null
        ? this.generalCategoryService.update(this.editingCategoryId, payload)
        : this.generalCategoryService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingCategory = false;
        this.cancelCategoryForm();
        this.loadCategorys();
        this.snack.open('Categoría guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCategory = false;
        this.snack.open('No se pudo guardar categoría', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateMaritalStatus(): void {
    this.resetCreateScope();
    this.editingMaritalStatusId = null;
    this.showMaritalStatusForm = true;
    this.maritalStatusForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditMaritalStatus(row: CatalogMaritalStatus): void {
    this.editingMaritalStatusId = row.id;
    this.showMaritalStatusForm = true;
    this.maritalStatusForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelMaritalStatusForm(): void {
    this.showMaritalStatusForm = false;
    this.editingMaritalStatusId = null;
  }

  saveMaritalStatus(): void {
    if (this.maritalStatusForm.invalid) {
      this.maritalStatusForm.markAllAsTouched();
      return;
    }
    const value = this.maritalStatusForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingMaritalStatus = true;
    const request$ =
      this.editingMaritalStatusId != null
        ? this.maritalStatusService.update(this.editingMaritalStatusId, payload)
        : this.maritalStatusService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingMaritalStatus = false;
        this.cancelMaritalStatusForm();
        this.loadMaritalStatuss();
        this.snack.open('Estado civil guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingMaritalStatus = false;
        this.snack.open('No se pudo guardar estado civil', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateExperienceLevel(): void {
    this.resetCreateScope();
    this.editingExperienceLevelId = null;
    this.showExperienceLevelForm = true;
    this.experienceLevelForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditExperienceLevel(row: CatalogExperienceLevel): void {
    this.editingExperienceLevelId = row.id;
    this.showExperienceLevelForm = true;
    this.experienceLevelForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelExperienceLevelForm(): void {
    this.showExperienceLevelForm = false;
    this.editingExperienceLevelId = null;
  }

  saveExperienceLevel(): void {
    if (this.experienceLevelForm.invalid) {
      this.experienceLevelForm.markAllAsTouched();
      return;
    }
    const value = this.experienceLevelForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingExperienceLevel = true;
    const request$ =
      this.editingExperienceLevelId != null
        ? this.experienceLevelService.update(this.editingExperienceLevelId, payload)
        : this.experienceLevelService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingExperienceLevel = false;
        this.cancelExperienceLevelForm();
        this.loadExperienceLevels();
        this.snack.open('Experiencia guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingExperienceLevel = false;
        this.snack.open('No se pudo guardar experiencia', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateTool(): void {
    this.resetCreateScope();
    this.editingToolId = null;
    this.showToolForm = true;
    this.toolForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditTool(row: CatalogTool): void {
    this.editingToolId = row.id;
    this.showToolForm = true;
    this.toolForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelToolForm(): void {
    this.showToolForm = false;
    this.editingToolId = null;
  }

  saveTool(): void {
    if (this.toolForm.invalid) {
      this.toolForm.markAllAsTouched();
      return;
    }
    const value = this.toolForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingTool = true;
    const request$ =
      this.editingToolId != null
        ? this.toolService.update(this.editingToolId, payload)
        : this.toolService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingTool = false;
        this.cancelToolForm();
        this.loadTools();
        this.snack.open('Herramienta guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingTool = false;
        this.snack.open('No se pudo guardar herramienta', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateWorkSchedule(): void {
    this.resetCreateScope();
    this.editingWorkScheduleId = null;
    this.showWorkScheduleForm = true;
    this.workScheduleForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditWorkSchedule(row: CatalogWorkSchedule): void {
    this.editingWorkScheduleId = row.id;
    this.showWorkScheduleForm = true;
    this.workScheduleForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelWorkScheduleForm(): void {
    this.showWorkScheduleForm = false;
    this.editingWorkScheduleId = null;
  }

  saveWorkSchedule(): void {
    if (this.workScheduleForm.invalid) {
      this.workScheduleForm.markAllAsTouched();
      return;
    }
    const value = this.workScheduleForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingWorkSchedule = true;
    const request$ =
      this.editingWorkScheduleId != null
        ? this.workScheduleService.update(this.editingWorkScheduleId, payload)
        : this.workScheduleService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingWorkSchedule = false;
        this.cancelWorkScheduleForm();
        this.loadWorkSchedules();
        this.snack.open('Horario trabajo guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingWorkSchedule = false;
        this.snack.open('No se pudo guardar horario trabajo', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateWorkplace(): void {
    this.resetCreateScope();
    this.editingWorkplaceId = null;
    this.showWorkplaceForm = true;
    this.workplaceForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditWorkplace(row: CatalogWorkplace): void {
    this.editingWorkplaceId = row.id;
    this.showWorkplaceForm = true;
    this.workplaceForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelWorkplaceForm(): void {
    this.showWorkplaceForm = false;
    this.editingWorkplaceId = null;
  }

  saveWorkplace(): void {
    if (this.workplaceForm.invalid) {
      this.workplaceForm.markAllAsTouched();
      return;
    }
    const value = this.workplaceForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingWorkplace = true;
    const request$ =
      this.editingWorkplaceId != null
        ? this.workplaceService.update(this.editingWorkplaceId, payload)
        : this.workplaceService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingWorkplace = false;
        this.cancelWorkplaceForm();
        this.loadWorkplaces();
        this.snack.open('Lugar trabajo guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingWorkplace = false;
        this.snack.open('No se pudo guardar lugar trabajo', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateRequirement(): void {
    this.resetCreateScope();
    this.editingRequirementId = null;
    this.showRequirementForm = true;
    this.requirementForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditRequirement(row: CatalogRequirement): void {
    this.editingRequirementId = row.id;
    this.showRequirementForm = true;
    this.requirementForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelRequirementForm(): void {
    this.showRequirementForm = false;
    this.editingRequirementId = null;
  }

  saveRequirement(): void {
    if (this.requirementForm.invalid) {
      this.requirementForm.markAllAsTouched();
      return;
    }
    const value = this.requirementForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingRequirement = true;
    const request$ =
      this.editingRequirementId != null
        ? this.requirementService.update(this.editingRequirementId, payload)
        : this.requirementService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingRequirement = false;
        this.cancelRequirementForm();
        this.loadRequirements();
        this.snack.open('Requisitos guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingRequirement = false;
        this.snack.open('No se pudo guardar requisitos', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateResponsibilityLevel(): void {
    this.resetCreateScope();
    this.editingResponsibilityLevelId = null;
    this.showResponsibilityLevelForm = true;
    this.responsibilityLevelForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditResponsibilityLevel(row: CatalogResponsibilityLevel): void {
    this.editingResponsibilityLevelId = row.id;
    this.showResponsibilityLevelForm = true;
    this.responsibilityLevelForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelResponsibilityLevelForm(): void {
    this.showResponsibilityLevelForm = false;
    this.editingResponsibilityLevelId = null;
  }

  saveResponsibilityLevel(): void {
    if (this.responsibilityLevelForm.invalid) {
      this.responsibilityLevelForm.markAllAsTouched();
      return;
    }
    const value = this.responsibilityLevelForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingResponsibilityLevel = true;
    const request$ =
      this.editingResponsibilityLevelId != null
        ? this.responsibilityLevelService.update(this.editingResponsibilityLevelId, payload)
        : this.responsibilityLevelService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingResponsibilityLevel = false;
        this.cancelResponsibilityLevelForm();
        this.loadResponsibilityLevels();
        this.snack.open('Responsabilidad guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingResponsibilityLevel = false;
        this.snack.open('No se pudo guardar responsabilidad', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateDisabilityType(): void {
    this.resetCreateScope();
    this.editingDisabilityTypeId = null;
    this.showDisabilityTypeForm = true;
    this.disabilityTypeForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditDisabilityType(row: CatalogDisabilityType): void {
    this.editingDisabilityTypeId = row.id;
    this.showDisabilityTypeForm = true;
    this.disabilityTypeForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelDisabilityTypeForm(): void {
    this.showDisabilityTypeForm = false;
    this.editingDisabilityTypeId = null;
  }

  saveDisabilityType(): void {
    if (this.disabilityTypeForm.invalid) {
      this.disabilityTypeForm.markAllAsTouched();
      return;
    }
    const value = this.disabilityTypeForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingDisabilityType = true;
    const request$ =
      this.editingDisabilityTypeId != null
        ? this.disabilityTypeService.update(this.editingDisabilityTypeId, payload)
        : this.disabilityTypeService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingDisabilityType = false;
        this.cancelDisabilityTypeForm();
        this.loadDisabilityTypes();
        this.snack.open('Tipo discapacidad guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingDisabilityType = false;
        this.snack.open('No se pudo guardar tipo discapacidad', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateBusinessUnit(): void {
    this.resetCreateScope();
    this.editingBusinessUnitId = null;
    this.showBusinessUnitForm = true;
    this.businessUnitForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditBusinessUnit(row: CatalogBusinessUnit): void {
    this.editingBusinessUnitId = row.id;
    this.showBusinessUnitForm = true;
    this.businessUnitForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelBusinessUnitForm(): void {
    this.showBusinessUnitForm = false;
    this.editingBusinessUnitId = null;
  }

  saveBusinessUnit(): void {
    if (this.businessUnitForm.invalid) {
      this.businessUnitForm.markAllAsTouched();
      return;
    }
    const value = this.businessUnitForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingBusinessUnit = true;
    const request$ =
      this.editingBusinessUnitId != null
        ? this.businessUnitService.update(this.editingBusinessUnitId, payload)
        : this.businessUnitService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingBusinessUnit = false;
        this.cancelBusinessUnitForm();
        this.loadBusinessUnits();
        this.snack.open('Unidad de negocio guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingBusinessUnit = false;
        this.snack.open('No se pudo guardar unidad de negocio', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreatePositionType(): void {
    this.resetCreateScope();
    this.editingPositionTypeId = null;
    this.showPositionTypeForm = true;
    this.positionTypeForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      legacyManpowerId: null,
      isActive: true,
    });
  }

  openEditPositionType(row: CatalogPositionType): void {
    this.editingPositionTypeId = row.id;
    this.showPositionTypeForm = true;
    this.positionTypeForm.patchValue({
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code,
      name: row.name,
      description: row.description ?? '',
      legacyManpowerId: row.legacyManpowerId ?? null,
      isActive: row.isActive,
    });
  }

  cancelPositionTypeForm(): void {
    this.showPositionTypeForm = false;
    this.editingPositionTypeId = null;
  }

  savePositionType(): void {
    if (this.positionTypeForm.invalid) {
      this.positionTypeForm.markAllAsTouched();
      return;
    }
    const value = this.positionTypeForm.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      legacyManpowerId: value.legacyManpowerId ?? undefined,
      isActive: value.isActive,
    };
    this.savingPositionType = true;
    const request$ =
      this.editingPositionTypeId != null
        ? this.positionTypeService.update(this.editingPositionTypeId, payload)
        : this.positionTypeService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingPositionType = false;
        this.cancelPositionTypeForm();
        this.loadPositionTypes();
        this.snack.open('Puesto guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingPositionType = false;
        this.snack.open('No se pudo guardar puesto', 'Cerrar', { duration: 4000 });
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
    this.editingCompanyId = null;
    this.showCompanyForm = true;
    this.companyForm.reset({
      code: '',
      name: '',
      description: '',
      tradeName: '',
      taxId: '',
      countryId: this.selectedCountryId,
      billingMessage: '',
      atsCode: null,
      noPurchaseOrder: false,
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
      countryId: row.countryId,
      billingMessage: row.billingMessage ?? '',
      atsCode: row.atsCode ?? null,
      noPurchaseOrder: row.noPurchaseOrder ?? false,
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
    const payload = {
      ...value,
      countryId: value.countryId!,
      atsCode: value.atsCode ?? undefined,
      billingMessage: value.billingMessage || undefined,
    };
    this.savingCompany = true;
    const request$ =
      this.editingCompanyId != null
        ? this.companyService.update(this.editingCompanyId, payload)
        : this.companyService.create(payload);
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
      countryId: value.countryId ?? null,
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
    this.loadCoverageCategorys();
    this.loadCharacteristics();
    this.loadCategorys();
    this.loadMaritalStatuss();
    this.loadExperienceLevels();
    this.loadTools();
    this.loadWorkSchedules();
    this.loadWorkplaces();
    this.loadRequirements();
    this.loadResponsibilityLevels();
    this.loadDisabilityTypes();
    this.loadBusinessUnits();
    this.loadPositionTypes();
        this.snack.open('Tipo de requisición guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingRequisitionType = false;
        this.snack.open('No se pudo guardar el tipo de requisición', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateCompanyArea(): void {
    this.resetCreateScope();
    this.editingCompanyAreaId = null;
    this.showCompanyAreaForm = true;
    this.companyAreaForm.reset({
      catalogCompanyId: this.selectedCatalogCompanyId,
      countryId: this.selectedCountryId,
      name: '',
      description: '',
      isActive: true,
    });
  }

  openEditCompanyArea(row: CatalogCompanyArea): void {
    this.editingCompanyAreaId = row.id;
    this.showCompanyAreaForm = true;
    this.companyAreaForm.patchValue({
      catalogCompanyId: row.catalogCompanyId ?? this.selectedCatalogCompanyId,
      countryId: row.countryId ?? this.selectedCountryId,
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelCompanyAreaForm(): void {
    this.showCompanyAreaForm = false;
    this.editingCompanyAreaId = null;
  }

  saveCompanyArea(): void {
    if (this.companyAreaForm.invalid) {
      this.companyAreaForm.markAllAsTouched();
      return;
    }
    const value = this.companyAreaForm.getRawValue();
    const payload = {
      catalogCompanyId: value.catalogCompanyId!,
      countryId: value.countryId ?? undefined,
      name: value.name,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingCompanyArea = true;
    const request$ =
      this.editingCompanyAreaId != null
        ? this.companyAreaService.update(this.editingCompanyAreaId, payload)
        : this.companyAreaService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingCompanyArea = false;
        this.cancelCompanyAreaForm();
        this.loadCompanyAreas();
        this.snack.open('Áreas guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCompanyArea = false;
        this.snack.open('No se pudo guardar áreas', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateCompanyDepartment(): void {
    this.resetCreateScope();
    this.editingCompanyDepartmentId = null;
    this.showCompanyDepartmentForm = true;
    this.companyDepartmentForm.reset({
      catalogCompanyId: this.selectedCatalogCompanyId,
      countryId: this.selectedCountryId,
      name: '',
      description: '',
      isActive: true,
    });
  }

  openEditCompanyDepartment(row: CatalogCompanyDepartment): void {
    this.editingCompanyDepartmentId = row.id;
    this.showCompanyDepartmentForm = true;
    this.companyDepartmentForm.patchValue({
      catalogCompanyId: row.catalogCompanyId ?? this.selectedCatalogCompanyId,
      countryId: row.countryId ?? this.selectedCountryId,
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelCompanyDepartmentForm(): void {
    this.showCompanyDepartmentForm = false;
    this.editingCompanyDepartmentId = null;
  }

  saveCompanyDepartment(): void {
    if (this.companyDepartmentForm.invalid) {
      this.companyDepartmentForm.markAllAsTouched();
      return;
    }
    const value = this.companyDepartmentForm.getRawValue();
    const payload = {
      catalogCompanyId: value.catalogCompanyId!,
      countryId: value.countryId ?? undefined,
      name: value.name,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingCompanyDepartment = true;
    const request$ =
      this.editingCompanyDepartmentId != null
        ? this.companyDepartmentService.update(this.editingCompanyDepartmentId, payload)
        : this.companyDepartmentService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingCompanyDepartment = false;
        this.cancelCompanyDepartmentForm();
        this.loadCompanyDepartments();
        this.snack.open('Departamentos guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCompanyDepartment = false;
        this.snack.open('No se pudo guardar departamentos', 'Cerrar', { duration: 4000 });
      },
    });
  }
  openCreateBranch(): void {
    this.resetCreateScope();
    this.editingBranchId = null;
    this.showBranchForm = true;
    this.branchForm.reset({
      catalogCompanyId: null,
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      description: '',
      isActive: true,
    });
  }

  openEditBranch(row: CatalogBranch): void {
    this.editingBranchId = row.id;
    this.showBranchForm = true;
    this.branchForm.patchValue({
      catalogCompanyId: row.catalogCompanyId ?? null,
      countryId: row.countryId ?? this.selectedCountryId,
      code: row.code ?? '',
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelBranchForm(): void {
    this.showBranchForm = false;
    this.editingBranchId = null;
  }

  saveBranch(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }
    const value = this.branchForm.getRawValue();
    const payload = {
      catalogCompanyId: value.catalogCompanyId ?? undefined,
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      description: value.description || undefined,
      isActive: value.isActive,
    };
    this.savingBranch = true;
    const request$ =
      this.editingBranchId != null
        ? this.branchService.update(this.editingBranchId, payload)
        : this.branchService.create(this.withCreateScope(payload));
    request$.subscribe({
      next: () => {
        this.savingBranch = false;
        this.cancelBranchForm();
        this.loadBranchs();
        this.snack.open('Sucursales guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingBranch = false;
        this.snack.open('No se pudo guardar sucursales', 'Cerrar', { duration: 4000 });
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

  private deleteCatalogRow(
    row: { id: number },
    label: string | null | undefined,
    deleteCall: import('rxjs').Observable<unknown>,
    reload: () => void,
    editingId: number | null,
    cancelForm: () => void,
  ): void {
    const display = label?.trim() || `ID ${row.id}`;
    if (!confirm(`¿Eliminar "${display}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.deletingCatalogId = row.id;
    deleteCall.subscribe({
      next: () => {
        this.deletingCatalogId = null;
        if (editingId === row.id) {
          cancelForm();
        }
        reload();
        this.snack.open('Registro eliminado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.deletingCatalogId = null;
        this.snack.open('No se pudo eliminar el registro', 'Cerrar', { duration: 4000 });
      },
    });
  }

  deleteGender(row: CatalogGender): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.genderService.delete(row.id),
      () => this.loadGenders(),
      this.editingGenderId,
      () => this.cancelGenderForm(),
    );
  }

  deleteKinship(row: CatalogKinship): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.kinshipService.delete(row.id),
      () => this.loadKinships(),
      this.editingKinshipId,
      () => this.cancelKinshipForm(),
    );
  }

  deleteCompany(row: CatalogCompany): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.companyService.delete(row.id),
      () => this.loadCompanies(),
      this.editingCompanyId,
      () => this.cancelCompanyForm(),
    );
  }

  deleteCurrency(row: CatalogCurrency): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.currencyService.delete(row.id),
      () => this.loadCurrencies(),
      this.editingCurrencyId,
      () => this.cancelCurrencyForm(),
    );
  }

  deleteCareer(row: CatalogCareer): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.careerService.delete(row.id),
      () => this.loadCareers(),
      this.editingCareerId,
      () => this.cancelCareerForm(),
    );
  }

  deleteLanguage(row: CatalogLanguage): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.languageService.delete(row.id),
      () => this.loadLanguages(),
      this.editingLanguageId,
      () => this.cancelLanguageForm(),
    );
  }

  deleteShift(row: CatalogShift): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.shiftService.delete(row.id),
      () => this.loadShifts(),
      this.editingShiftId,
      () => this.cancelShiftForm(),
    );
  }

  deleteBenefit(row: CatalogBenefit): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.benefitService.delete(row.id),
      () => this.loadBenefits(),
      this.editingBenefitId,
      () => this.cancelBenefitForm(),
    );
  }

  deleteDocumentType(row: CatalogDocumentType): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.documentTypeService.delete(row.id),
      () => this.loadDocumentTypes(),
      this.editingDocumentTypeId,
      () => this.cancelDocumentTypeForm(),
    );
  }

  deleteBrand(row: CatalogBrand): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.brandService.delete(row.id),
      () => this.loadBrands(),
      this.editingBrandId,
      () => this.cancelBrandForm(),
    );
  }

  deleteContractType(row: CatalogContractType): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.contractTypeService.delete(row.id),
      () => this.loadContractTypes(),
      this.editingContractTypeId,
      () => this.cancelContractTypeForm(),
    );
  }

  deleteCoverageType(row: CatalogCoverageType): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.coverageTypeService.delete(row.id),
      () => this.loadCoverageTypes(),
      this.editingCoverageTypeId,
      () => this.cancelCoverageTypeForm(),
    );
  }

  deleteEducationLevel(row: CatalogEducationLevel): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.educationLevelService.delete(row.id),
      () => this.loadEducationLevels(),
      this.editingEducationLevelId,
      () => this.cancelEducationLevelForm(),
    );
  }

  deleteLanguageLevel(row: CatalogLanguageLevel): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.languageLevelService.delete(row.id),
      () => this.loadLanguageLevels(),
      this.editingLanguageLevelId,
      () => this.cancelLanguageLevelForm(),
    );
  }

  deleteRequisitionType(row: CatalogRequisitionType): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.requisitionTypeService.delete(row.id),
      () => this.loadRequisitionTypes(),
      this.editingRequisitionTypeId,
      () => this.cancelRequisitionTypeForm(),
    );
  }

  deleteCompanyArea(row: CatalogCompanyArea): void {
    this.deleteCatalogRow(
      row,
      row.name,
      this.companyAreaService.delete(row.id),
      () => this.loadCompanyAreas(),
      this.editingCompanyAreaId,
      () => this.cancelCompanyAreaForm(),
    );
  }

  deleteCompanyDepartment(row: CatalogCompanyDepartment): void {
    this.deleteCatalogRow(
      row,
      row.name,
      this.companyDepartmentService.delete(row.id),
      () => this.loadCompanyDepartments(),
      this.editingCompanyDepartmentId,
      () => this.cancelCompanyDepartmentForm(),
    );
  }

  deleteBranch(row: CatalogBranch): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.branchService.delete(row.id),
      () => this.loadBranchs(),
      this.editingBranchId,
      () => this.cancelBranchForm(),
    );
  }

  deleteJobPortal(row: CatalogJobPortal): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.jobPortalService.delete(row.id),
      () => this.loadJobPortals(),
      this.editingJobPortalId,
      () => this.cancelJobPortalForm(),
    );
  }

  deleteCoverageCategory(row: CatalogCoverageCategory): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.coverageCategoryService.delete(row.id),
      () => this.loadCoverageCategorys(),
      this.editingCoverageCategoryId,
      () => this.cancelCoverageCategoryForm(),
    );
  }

  deleteCharacteristic(row: CatalogCharacteristic): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.characteristicService.delete(row.id),
      () => this.loadCharacteristics(),
      this.editingCharacteristicId,
      () => this.cancelCharacteristicForm(),
    );
  }

  deleteCategory(row: CatalogGeneralCategory): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.generalCategoryService.delete(row.id),
      () => this.loadCategorys(),
      this.editingCategoryId,
      () => this.cancelCategoryForm(),
    );
  }

  deleteMaritalStatus(row: CatalogMaritalStatus): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.maritalStatusService.delete(row.id),
      () => this.loadMaritalStatuss(),
      this.editingMaritalStatusId,
      () => this.cancelMaritalStatusForm(),
    );
  }

  deleteExperienceLevel(row: CatalogExperienceLevel): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.experienceLevelService.delete(row.id),
      () => this.loadExperienceLevels(),
      this.editingExperienceLevelId,
      () => this.cancelExperienceLevelForm(),
    );
  }

  deleteTool(row: CatalogTool): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.toolService.delete(row.id),
      () => this.loadTools(),
      this.editingToolId,
      () => this.cancelToolForm(),
    );
  }

  deleteWorkSchedule(row: CatalogWorkSchedule): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.workScheduleService.delete(row.id),
      () => this.loadWorkSchedules(),
      this.editingWorkScheduleId,
      () => this.cancelWorkScheduleForm(),
    );
  }

  deleteWorkplace(row: CatalogWorkplace): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.workplaceService.delete(row.id),
      () => this.loadWorkplaces(),
      this.editingWorkplaceId,
      () => this.cancelWorkplaceForm(),
    );
  }

  deleteRequirement(row: CatalogRequirement): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.requirementService.delete(row.id),
      () => this.loadRequirements(),
      this.editingRequirementId,
      () => this.cancelRequirementForm(),
    );
  }

  deleteResponsibilityLevel(row: CatalogResponsibilityLevel): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.responsibilityLevelService.delete(row.id),
      () => this.loadResponsibilityLevels(),
      this.editingResponsibilityLevelId,
      () => this.cancelResponsibilityLevelForm(),
    );
  }

  deleteDisabilityType(row: CatalogDisabilityType): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.disabilityTypeService.delete(row.id),
      () => this.loadDisabilityTypes(),
      this.editingDisabilityTypeId,
      () => this.cancelDisabilityTypeForm(),
    );
  }

  deleteBusinessUnit(row: CatalogBusinessUnit): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.businessUnitService.delete(row.id),
      () => this.loadBusinessUnits(),
      this.editingBusinessUnitId,
      () => this.cancelBusinessUnitForm(),
    );
  }

  deletePositionType(row: CatalogPositionType): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.positionTypeService.delete(row.id),
      () => this.loadPositionTypes(),
      this.editingPositionTypeId,
      () => this.cancelPositionTypeForm(),
    );
  }

  deleteClient(row: CatalogClient): void {
    this.deleteCatalogRow(
      row,
      row.tradeName || row.legalName || row.code,
      this.clientService.delete(row.id),
      () => this.loadClients(),
      this.editingClientId,
      () => this.cancelClientForm(),
    );
  }

  deleteCountry(row: CatalogCountry): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.geographyService.deleteCountry(row.id),
      () => this.loadCountryRecords(),
      this.editingCountryId,
      () => this.cancelCountryForm(),
    );
  }

  deleteState(row: CatalogState): void {
    this.deleteCatalogRow(
      row,
      row.name || row.code,
      this.geographyService.deleteState(row.id),
      () => this.loadStates(),
      this.editingStateId,
      () => this.cancelStateForm(),
    );
  }

  deleteMunicipality(row: CatalogMunicipality): void {
    this.deleteCatalogRow(
      row,
      row.name,
      this.geographyService.deleteMunicipality(row.id),
      () => this.loadMunicipalities(),
      this.editingMunicipalityId,
      () => this.cancelMunicipalityForm(),
    );
  }

  deleteNeighborhood(row: CatalogNeighborhood): void {
    this.deleteCatalogRow(
      row,
      row.name,
      this.geographyService.deleteNeighborhood(row.id),
      () => this.loadNeighborhoods(),
      this.editingNeighborhoodId,
      () => this.cancelNeighborhoodForm(),
    );
  }
}
