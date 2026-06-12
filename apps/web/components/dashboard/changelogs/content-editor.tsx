'use client';

import React from 'react';
import { Label } from 'ui/components/ui/label';
import { ChangelogProps } from '@/lib/types';
import TooltipLabel from '@/components/shared/tooltip-label';
import RichTextEditor from '@/components/shared/tiptap-editor';

export default function ChangelogContentEditor({
  data,
  setData,
}: {
  data: ChangelogProps['Row'];
  setData: React.Dispatch<React.SetStateAction<ChangelogProps['Row']>>;
}) {
  return (
    <div className='flex h-full flex-col gap-2'>
      <TooltipLabel label='Content' tooltip='The content of your changelog.' />
      <div className='bg-secondary/30 focus-within:ring-ring ring-offset-root flex h-full max-h-96 flex-col overflow-auto rounded-md border p-4 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-offset-1'>
        <RichTextEditor
          content={data.content || ''}
          setContent={(content) => {
            setData((prev) => ({
              ...prev,
              content: typeof content === 'function' ? content(prev.content || '') : content,
            }));
          }}
          placeholder='Write your changelog update...'
          className='min-h-[160px] w-full'
          showToolbar
          proseInvert
        />
      </div>
      <Label className='text-foreground/50 text-xs font-extralight'>
        Use the toolbar for formatting. Headings, links, lists, and emphasis are supported.
      </Label>
    </div>
  );
}
