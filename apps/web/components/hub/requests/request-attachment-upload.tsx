'use client';

import { useRef, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from 'ui/components/ui/button';
import { Label } from 'ui/components/ui/label';
import type { RequestAttachment } from '@/lib/types';
import { Icons } from '@/components/shared/icons/icons-static';

export default function RequestAttachmentUpload({
  projectSlug,
  attachments,
  onChange,
}: {
  projectSlug: string;
  attachments: RequestAttachment[];
  onChange: (attachments: RequestAttachment[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFileSelected(file: File) {
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch(`/api/v1/projects/${projectSlug}/feedback/attachments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, dataUrl: base64 }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      onChange([...attachments, { url: json.url, name: file.name }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <Label>Attachments</Label>
      <input
        ref={inputRef}
        type='file'
        className='hidden'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void onFileSelected(file);
          }
        }}
      />
      <Button
        type='button'
        variant='outline'
        size='sm'
        className='w-fit'
        disabled={uploading}
        onClick={() => {
          inputRef.current?.click();
        }}>
        {uploading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : <Paperclip className='mr-2 h-4 w-4' />}
        Upload file
      </Button>
      {attachments.length > 0 ? (
        <ul className='flex flex-col gap-1'>
          {attachments.map((a) => (
            <li
              key={a.url}
              className='bg-secondary/30 flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-sm'>
              <a href={a.url} target='_blank' rel='noopener noreferrer' className='truncate hover:underline'>
                {a.name}
              </a>
              <button
                type='button'
                className='text-muted-foreground hover:text-foreground'
                onClick={() => {
                  onChange(attachments.filter((x) => x.url !== a.url));
                }}>
                <X className='h-4 w-4' />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
