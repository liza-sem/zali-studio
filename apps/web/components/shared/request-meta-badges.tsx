import { Badge } from 'ui/components/ui/badge';
import { deadlineLabel, priorityLabel } from '@/lib/request-fields';
import { cn } from '@ui/lib/utils';

export default function RequestMetaBadges({
  priority,
  deadline,
  className,
}: {
  priority?: string | null;
  deadline?: string | null;
  className?: string;
}) {
  const p = priorityLabel(priority);
  const d = deadlineLabel(deadline);

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      <Badge variant='outline' className='text-[10px] font-normal'>
        {p}
      </Badge>
      <Badge variant='secondary' className='text-[10px] font-normal'>
        {d}
      </Badge>
    </div>
  );
}
