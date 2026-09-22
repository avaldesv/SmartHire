import { sanitizeJobDescriptionChatMessage } from './sanitize-job-description-chat';

const SAMPLE =
  '¿Eres una persona apasionada por el desarrollo en Java, con ganas de crecer en un ambiente colaborativo, retador y centrado en las personas? Te invitamos a formar parte de un proyecto en colaboración con nuestro cliente Systek, donde tu talento será valorado, tu voz escuchada y tus ideas impulsadas.|*||*|Lo que harás|*|- Participar activamente en el diseño, desarrollo y mejora de aplicaciones y servicios basados en Java dentro de proyectos de industria tecnológica.|*|- Colaborar con equipos multidisciplinarios (QA, DevOps, Product) para entregar soluciones de alto impacto y calidad.|*|- Revisar código, proponer mejoras, optimizar rendimiento y asegurar buenas prácticas de arquitectura y seguridad.|*|- Contribuir al ciclo completo de desarrollo: análisis, implementación, pruebas y despliegue.|*|- Documentar soluciones y compartir conocimiento con el equipo.|*||*|Perfil que buscamos|*|- Experiencia comprobable en la industria/sector Java (desarrollo de aplicaciones empresariales, microservicios, APIs, etc.).|*|- Dominio de Java y ecosistema (Spring, Hibernate, JUnit, Maven/Gradle, entre otros).|*|- Conocimiento en patrones de diseño, buenas prácticas de codificación y control de versiones (Git).|*|- Nivel de idioma: Alemán (a) — dominio imprescindible para comunicación con cliente y equipo.|*|- Rango de edad: 18 - 100 años.|*|- Actitud proactiva, orientado a resultados, habilidades de comunicación y trabajo en equipo.|*|- Deseable experiencia con metodologías ágiles (Scrum/Kanban) y conocimientos en contenedores/CI-CD.|*||*|Horario|*|- Jornada con horario fijo: 10:25 - 07:29.|*||*|Qué ofrecemos|*|- Integrarte a un proyecto estratégico con Systek, reconocido por su enfoque innovador y profesional.|*|- Ambiente humano, respetuoso y de aprendizaje continuo.|*|- Oportunidades de crecimiento profesional y capacitación.|*|- Remuneración competitiva de acuerdo a experiencia y prestaciones conforme a la ley.|*||*|Cómo postular|*|Si te identificas con este perfil y quieres ser parte de un equipo que valora el talento y la colaboración, ¡queremos conocerte! Envía tu CV actualizado y una breve carta donde nos cuentes por qué te entusiasma esta oportunidad.|*||*|Ven con tus ganas de aprender y transformar ideas en soluciones reales. Te esperamos.';

describe('sanitizeJobDescriptionChatMessage', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeJobDescriptionChatMessage('')).toBe('');
  });

  it('leaves text without delimiters unchanged except trim', () => {
    expect(sanitizeJobDescriptionChatMessage('  Hola mundo.  ')).toBe('Hola mundo.');
  });

  it('turns |*||*| into section breaks and |*| into line breaks without dropping facts', () => {
    const text = sanitizeJobDescriptionChatMessage(SAMPLE);

    expect(text).not.toContain('|*|');
    expect(text).toContain('Systek');
    expect(text).toContain('Alemán (a)');
    expect(text).toContain('18 - 100');
    expect(text).toContain('10:25 - 07:29');
    expect(text).toContain('Lo que harás');
    expect(text).toContain('- Participar activamente');
    expect(text).toContain('Cómo postular');
    expect(text).toContain('Te esperamos.');

    expect(text).toContain('Lo que harás\n\n- Participar');
    expect(text).toMatch(/impulsadas\.\n\nLo que harás/);
    expect(text).toMatch(/equipo\.\n\nPerfil que buscamos/);
  });
});
