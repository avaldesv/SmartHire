import {
  buildJobDescriptionPrompt,
  JobDescriptionPromptCatalogLabels,
  JobDescriptionPromptSnapshot,
} from './build-job-description-prompt';

const LABELS: JobDescriptionPromptCatalogLabels = {
  jobPortal: { 10: 'OCC Mundial', 11: 'Computrabajo' },
  educationLevel: { 3: 'Licenciatura' },
  shift: { 2: 'Matutino' },
  workplace: { 4: 'Híbrido' },
  contractType: { 5: 'Indeterminado' },
  language: { 1: 'Inglés', 2: 'Francés' },
  languageLevel: { 8: 'Avanzado' },
};

describe('buildJobDescriptionPrompt', () => {
  it('returns empty string when positionName is missing', () => {
    expect(buildJobDescriptionPrompt({}, LABELS, 'es')).toBe('');
    expect(buildJobDescriptionPrompt({ positionName: '   ' }, LABELS, 'es')).toBe('');
  });

  it('includes positionName, tone, closing and language; omits empty optional fields', () => {
    const prompt = buildJobDescriptionPrompt({ positionName: 'Analista de datos' }, {}, 'es');

    expect(prompt).toContain('Analista de datos');
    expect(prompt).toContain('especialista en reclutamiento');
    expect(prompt).toContain('atractivo y persuasivo, positivo y motivador, personalizado y humano');
    expect(prompt).toContain(
      'En la respuesta no incluyas el nombre de la vacante, ni nada adicional a la publicación de la vacante',
    );
    expect(prompt).toContain('En idioma español');
    expect(prompt).not.toContain('1000 caracteres');
    expect(prompt).not.toContain('para publicar en');
    expect(prompt).not.toContain('escolaridad');
    expect(prompt).not.toContain('correo');
  });

  it('concatenates §5.2 fields that have values and resolved labels', () => {
    const snapshot: JobDescriptionPromptSnapshot = {
      positionName: 'Ingeniero de software',
      jobPortalId: 10,
      publishedPortals: [{ jobPortalId: 11, externalPortalId: 'ext-1' }],
      recruiterEmail: 'recluta@empresa.test',
      experienceIn: 'fintech',
      minAge: 25,
      maxAge: 40,
      educationLevelId: 3,
      shiftId: 2,
      workdayStartTime: '09:00',
      workdayEndTime: '18:00',
      workplaceId: 4,
      contractTypeId: 5,
      city: 'Guadalajara',
      postalCode: '44100',
      tradeName: 'Acme Retail',
      languages: [{ languageId: 1, languageLevelId: 8 }],
      hideSalary: false,
      publishSalaryMin: 20000,
      publishSalaryMax: 28000,
      includeSoftSkills: true,
      extraBenefitsText: 'vales de despensa',
      includeProfessionalDevelopment: true,
      includeKeywords: true,
      clientExpansionDescription: 'expansión Bajío',
    };

    const prompt = buildJobDescriptionPrompt(snapshot, LABELS, 'en');

    expect(prompt).toContain('para publicar en OCC Mundial, Computrabajo');
    expect(prompt).toContain('recluta@empresa.test');
    expect(prompt).toContain('fintech');
    expect(prompt).toContain('rango de edad entre 25 - 40');
    expect(prompt).toContain('Licenciatura');
    expect(prompt).toContain('Matutino');
    expect(prompt).toContain('09:00 - 18:00');
    expect(prompt).toContain('Híbrido');
    expect(prompt).toContain('Indeterminado');
    expect(prompt).toContain('Guadalajara');
    expect(prompt).toContain('codigo postal 44100');
    expect(prompt).toContain('Acme Retail');
    expect(prompt).toContain('Inglés (Avanzado)');
    expect(prompt).toContain('20000 - 28000');
    expect(prompt).toContain('habilidades blandas');
    expect(prompt).toContain('vales de despensa');
    expect(prompt).toContain('desarrollo profesional');
    expect(prompt).toContain('hashtags');
    expect(prompt).toContain('expansión Bajío');
    expect(prompt).toContain('En idioma inglés');
  });

  it('omits salary when hideSalary is true even if min/max exist', () => {
    const prompt = buildJobDescriptionPrompt(
      {
        positionName: 'Cajero',
        hideSalary: true,
        publishSalaryMin: 8000,
        publishSalaryMax: 12000,
      },
      {},
      'es',
    );

    expect(prompt).not.toContain('8000');
    expect(prompt).not.toContain('12000');
    expect(prompt).not.toContain('sueldo');
  });

  it('never includes responsibility level even when the id is present', () => {
    const prompt = buildJobDescriptionPrompt(
      {
        positionName: 'Supervisor',
        responsibilityLevelId: 99,
      },
      { workplace: { 99: 'Alta' } },
      'es',
    );

    expect(prompt).not.toContain('responsabilidad');
    expect(prompt).not.toContain('Alta');
    expect(prompt).not.toContain('99');
  });

  it('omits catalog phrases when labels are missing (no raw ids)', () => {
    const prompt = buildJobDescriptionPrompt(
      {
        positionName: 'Becario',
        educationLevelId: 3,
        jobPortalId: 10,
        workplaceId: 4,
      },
      {},
      'es',
    );

    expect(prompt).not.toContain('para publicar en');
    expect(prompt).not.toContain('escolaridad');
    expect(prompt).not.toContain('lugar de trabajo');
    expect(prompt).not.toMatch(/\b3\b/);
    expect(prompt).not.toMatch(/\b10\b/);
  });

  it('skips empty strings, nulls and uses legalName when tradeName is empty', () => {
    const prompt = buildJobDescriptionPrompt(
      {
        positionName: 'Auxiliar',
        recruiterEmail: '  ',
        city: null,
        tradeName: '',
        legalName: 'Acme SA de CV',
        includeSoftSkills: false,
        includeExtraBenefits: true,
        extraBenefitsText: '',
      },
      {},
      'es',
    );

    expect(prompt).toContain('Acme SA de CV');
    expect(prompt).not.toContain('correo');
    expect(prompt).not.toContain('ubicación cercana');
    expect(prompt).toContain('desgloce de beneficios adicionales');
    expect(prompt).not.toContain('habilidades blandas');
  });

  it('does not mention age when only maxAge is set', () => {
    const prompt = buildJobDescriptionPrompt(
      { positionName: 'Operador', maxAge: 50 },
      {},
      'es',
    );
    expect(prompt).not.toContain('edad');
    expect(prompt).not.toContain('50');
  });
});
