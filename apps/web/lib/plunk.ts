const PLUNK_API_URL = process.env.PLUNK_API_URL || 'https://api.useplunk.com/v1';

function getPlunkSecretKey() {
  return process.env.PLUNK_SECRET_KEY || null;
}

export function isPlunkConfigured() {
  return Boolean(getPlunkSecretKey());
}

async function plunkRequest<T>(path: string, body: Record<string, unknown>): Promise<T | null> {
  const apiKey = getPlunkSecretKey();

  if (!apiKey) {
    return null;
  }

  const response = await fetch(`${PLUNK_API_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Plunk request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function syncPlunkSubscriber({
  email,
  projectSlug,
  subscribed,
}: {
  email: string;
  projectSlug: string;
  subscribed: boolean;
}) {
  if (!isPlunkConfigured()) {
    return null;
  }

  return plunkRequest('/track', {
    event: subscribed ? 'changelog_subscribed' : 'changelog_unsubscribed',
    email,
    subscribed,
    data: {
      project: projectSlug,
    },
  });
}

export async function sendPlunkEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  if (!isPlunkConfigured()) {
    return null;
  }

  const from = process.env.PLUNK_FROM_EMAIL;

  if (!from) {
    throw new Error('PLUNK_FROM_EMAIL is required when PLUNK_SECRET_KEY is set.');
  }

  return plunkRequest('/send', {
    to,
    subject,
    body,
    type: 'html',
    from,
  });
}
