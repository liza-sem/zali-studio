'use client';

import { ExternalLink, Link2 } from 'lucide-react';
import { cn } from '@ui/lib/utils';

export default function PinnedLinkCard({
  url,
  label,
  className,
  compact = false,
}: {
  url: string;
  label?: string | null;
  className?: string;
  compact?: boolean;
}) {
  const displayLabel = label?.trim() || url.replace(/^https?:\/\//, '').split('/')[0] || 'Link';

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        'bg-secondary/40 hover:bg-secondary/60 border-border/60 group flex items-center gap-2 rounded-md border transition-colors',
        compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm',
        className
      )}>
      <Link2 className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
      <span className='min-w-0 flex-1 truncate font-medium'>{displayLabel}</span>
      <ExternalLink className='text-muted-foreground h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100' />
    </a>
  );
}
