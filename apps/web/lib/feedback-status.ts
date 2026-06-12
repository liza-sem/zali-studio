export type FeedbackStatus = 'backlog' | 'scoped' | 'in progress' | 'review' | 'done' | 'cancelled';

export const STATUS_LABELS: Record<FeedbackStatus, string> = {
  backlog: 'Backlog',
  scoped: 'Scoped',
  'in progress': 'In Progress',
  review: 'Review',
  done: 'Done',
  cancelled: 'Cancelled',
};

export const ALL_STATUS_VALUES: FeedbackStatus[] = [
  'backlog',
  'scoped',
  'in progress',
  'review',
  'done',
  'cancelled',
];

/** Statuses shown on the client-facing timeline. */
export const PUBLIC_ROADMAP_STATUSES: FeedbackStatus[] = ['scoped', 'in progress', 'review', 'done'];

const LEGACY_STATUS_MAP: Record<string, FeedbackStatus> = {
  planned: 'scoped',
  completed: 'done',
  rejected: 'cancelled',
};

export function normalizeStatus(status: string | null | undefined): FeedbackStatus {
  const normalized = (status || 'backlog').toLowerCase().trim();
  if (ALL_STATUS_VALUES.includes(normalized as FeedbackStatus)) {
    return normalized as FeedbackStatus;
  }
  return LEGACY_STATUS_MAP[normalized] ?? 'backlog';
}

export function groupFeedbackByStatus<T extends { status?: string | null }>(
  items: T[],
  columns: FeedbackStatus[]
): Record<FeedbackStatus, T[]> {
  const grouped = Object.fromEntries(columns.map((column) => [column, [] as T[]])) as Record<
    FeedbackStatus,
    T[]
  >;

  for (const item of items) {
    const status = normalizeStatus(item.status);
    if (grouped[status]) {
      grouped[status].push(item);
    }
  }

  return grouped;
}
