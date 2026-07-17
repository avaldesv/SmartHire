import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { WizardFieldOption } from '../../shared/models/requisition-wizard.model';
import { CatalogBrandService } from './catalog-brand.service';
import { CatalogCareerService } from './catalog-career.service';
import { CatalogContractTypeService } from './catalog-contract-type.service';
import { CatalogCurrencyService } from './catalog-currency.service';
import { CatalogDisabilityTypeService } from './catalog-disability-type.service';
import { CatalogDocumentTypeService } from './catalog-document-type.service';
import { CatalogEducationLevelService } from './catalog-education-level.service';
import { CatalogExperienceLevelService } from './catalog-experience-level.service';
import { CatalogGenderService } from './catalog-gender.service';
import { CatalogGeneralCategoryService } from './catalog-general-category.service';
import { CatalogGeographyService } from './catalog-geography.service';
import { CatalogJobPortalService } from './catalog-job-portal.service';
import { CatalogLanguageLevelService } from './catalog-language-level.service';
import { CatalogLanguageService } from './catalog-language.service';
import { CatalogMaritalStatusService } from './catalog-marital-status.service';
import { CatalogBenefitService } from './catalog-benefit.service';
import { CatalogCoverageTypeService } from './catalog-coverage-type.service';
import { CatalogRequisitionTypeService } from './catalog-requisition-type.service';
import { CatalogResponsibilityLevelService } from './catalog-responsibility-level.service';
import { CatalogShiftService } from './catalog-shift.service';
import { CatalogRequirementService } from './catalog-requirement.service';
import { CatalogToolService } from './catalog-tool.service';
import { CatalogWorkplaceService } from './catalog-workplace.service';
import { QuestionnaireQuestionnaireApiService } from './questionnaire-questionnaire-api.service';
import { SecurityRecruiterGroupService } from './security-recruiter-group.service';
import { SecurityUserService } from './security-user.service';

export interface WizardCatalogContext {
  countryId?: number | null;
  stateId?: number | null;
  postalCode?: string | null;
}

@Injectable({ providedIn: 'root' })
export class WizardFieldCatalogService {
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly brandService = inject(CatalogBrandService);
  private readonly coverageTypeService = inject(CatalogCoverageTypeService);
  private readonly requisitionTypeService = inject(CatalogRequisitionTypeService);
  private readonly genderService = inject(CatalogGenderService);
  private readonly maritalStatusService = inject(CatalogMaritalStatusService);
  private readonly educationLevelService = inject(CatalogEducationLevelService);
  private readonly careerService = inject(CatalogCareerService);
  private readonly experienceLevelService = inject(CatalogExperienceLevelService);
  private readonly currencyService = inject(CatalogCurrencyService);
  private readonly contractTypeService = inject(CatalogContractTypeService);
  private readonly benefitService = inject(CatalogBenefitService);
  private readonly shiftService = inject(CatalogShiftService);
  private readonly recruiterGroupService = inject(SecurityRecruiterGroupService);
  private readonly disabilityTypeService = inject(CatalogDisabilityTypeService);
  private readonly generalCategoryService = inject(CatalogGeneralCategoryService);
  private readonly workplaceService = inject(CatalogWorkplaceService);
  private readonly requirementService = inject(CatalogRequirementService);
  private readonly toolService = inject(CatalogToolService);
  private readonly responsibilityLevelService = inject(CatalogResponsibilityLevelService);
  private readonly jobPortalService = inject(CatalogJobPortalService);
  private readonly documentTypeService = inject(CatalogDocumentTypeService);
  private readonly languageService = inject(CatalogLanguageService);
  private readonly languageLevelService = inject(CatalogLanguageLevelService);
  private readonly userService = inject(SecurityUserService);
  private readonly questionnaireService = inject(QuestionnaireQuestionnaireApiService);

  loadOptions(dataSourceKey: string | null | undefined, context: WizardCatalogContext = {}): Observable<WizardFieldOption[]> {
    if (!dataSourceKey) {
      return of([]);
    }
    const countryId = context.countryId ?? undefined;

    switch (dataSourceKey) {
      case 'countries':
        return this.geographyService.listCountries().pipe(map((items) => this.toOptions(items)));
      case 'brands':
        return countryId != null
          ? this.brandService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'coverage-types':
        return countryId != null
          ? this.coverageTypeService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'requisition-types':
        return countryId != null
          ? this.requisitionTypeService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'gender':
        return countryId != null
          ? this.genderService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'marital-status':
        return countryId != null
          ? this.maritalStatusService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'education-levels':
        return countryId != null
          ? this.educationLevelService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'careers':
        return countryId != null
          ? this.careerService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'experience-levels':
        return countryId != null
          ? this.experienceLevelService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'currencies':
        return countryId != null
          ? this.currencyService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'contract-types':
        return countryId != null
          ? this.contractTypeService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'benefits':
        return countryId != null
          ? this.benefitService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'shifts':
        return countryId != null
          ? this.shiftService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'recruiter-groups':
        return countryId != null
          ? this.recruiterGroupService.list(countryId, 0, 200).pipe(
              map((r) =>
                r.items.map((g) => ({
                  id: g.id,
                  label: g.description?.trim() ? g.description : g.code,
                })),
              ),
            )
          : of([]);
      case 'disability-types':
        return countryId != null
          ? this.disabilityTypeService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'requirements':
        return countryId != null
          ? this.requirementService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'tools':
        return countryId != null
          ? this.toolService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'general-categories':
        return countryId != null
          ? this.generalCategoryService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'workplaces':
        return countryId != null
          ? this.workplaceService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'responsibility-levels':
        return countryId != null
          ? this.responsibilityLevelService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'job-portals':
        return countryId != null
          ? this.jobPortalService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'document-types':
        return countryId != null
          ? this.documentTypeService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'languages':
        return this.languageService.list(0, 200).pipe(map((r) => this.toOptions(r.items)));
      case 'language-levels':
        return countryId != null
          ? this.languageLevelService.list(countryId, 0, 200).pipe(map((r) => this.toOptions(r.items)))
          : of([]);
      case 'states':
        return countryId != null
          ? this.geographyService.listStates(countryId).pipe(map((items) => this.toOptions(items)))
          : of([]);
      case 'municipalities':
        return context.stateId != null
          ? this.geographyService.listMunicipalities(context.stateId).pipe(map((items) => this.toOptions(items)))
          : of([]);
      case 'neighborhoods':
        return context.postalCode?.length
          ? this.geographyService
              .listNeighborhoodsByPostalCode(context.postalCode)
              .pipe(map((items) => this.toOptions(items)))
          : of([]);
      case 'users':
        return this.userService.list(0, 200).pipe(
          map((r) =>
            r.items.map((u) => {
              const label = `${u.name ?? ''} ${u.lastName ?? ''}`.trim();
              return { id: u.id, label: label || u.email };
            }),
          ),
        );
      case 'questionnaires':
        return this.questionnaireService
          .list({ status: 'PUBLISHED', isActive: true }, 0, 200)
          .pipe(map((r) => this.toOptions(r.items)));
      default:
        return of([]);
    }
  }

  private toOptions(items: Array<{ id: number; name: string }>): WizardFieldOption[] {
    return items.map((item) => ({ id: item.id, label: item.name }));
  }
}
