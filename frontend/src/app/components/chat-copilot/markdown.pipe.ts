import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Converts a markdown string to sanitised HTML.
 *
 * Tables are automatically wrapped in a horizontally-scrollable container
 * with an expand button so they can be viewed in a full-screen modal.
 *
 * Usage: `<div [innerHTML]="text | markdown"></div>`
 */
@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {
    // Configure marked for synchronous parsing with sensible defaults
    marked.setOptions({ async: false, gfm: true, breaks: true });
  }

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';

    // Parse markdown → HTML
    let html = marked.parse(value) as string;

    // Sanitize to prevent XSS
    html = DOMPurify.sanitize(html, {
      ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'],
      ADD_ATTR: ['class'],
    });

    // Wrap every <table> in a scroll container with an expand button
    html = html.replace(
      /<table>/g,
      `<div class="copilot-table-wrap"><div class="copilot-table-scroll"><table>`,
    );
    html = html.replace(
      /<\/table>/g,
      `</table></div><button type="button" class="copilot-table-expand-btn" aria-label="Expand table">` +
        `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
        `<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>` +
        `</svg> Expand</button></div>`,
    );

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
