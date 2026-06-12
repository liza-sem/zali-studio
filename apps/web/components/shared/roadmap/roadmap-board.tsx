'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { cn } from '@ui/lib/utils';
import { ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/ui/card';
import { groupFeedbackByStatus, normalizeStatus, type FeedbackStatus } from '@/lib/feedback-status';
import { ALL_STATUS_OPTIONS, type StatusOption } from '@/lib/feedback-status-icons';
import { FeedbackTagProps, FeedbackWithUserProps } from '@/lib/types';
import FeedbackModal from '@/components/dashboard/modals/view-feedback-modal';
import PublishBrandUpdateModal from '@/components/dashboard/modals/publish-brand-update-modal';
import PinnedLinkCard from '@/components/shared/pinned-link-card';
import RequestMetaBadges from '@/components/shared/request-meta-badges';

export default function RoadmapBoard({
  feedback,
  projectSlug,
  columns,
  columnStatuses,
  editable = false,
  tags = [],
  emptyMessage = 'No items in this column yet.',
}: {
  feedback: FeedbackWithUserProps[];
  projectSlug: string;
  columns?: StatusOption[];
  columnStatuses?: FeedbackStatus[];
  editable?: boolean;
  tags?: FeedbackTagProps['Row'][];
  emptyMessage?: string;
}) {
  const resolvedColumns =
    columns ??
    (columnStatuses
      ? ALL_STATUS_OPTIONS.filter((option) => columnStatuses.includes(option.value))
      : ALL_STATUS_OPTIONS);
  const [feedbackList, setFeedbackList] = useState(feedback);

  useEffect(() => {
    setFeedbackList(feedback);
  }, [feedback]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<FeedbackStatus | null>(null);
  const [brandUpdateRequest, setBrandUpdateRequest] = useState<FeedbackWithUserProps | null>(null);

  const grouped = useMemo(
    () => groupFeedbackByStatus(feedbackList, resolvedColumns.map((column) => column.value)),
    [feedbackList, resolvedColumns]
  );

  async function updateStatus(feedbackId: string, status: FeedbackStatus) {
    const index = feedbackList.findIndex((item) => item.id === feedbackId);
    if (index === -1) return;

    const previousStatus = feedbackList[index].status;
    const nextList = [...feedbackList];
    nextList[index] = { ...nextList[index], status };
    setFeedbackList(nextList);

    try {
      const response = await fetch(`/api/v1/projects/${projectSlug}/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (editable && status === 'done') {
        const item = feedbackList.find((f) => f.id === feedbackId);
        if (item) setBrandUpdateRequest({ ...item, status });
      }
    } catch (error) {
      const rollback = [...feedbackList];
      rollback[index] = { ...rollback[index], status: previousStatus };
      setFeedbackList(rollback);
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  }

  function handleDrop(column: FeedbackStatus) {
    if (!editable || !draggingId) return;
    const draggedItem = feedbackList.find((item) => item.id === draggingId);
    if (!draggedItem || normalizeStatus(draggedItem.status) === column) return;
    void updateStatus(draggingId, column);
    setDraggingId(null);
    setActiveDropColumn(null);
  }

  return (
    <>
    {brandUpdateRequest ? (
      <PublishBrandUpdateModal
        projectSlug={projectSlug}
        request={brandUpdateRequest}
        open={Boolean(brandUpdateRequest)}
        onOpenChange={(open) => {
          if (!open) setBrandUpdateRequest(null);
        }}
      />
    ) : null}
    <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {resolvedColumns.map((column) => {
        const items = grouped[column.value] ?? [];
        const Icon = column.icon;

        return (
          <div
            key={column.value}
            className={cn(
              'flex min-h-[320px] flex-col rounded-lg border bg-secondary/20',
              editable && activeDropColumn === column.value && 'ring-ring ring-2'
            )}
            onDragOver={(event) => {
              if (!editable) return;
              event.preventDefault();
              setActiveDropColumn(column.value);
            }}
            onDragLeave={() => {
              if (activeDropColumn === column.value) {
                setActiveDropColumn(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              handleDrop(column.value);
            }}>
            <div className='flex items-center gap-2 border-b px-4 py-3'>
              <Icon className='text-foreground/60 h-4 w-4' />
              <h3 className='text-sm font-medium'>{column.label}</h3>
              <span className='text-foreground/50 ml-auto text-xs'>{items.length}</span>
            </div>

            <div className='flex flex-1 flex-col gap-2 p-3'>
              {items.length === 0 ? (
                <p className='text-foreground/50 px-1 py-6 text-center text-xs font-light'>{emptyMessage}</p>
              ) : (
                items.map((item) => {
                  const card = (
                    <Card
                      key={item.id}
                      draggable={editable}
                      onDragStart={() => {
                        if (editable) setDraggingId(item.id);
                      }}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setActiveDropColumn(null);
                      }}
                      className={cn(
                        'border-border/60 bg-background/80 transition-opacity',
                        editable && 'cursor-grab active:cursor-grabbing',
                        draggingId === item.id && 'opacity-50'
                      )}>
                      <CardHeader className='space-y-2 p-4 pb-2'>
                        {item.pinned_url ? (
                          <PinnedLinkCard url={item.pinned_url} label={item.pinned_label} compact />
                        ) : null}
                        <CardTitle className='text-sm font-medium leading-snug'>{item.title}</CardTitle>
                        <RequestMetaBadges priority={item.priority} deadline={item.deadline_bucket} />
                      </CardHeader>
                      <CardContent className='flex items-center justify-between px-4 pb-4 pt-0'>
                        <span className='text-foreground/50 text-xs font-light'>
                          {item.user?.full_name || 'Anonymous'}
                        </span>
                        <div className='text-foreground/60 flex items-center gap-1 text-xs'>
                          <ChevronUp className='h-3.5 w-3.5' />
                          {item.upvotes}
                        </div>
                      </CardContent>
                    </Card>
                  );

                  if (editable) {
                    return (
                      <FeedbackModal
                        key={item.id}
                        tags={tags}
                        feedback={item}
                        feedbackList={feedbackList}
                        setFeedbackList={setFeedbackList}>
                        {card}
                      </FeedbackModal>
                    );
                  }

                  return (
                    <Link key={item.id} href={`/feedback/${item.id}`} className='block'>
                      {card}
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
}
