/**
 * Turns Appian-style chat delimiters into readable plain text.
 * Does not rewrite, summarize, or drop content.
 *
 * `|*||*|` → section break; remaining `|*|` → line break.
 * A heading immediately followed by `-` bullets stays one list (no extra blank line).
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
  text = collapseBlankLinesBeforeBullets(text);
  return text.trim();
}

function collapseBlankLinesBeforeBullets(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    const current = lines[i].trim();
    if (!current || current.startsWith('-')) {
      continue;
    }
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') {
      j++;
    }
    if (j < lines.length && lines[j].trim().startsWith('-') && j > i + 1) {
      i = j - 1;
    }
  }
  return out.join('\n');
}
