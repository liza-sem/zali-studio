import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Separator } from '@ui/components/ui/separator';
import { getProjectBySlug } from '@/lib/api/projects';
import { getPublicProjectFeedback } from '@/lib/api/public';
import { PUBLIC_ROADMAP_STATUSES, normalizeStatus } from '@/lib/feedback-status';
import AnalyticsWrapper from '@/components/hub/analytics-wrapper';
import RoadmapBoard from '@/components/shared/roadmap/roadmap-board';

type Props = {
  params: { project: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: project, error } = await getProjectBySlug(params.project, 'server', true, false);

  if (error?.status === 404 || !project) {
    notFound();
  }

  return {
    title: `Roadmap - ${project.name}`,
    description: 'See what we are planning, building, and shipping next.',
  };
}

export default async function RoadmapPage({ params }: Props) {
  const { data: feedback, error } = await getPublicProjectFeedback(params.project, 'server', true, false);

  if (error) {
    return <div>{error.message}</div>;
  }

  const roadmapFeedback = feedback.filter((item) =>
    PUBLIC_ROADMAP_STATUSES.includes(normalizeStatus(item.status))
  );

  return (
    <AnalyticsWrapper className='items-center gap-10 pb-10' projectSlug={params.project}>
      <div className='flex w-full px-5 sm:px-10 md:px-10 lg:px-20'>
        <div className='flex w-full flex-col items-start gap-4'>
          <h1 className='text-3xl font-medium sm:text-4xl'>Roadmap</h1>
          <p className='text-foreground/70 text-base font-extralight sm:text-lg'>
            See what we are planning, building, and shipping next.
          </p>
        </div>
      </div>

      <Separator className='bg-border/60' />

      <div className='flex h-full w-full flex-col items-center justify-center gap-5 px-5 sm:px-10 md:px-10 lg:px-20'>
        {roadmapFeedback.length === 0 ? (
          <p className='text-foreground/60 py-16 text-center text-sm font-light'>
            Nothing on the roadmap yet. Check back soon.
          </p>
        ) : (
          <RoadmapBoard
            feedback={roadmapFeedback}
            projectSlug={params.project}
            columnStatuses={PUBLIC_ROADMAP_STATUSES}
            emptyMessage='Nothing here yet.'
          />
        )}
      </div>
    </AnalyticsWrapper>
  );
}
