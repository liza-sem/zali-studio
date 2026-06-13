const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000';

export const DASH_DOMAIN = root.includes('localhost')
  ? 'http://dash.localhost:3000'
  : `https://dash.${root}`;

export const PROSE_CN =
  'prose prose-invert prose-p:font-extralight prose-zinc text-foreground/70 font-light prose-headings:font-medium prose-headings:text-foreground/80 prose-strong:text-foreground/80 prose-strong:font-normal prose-code:text-foreground/70 prose-code:font-light prose-code:font-monospace prose-blockquote:text-foreground/80 prose-blockquote:font-normal';
