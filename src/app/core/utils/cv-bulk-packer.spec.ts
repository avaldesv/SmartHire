import {
  CV_BULK_CHUNK_BUDGET_BYTES,
  CV_BULK_MAX_FILE_BYTES,
  packCvBulkFiles,
} from './cv-bulk-packer';

function fakeFile(name: string, size: number): File {
  const blob = new Blob([new Uint8Array(size)]);
  return new File([blob], name, { type: 'application/octet-stream' });
}

describe('packCvBulkFiles', () => {
  it('rejects unsupported extension and oversized files', () => {
    const result = packCvBulkFiles([
      fakeFile('a.pdf', 100),
      fakeFile('b.exe', 100),
      fakeFile('c.pdf', CV_BULK_MAX_FILE_BYTES + 1),
    ]);
    expect(result.valid.length).toBe(1);
    expect(result.invalid.length).toBe(2);
  });

  it('packs greedy sequential under budget', () => {
    const eightMb = 8 * 1024 * 1024;
    const oneMb = 1024 * 1024;
    const files = [
      ...Array.from({ length: 8 }, (_, i) => fakeFile(`b${i}.pdf`, eightMb)),
      ...Array.from({ length: 40 }, (_, i) => fakeFile(`s${i}.pdf`, oneMb)),
    ];
    const result = packCvBulkFiles(files);
    expect(result.chunks.length).toBe(2);
    const sum0 = result.chunks[0].reduce((a, f) => a + f.size, 0);
    expect(sum0).toBeLessThanOrEqual(CV_BULK_CHUNK_BUDGET_BYTES);
  });
});
