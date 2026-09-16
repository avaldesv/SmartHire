/** Greedy sequential packer for CV bulk upload chunks (RF-007 L8). */

export const CV_BULK_MAX_FILE_BYTES = 10 * 1024 * 1024;
/** Practical margin under servlet max-request-size 100MB (multipart overhead). */
export const CV_BULK_CHUNK_BUDGET_BYTES = 95 * 1024 * 1024;
export const CV_BULK_MAX_FILES = 100;
export const CV_BULK_ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'jpg', 'jpeg']);

export interface PackResult {
  valid: File[];
  invalid: { file: File; reason: string }[];
  chunks: File[][];
}

export function fileExtension(fileName: string): string {
  const i = fileName.lastIndexOf('.');
  return i >= 0 ? fileName.slice(i + 1).toLowerCase() : '';
}

export function packCvBulkFiles(files: File[]): PackResult {
  const invalid: { file: File; reason: string }[] = [];
  const valid: File[] = [];

  for (const file of files) {
    const ext = fileExtension(file.name);
    if (!CV_BULK_ALLOWED_EXTENSIONS.has(ext)) {
      invalid.push({ file, reason: 'UNSUPPORTED_FORMAT' });
      continue;
    }
    if (file.size > CV_BULK_MAX_FILE_BYTES) {
      invalid.push({ file, reason: 'FILE_TOO_LARGE' });
      continue;
    }
    valid.push(file);
  }

  const limited = valid.slice(0, CV_BULK_MAX_FILES);
  if (valid.length > CV_BULK_MAX_FILES) {
    for (const file of valid.slice(CV_BULK_MAX_FILES)) {
      invalid.push({ file, reason: 'MAX_FILES_EXCEEDED' });
    }
  }

  const chunks: File[][] = [];
  let current: File[] = [];
  let sum = 0;
  for (const file of limited) {
    if (current.length > 0 && sum + file.size > CV_BULK_CHUNK_BUDGET_BYTES) {
      chunks.push(current);
      current = [];
      sum = 0;
    }
    current.push(file);
    sum += file.size;
  }
  if (current.length > 0) {
    chunks.push(current);
  }

  return { valid: limited, invalid, chunks };
}
