import { Card, CardDescription, CardHeader, CardTitle } from 'ui/components/ui/card';
import { getAllFeedbackTags, getAllProjectFeedback } from '@/lib/api/feedback';
import { PRODUCT } from '@/lib/product-copy';
import { TIMELINE_STATUS_OPTIONS } from '@/lib/feedback-status-icons';
import RoadmapBoard from '@/components/shared/roadmap/roadmap-board';

export default async function RoadmapPage({ params }: { params: { slug: string } }) {
  const { data: feedback, error } = await getAllProjectFeedback(params.slug, 'server');
  if (error) {
    return <div>{error.message}</div>;
  }

  const { data: tags, error: tagsError } = await getAllFeedbackTags(params.slug, 'server');
  if (tagsError) {
    return <div>{tagsError.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-medium'>{PRODUCT.timeline.singular}</h1>
        <p className='text-foreground/70 text-sm font-light'>
          Drag requests across stages. Moving to Done opens a brand update draft.
        </p>
      </div>

      {feedback.length === 0 ? (
        <Card className='flex w-full flex-col items-center justify-center p-10 sm:p-20'>
          <CardHeader className='items-center text-center'>
            <CardTitle className='text-2xl font-medium'>{PRODUCT.requests.empty}</CardTitle>
            <CardDescription className='font-light'>
              Timeline items come from client requests. Share the hub so they can submit work.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <RoadmapBoard
          feedback={feedback}
          projectSlug={params.slug}
          tags={tags}
          columns={TIMELINE_STATUS_OPTIONS}
          editable
        />
      )}
    </div>
  );
}
