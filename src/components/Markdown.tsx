import { useMemo } from 'react';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

/**
 * Renders our own authored Markdown. Content is first-party (checked into the
 * repo), so no sanitizer is needed. Do not feed user input through this.
 */
export function Markdown({ source, className = '' }: { source: string; className?: string }) {
  const html = useMemo(() => marked.parse(source) as string, [source]);
  return <div className={`prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
