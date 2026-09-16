#!/usr/bin/env python3
"""Wire delete in catalogs-admin HTML and generate delete* methods."""
import re

HTML = "src/app/features/settings/catalogs/catalogs-admin.component.html"
TS = "src/app/features/settings/catalogs/catalogs-admin.component.ts"

# --- HTML ---
html = open(HTML, encoding="utf-8").read()
html_pattern = re.compile(
    r'<sh-catalog-list-actions\s+\(editClick\)="openEdit(\w+)\(row\)"\s+\[editDisabled\]="!canEditRecord\(row\.companyId\)"\s*/>'
)

def html_repl(m: re.Match) -> str:
    entity = m.group(1)
    return (
        f'<sh-catalog-list-actions [showDelete]="true" (editClick)="openEdit{entity}(row)" '
        f'(deleteClick)="delete{entity}(row)" [editDisabled]="!canEditRecord(row.companyId)" '
        f'[deleteDisabled]="!canEditRecord(row.companyId) || deletingCatalogId === row.id" />'
    )

html, html_count = html_pattern.subn(html_repl, html)
open(HTML, "w", encoding="utf-8").write(html)
print("HTML replacements:", html_count)

# --- TS mappings: entity suffix -> (service call, load fn, cancel fn, editing id, row type, label) ---
ENTITIES = [
    ("Gender", "this.genderService.delete(row.id)", "loadGenders", "cancelGenderForm", "editingGenderId", "CatalogGender", "row.name || row.code"),
    ("Kinship", "this.kinshipService.delete(row.id)", "loadKinships", "cancelKinshipForm", "editingKinshipId", "CatalogKinship", "row.name || row.code"),
    ("Company", "this.companyService.delete(row.id)", "loadCompanies", "cancelCompanyForm", "editingCompanyId", "CatalogCompany", "row.name || row.code"),
    ("Currency", "this.currencyService.delete(row.id)", "loadCurrencies", "cancelCurrencyForm", "editingCurrencyId", "CatalogCurrency", "row.name || row.code"),
    ("Career", "this.careerService.delete(row.id)", "loadCareers", "cancelCareerForm", "editingCareerId", "CatalogCareer", "row.name || row.code"),
    ("Language", "this.languageService.delete(row.id)", "loadLanguages", "cancelLanguageForm", "editingLanguageId", "CatalogLanguage", "row.name || row.code"),
    ("Shift", "this.shiftService.delete(row.id)", "loadShifts", "cancelShiftForm", "editingShiftId", "CatalogShift", "row.name || row.code"),
    ("Benefit", "this.benefitService.delete(row.id)", "loadBenefits", "cancelBenefitForm", "editingBenefitId", "CatalogBenefit", "row.name || row.code"),
    ("DocumentType", "this.documentTypeService.delete(row.id)", "loadDocumentTypes", "cancelDocumentTypeForm", "editingDocumentTypeId", "CatalogDocumentType", "row.name || row.code"),
    ("Brand", "this.brandService.delete(row.id)", "loadBrands", "cancelBrandForm", "editingBrandId", "CatalogBrand", "row.name || row.code"),
    ("ContractType", "this.contractTypeService.delete(row.id)", "loadContractTypes", "cancelContractTypeForm", "editingContractTypeId", "CatalogContractType", "row.name || row.code"),
    ("CoverageType", "this.coverageTypeService.delete(row.id)", "loadCoverageTypes", "cancelCoverageTypeForm", "editingCoverageTypeId", "CatalogCoverageType", "row.name || row.code"),
    ("EducationLevel", "this.educationLevelService.delete(row.id)", "loadEducationLevels", "cancelEducationLevelForm", "editingEducationLevelId", "CatalogEducationLevel", "row.name || row.code"),
    ("LanguageLevel", "this.languageLevelService.delete(row.id)", "loadLanguageLevels", "cancelLanguageLevelForm", "editingLanguageLevelId", "CatalogLanguageLevel", "row.name || row.code"),
    ("RequisitionType", "this.requisitionTypeService.delete(row.id)", "loadRequisitionTypes", "cancelRequisitionTypeForm", "editingRequisitionTypeId", "CatalogRequisitionType", "row.name || row.code"),
    ("CompanyArea", "this.companyAreaService.delete(row.id)", "loadCompanyAreas", "cancelCompanyAreaForm", "editingCompanyAreaId", "CatalogCompanyArea", "row.name || row.code"),
    ("CompanyDepartment", "this.companyDepartmentService.delete(row.id)", "loadCompanyDepartments", "cancelCompanyDepartmentForm", "editingCompanyDepartmentId", "CatalogCompanyDepartment", "row.name || row.code"),
    ("Branch", "this.branchService.delete(row.id)", "loadBranches", "cancelBranchForm", "editingBranchId", "CatalogBranch", "row.name || row.code"),
    ("JobPortal", "this.jobPortalService.delete(row.id)", "loadJobPortals", "cancelJobPortalForm", "editingJobPortalId", "CatalogJobPortal", "row.name || row.code"),
    ("CoverageCategory", "this.coverageCategoryService.delete(row.id)", "loadCoverageCategories", "cancelCoverageCategoryForm", "editingCoverageCategoryId", "CatalogCoverageCategory", "row.name || row.code"),
    ("Characteristic", "this.characteristicService.delete(row.id)", "loadCharacteristics", "cancelCharacteristicForm", "editingCharacteristicId", "CatalogCharacteristic", "row.name || row.code"),
    ("Category", "this.categoryService.delete(row.id)", "loadCategories", "cancelCategoryForm", "editingCategoryId", "CatalogCategory", "row.name || row.code"),
    ("MaritalStatus", "this.maritalStatusService.delete(row.id)", "loadMaritalStatuses", "cancelMaritalStatusForm", "editingMaritalStatusId", "CatalogMaritalStatus", "row.name || row.code"),
    ("ExperienceLevel", "this.experienceLevelService.delete(row.id)", "loadExperienceLevels", "cancelExperienceLevelForm", "editingExperienceLevelId", "CatalogExperienceLevel", "row.name || row.code"),
    ("Tool", "this.toolService.delete(row.id)", "loadTools", "cancelToolForm", "editingToolId", "CatalogTool", "row.name || row.code"),
    ("WorkSchedule", "this.workScheduleService.delete(row.id)", "loadWorkSchedules", "cancelWorkScheduleForm", "editingWorkScheduleId", "CatalogWorkSchedule", "row.name || row.code"),
    ("Workplace", "this.workplaceService.delete(row.id)", "loadWorkplaces", "cancelWorkplaceForm", "editingWorkplaceId", "CatalogWorkplace", "row.name || row.code"),
    ("Requirement", "this.requirementService.delete(row.id)", "loadRequirements", "cancelRequirementForm", "editingRequirementId", "CatalogRequirement", "row.name || row.code"),
    ("ResponsibilityLevel", "this.responsibilityLevelService.delete(row.id)", "loadResponsibilityLevels", "cancelResponsibilityLevelForm", "editingResponsibilityLevelId", "CatalogResponsibilityLevel", "row.name || row.code"),
    ("DisabilityType", "this.disabilityTypeService.delete(row.id)", "loadDisabilityTypes", "cancelDisabilityTypeForm", "editingDisabilityTypeId", "CatalogDisabilityType", "row.name || row.code"),
    ("BusinessUnit", "this.businessUnitService.delete(row.id)", "loadBusinessUnits", "cancelBusinessUnitForm", "editingBusinessUnitId", "CatalogBusinessUnit", "row.name || row.code"),
    ("PositionType", "this.positionTypeService.delete(row.id)", "loadPositionTypes", "cancelPositionTypeForm", "editingPositionTypeId", "CatalogPositionType", "row.name || row.code"),
    ("Client", "this.clientService.delete(row.id)", "loadClients", "cancelClientForm", "editingClientId", "CatalogClient", "row.businessName || row.code"),
    ("ClientCompany", "this.clientCompanyService.delete(row.id)", "loadClientCompanies", "cancelClientCompanyForm", "editingClientCompanyId", "CatalogClientCompany", "row.name || row.code"),
    ("Country", "this.geographyService.deleteCountry(row.id)", "loadCountryRecords", "cancelCountryForm", "editingCountryId", "CatalogCountry", "row.name || row.code"),
    ("State", "this.geographyService.deleteState(row.id)", "loadStates", "cancelStateForm", "editingStateId", "CatalogState", "row.name || row.code"),
    ("Municipality", "this.geographyService.deleteMunicipality(row.id)", "loadMunicipalities", "cancelMunicipalityForm", "editingMunicipalityId", "CatalogMunicipality", "row.name || row.code"),
    ("Neighborhood", "this.geographyService.deleteNeighborhood(row.id)", "loadNeighborhoods", "cancelNeighborhoodForm", "editingNeighborhoodId", "CatalogNeighborhood", "row.name || row.code"),
]

ts = open(TS, encoding="utf-8").read()

if "deletingCatalogId" not in ts:
    ts = ts.replace(
        "  genders: CatalogGender[] = [];",
        "  deletingCatalogId: number | null = null;\n  genders: CatalogGender[] = [];",
        1,
    )

methods = []
for entity, delete_call, load_fn, cancel_fn, editing_id, row_type, label in ENTITIES:
    if f"delete{entity}(row:" in ts:
        continue
    methods.append(f"""
  delete{entity}(row: {row_type}): void {{
    this.deleteCatalogRow(
      row,
      {label},
      {delete_call},
      () => this.{load_fn}(),
      this.{editing_id},
      () => this.{cancel_fn}(),
    );
  }}""")

if "deleteCatalogRow(" not in ts:
    helper = """
  private deleteCatalogRow(
    row: { id: number },
    label: string,
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
"""
    ts = ts.rstrip()
    ts = ts[:-1] + helper + "\n".join(methods) + "\n}\n"
else:
    ts = ts.rstrip()
    ts = ts[:-1] + "\n".join(methods) + "\n}\n"

open(TS, "w", encoding="utf-8").write(ts)
print("methods added:", len(methods))
