'use client';

import { AddChangelogModal } from '@/components/dashboard/modals/add-edit-changelog-modal';
import { PRODUCT } from '@/lib/product-copy';
import type { FeedbackWithUserProps } from '@/lib/types';

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function PublishBrandUpdateModal({
  projectSlug,
  request,
  open,
  onOpenChange,
}: {
  projectSlug: string;
  request: FeedbackWithUserProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const summary = stripHtml(request.description || '').slice(0, 240);
  const pinnedNote = request.pinned_url
    ? `<p><a href="${request.pinned_url}">${request.pinned_label || 'Reference link'}</a></p>`
    : '';

  return (
    <AddChangelogModal
      projectSlug={projectSlug}
      sourceFeedbackId={request.id}
      forceOpen={open}
      onForceOpenChange={onOpenChange}
      changelogData={{
        id: '',
        project_id: request.project_id,
        title: request.title,
        summary: summary || request.title,
        content: `${pinnedNote}${request.description || ''}`,
        image: null,
        publish_date: new Date().toISOString(),
        published: false,
        slug: 'draft',
        author_id: '',
      }}
      trigger={
        <span className='sr-only'>Publish {PRODUCT.brandUpdates.singular}</span>
      }
    />
  );
}
