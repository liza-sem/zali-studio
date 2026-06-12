/** User-facing product language for Zali Studio (client/agency hub). */
export const PRODUCT = {
  name: 'Zali Studio',
  tagline: 'Requests, timeline, and brand updates for client work.',
  requests: {
    singular: 'Request',
    plural: 'Requests',
    hubPath: '/feedback',
    dashSlug: 'feedback',
    submit: 'Submit request',
    create: 'New request',
    empty: 'No requests yet.',
  },
  timeline: {
    singular: 'Timeline',
    plural: 'Timeline',
    hubPath: '/roadmap',
    dashSlug: 'roadmap',
    empty: 'Nothing on the timeline yet.',
  },
  brandUpdates: {
    singular: 'Brand update',
    plural: 'Brand updates',
    hubPath: '/changelog',
    dashSlug: 'changelog',
    create: 'New brand update',
    empty: 'No brand updates yet.',
  },
} as const;
