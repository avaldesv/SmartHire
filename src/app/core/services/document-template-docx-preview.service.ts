import { Injectable } from '@angular/core';
import { renderAsync } from 'docx-preview';

@Injectable({ providedIn: 'root' })
export class DocumentTemplateDocxPreviewService {
  async render(arrayBuffer: ArrayBuffer, container: HTMLElement): Promise<void> {
    container.replaceChildren();
    await renderAsync(arrayBuffer, container, container, {
      className: 'docx-preview',
      inWrapper: true,
      hideWrapperOnPrint: false,
      ignoreWidth: true,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      debug: false,
      experimental: false,
      trimXmlDeclaration: true,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
      ignoreLastRenderedPageBreak: true,
      useBase64URL: true,
      renderChanges: false,
      renderComments: false,
      renderAltChunks: true,
    });
  }
}
