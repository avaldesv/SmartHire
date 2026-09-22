/**
 * Turns Appian-style chat delimiters into readable plain text.
 * Does not rewrite, summarize, or drop content.
 *
 * `|*||*|` → section break; remaining `|*|` → line break.
 */

const SECTION_BREAK = '|*||*|';
const LINE_BREAK = '|*|';

export function sanitizeJobDescriptionChatMessage(raw: string): string {
  if (!raw) {
    return '';
  }

  let text = raw.replace(/\r\n/g, '\n');
  text = text.split(SECTION_BREAK).join('\n\n');
  text = text.split(LINE_BREAK).join('\n');
  text = text.replace(/[ \t]+\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = insertBlankLineBeforeBulletLists(text);
  return text.trim();
}

function insertBlankLineBeforeBulletLists(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    const current = lines[i].trim();
    const next = lines[i + 1]?.trim() ?? '';
    if (current && !current.startsWith('-') && next.startsWith('-')) {
      out.push('');
    }
  }
  return out.join('\n');
}
