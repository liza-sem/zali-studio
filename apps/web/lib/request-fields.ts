export type RequestPriority = 'low' | 'normal' | 'high' | 'urgent';

export type RequestDeadline = 'soon' | 'this_week' | 'next_week' | 'flexible';

export const PRIORITY_OPTIONS: { value: RequestPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const DEADLINE_OPTIONS: { value: RequestDeadline; label: string }[] = [
  { value: 'soon', label: 'Soon' },
  { value: 'this_week', label: 'This week' },
  { value: 'next_week', label: 'Next week' },
  { value: 'flexible', label: 'Flexible' },
];

export function normalizePriority(value: string | null | undefined): RequestPriority {
  const normalized = (value || 'normal').toLowerCase().trim() as RequestPriority;
  return PRIORITY_OPTIONS.some((o) => o.value === normalized) ? normalized : 'normal';
}

export function normalizeDeadline(value: string | null | undefined): RequestDeadline {
  const normalized = (value || 'flexible').toLowerCase().trim() as RequestDeadline;
  return DEADLINE_OPTIONS.some((o) => o.value === normalized) ? normalized : 'flexible';
}

export function priorityLabel(value: string | null | undefined) {
  return PRIORITY_OPTIONS.find((o) => o.value === normalizePriority(value))?.label ?? 'Normal';
}

export function deadlineLabel(value: string | null | undefined) {
  return DEADLINE_OPTIONS.find((o) => o.value === normalizeDeadline(value))?.label ?? 'Flexible';
}
