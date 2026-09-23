import {
  buildJobRequirementsPrompt,
  buildJobRequirementsTranslatePrompt,
  formatJobRequirementsTriple,
  formatRequirementsBlock,
  parseJobRequirementsJson,
  splitTranslatedRequirements,
  type JobRequirementsTriple,
} from './build-job-requirements-prompt';

const VALID_JSON = {
  type_document: 'json',
  'nombre de la vacante': 'Analista de datos',
  tipo_de_requisitos: {
    obligatorios: {
      requisito1: 'Licenciatura en sistemas',
      requisito2: 'Tres años de experiencia',
      requisito3: 'SQL avanzado',
    },
    opcionales: {
      requisito1: 'Inglés intermedio',
      requisito2: 'Power BI',
      requisito3: 'Certificación cloud',
    },
    deseables: {
      requisito1: 'Disponibilidad de viajar',
      requisito2: 'Liderazgo de equipo',
      requisito3: 'Conocimiento de Python',
    },
  },
};

describe('buildJobRequirementsPrompt', () => {
  it('returns empty string when positionName is missing', () => {
    expect(buildJobRequirementsPrompt({}, 'es')).toBe('');
    expect(buildJobRequirementsPrompt({ positionName: '   ' }, 'es')).toBe('');
  });

  it('includes positionName, JSON schema and language; omits jobDescription when empty', () => {
    const prompt = buildJobRequirementsPrompt({ positionName: 'Analista de datos' }, 'es');

    expect(prompt).toContain('Analista de datos');
    expect(prompt).toContain('especialista experto en reclutamiento');
    expect(prompt).toContain('tipo_de_requisitos');
    expect(prompt).toContain('"obligatorios"');
    expect(prompt).toContain('"opcionales"');
    expect(prompt).toContain('"deseables"');
    expect(prompt).toContain('"requisito1"');
    expect(prompt).toContain('"requisito2"');
    expect(prompt).toContain('"requisito3"');
    expect(prompt).toContain('UTF-8');
    expect(prompt).toContain('En idioma español');
    expect(prompt).not.toContain('500 caracteres');
    expect(prompt).not.toContain('Complementa con la siguiente descripción');
  });

  it('includes wizard facts and does not send the job description textarea', () => {
    const prompt = buildJobRequirementsPrompt(
      {
        positionName: 'Ingeniero de software',
        jobDescription: 'Desarrollar APIs en Java y atender al negocio.',
        snapshot: { city: 'Guadalajara', tradeName: 'Systek' },
        labels: {},
      },
      'en',
    );

    expect(prompt).toContain('Ingeniero de software');
    expect(prompt).toContain('Guadalajara');
    expect(prompt).toContain('Systek');
    expect(prompt).not.toContain('Desarrollar APIs en Java');
    expect(prompt).not.toContain('Complementa con la siguiente descripción del puesto');
    expect(prompt).toContain('En idioma inglés');
  });
});

describe('parseJobRequirementsJson', () => {
  it('parses wrapped JSON into nine texts', () => {
    const parsed = parseJobRequirementsJson(JSON.stringify(VALID_JSON));
    expect(parsed).toEqual({
      mandatory: ['Licenciatura en sistemas', 'Tres años de experiencia', 'SQL avanzado'],
      optional: ['Inglés intermedio', 'Power BI', 'Certificación cloud'],
      desirable: ['Disponibilidad de viajar', 'Liderazgo de equipo', 'Conocimiento de Python'],
    } satisfies JobRequirementsTriple);
  });

  it('parses JSON with markdown fences and top-level blocks', () => {
    const topLevel = {
      obligatorios: VALID_JSON.tipo_de_requisitos.obligatorios,
      opcionales: VALID_JSON.tipo_de_requisitos.opcionales,
      deseables: VALID_JSON.tipo_de_requisitos.deseables,
    };
    const fenced = '```json\n' + JSON.stringify(topLevel) + '\n```';
    const parsed = parseJobRequirementsJson(fenced);
    expect(parsed?.mandatory[0]).toBe('Licenciatura en sistemas');
    expect(parsed?.desirable[2]).toBe('Conocimiento de Python');
  });

  it('parses chat JSON that uses |*| instead of newlines', () => {
    const piped =
      '{|*|  "type_document": "json",|*|  "nombre de la vacante": "Requisición de Prueba Luis",|*|  "tipo_de_requisitos": {|*|    "obligatorios": {|*|      "requisito1": "Experiencia comprobable en Java.",|*|      "requisito2": "Dominio de Spring Boot.",|*|      "requisito3": "Dominio del idioma alemán."|*|    },|*|    "opcionales": {|*|      "requisito1": "Git y CI/CD.",|*|      "requisito2": "Bases de datos relacionales.",|*|      "requisito3": "Pruebas automatizadas."|*|    },|*|    "deseables": {|*|      "requisito1": "Consultoría similar a Systek.",|*|      "requisito2": "Arquitectura y microservicios.",|*|      "requisito3": "Docker y Kubernetes."|*|    }|*|  }|*|}';
    const parsed = parseJobRequirementsJson(piped);
    expect(parsed).not.toBeNull();
    expect(parsed?.mandatory).toEqual([
      'Experiencia comprobable en Java.',
      'Dominio de Spring Boot.',
      'Dominio del idioma alemán.',
    ]);
    expect(parsed?.optional[1]).toBe('Bases de datos relacionales.');
    expect(parsed?.desirable[2]).toBe('Docker y Kubernetes.');
  });

  it('returns null for invalid, incomplete or empty requirements', () => {
    expect(parseJobRequirementsJson('not json')).toBeNull();
    expect(parseJobRequirementsJson('{"obligatorios":{}}')).toBeNull();

    const missing = JSON.parse(JSON.stringify(VALID_JSON)) as typeof VALID_JSON;
    missing.tipo_de_requisitos.opcionales.requisito2 = '  ';
    expect(parseJobRequirementsJson(JSON.stringify(missing))).toBeNull();
  });
});

describe('formatRequirementsBlock', () => {
  it('joins three items as dash-prefixed lines', () => {
    expect(formatRequirementsBlock(['Uno', 'Dos', 'Tres'])).toBe('- Uno\n- Dos\n- Tres');
  });

  it('formats a full triple for the three textareas', () => {
    const formatted = formatJobRequirementsTriple({
      mandatory: ['A1', 'A2', 'A3'],
      optional: ['B1', 'B2', 'B3'],
      desirable: ['C1', 'C2', 'C3'],
    });
    expect(formatted.mandatory).toBe('- A1\n- A2\n- A3');
    expect(formatted.optional).toBe('- B1\n- B2\n- B3');
    expect(formatted.desirable).toBe('- C1\n- C2\n- C3');
  });
});

describe('job-requirements translate labels', () => {
  it('builds a labeled prompt and splits a matching response', () => {
    const prompt = buildJobRequirementsTranslatePrompt(
      {
        mandatory: '- Licenciatura\n- SQL',
        optional: '',
        desirable: '- Python',
      },
      'en',
    );

    expect(prompt).toContain('OBLIGATORIOS:');
    expect(prompt).toContain('OPCIONALES:');
    expect(prompt).toContain('DESEABLES:');
    expect(prompt).toContain('- Licenciatura');
    expect(prompt).toContain('- Python');
    expect(prompt).toContain('Traducir el texto anterior al idioma: inglés');
    expect(prompt).toContain('Conservar las etiquetas');

    const translated = `OBLIGATORIOS:
- Bachelor degree
- SQL

OPCIONALES:

DESEABLES:
- Python knowledge`;
    expect(splitTranslatedRequirements(translated)).toEqual({
      mandatory: '- Bachelor degree\n- SQL',
      optional: '',
      desirable: '- Python knowledge',
    });
  });

  it('returns null when a header is missing', () => {
    expect(splitTranslatedRequirements('OBLIGATORIOS:\nfoo\nOPCIONALES:\nbar')).toBeNull();
    expect(splitTranslatedRequirements('')).toBeNull();
  });

  it('splits a labeled response that uses |*| delimiters', () => {
    const piped =
      'OBLIGATORIOS:|*|- Bachelor degree|*|- SQL|*||*|OPCIONALES:|*||*|DESEABLES:|*|- Python knowledge';
    expect(splitTranslatedRequirements(piped)).toEqual({
      mandatory: '- Bachelor degree\n- SQL',
      optional: '',
      desirable: '- Python knowledge',
    });
  });
});
