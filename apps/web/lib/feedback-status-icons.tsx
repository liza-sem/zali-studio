'use client';

import {
  CheckCircle2,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  Eye,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { FeedbackStatus } from '@/lib/feedback-status';

export interface StatusOption {
  label: string;
  value: FeedbackStatus;
  icon: LucideIcon;
}

export const ALL_STATUS_OPTIONS: StatusOption[] = [
  { label: 'Backlog', value: 'backlog', icon: CircleDashed },
  { label: 'Scoped', value: 'scoped', icon: CircleDotDashed },
  { label: 'In Progress', value: 'in progress', icon: CircleDot },
  { label: 'Review', value: 'review', icon: Eye },
  { label: 'Done', value: 'done', icon: CheckCircle2 },
  { label: 'Cancelled', value: 'cancelled', icon: XCircle },
];

/** Timeline board columns (excludes backlog/cancelled). */
export const TIMELINE_STATUS_OPTIONS = ALL_STATUS_OPTIONS.filter((o) =>
  ['scoped', 'in progress', 'review', 'done'].includes(o.value)
);
