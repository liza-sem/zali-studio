'use client';

import { cn } from '@ui/lib/utils';
import { normalizeStatus } from '@/lib/feedback-status';
import { ALL_STATUS_OPTIONS } from '@/lib/feedback-status-icons';

export default function FeedbackStatusBadge({
  status,
  className,
}: {
  status?: string | null;
  className?: string;
}) {
  const normalized = normalizeStatus(status);
  const option = ALL_STATUS_OPTIONS.find((item) => item.value === normalized);

  if (!option) return null;

  const Icon = option.icon;

  return (
    <span
      className={cn(
        'text-foreground/60 inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-light',
        className
      )}>
      <Icon className='h-3.5 w-3.5' />
      {option.label}
    </span>
  );
}
