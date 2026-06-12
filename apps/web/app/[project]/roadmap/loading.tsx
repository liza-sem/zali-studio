import { Skeleton } from '@ui/components/ui/skeleton';

export default function RoadmapLoading() {
  return (
    <div className='flex w-full flex-col gap-6 px-5 sm:px-10 md:px-10 lg:px-20'>
      <Skeleton className='h-10 w-48' />
      <Skeleton className='h-5 w-96' />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {['planned', 'progress', 'completed'].map((id) => (
          <Skeleton key={id} className='h-80 w-full' />
        ))}
      </div>
    </div>
  );
}
