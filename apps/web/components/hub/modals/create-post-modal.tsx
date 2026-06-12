import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@ui/components/ui/responsive-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui/components/ui/select';
import { toast } from 'sonner';
import { PRODUCT } from '@/lib/product-copy';
import { DEADLINE_OPTIONS, PRIORITY_OPTIONS } from '@/lib/request-fields';
import type { RequestAttachment } from '@/lib/types';
import RequestAttachmentUpload from '@/components/hub/requests/request-attachment-upload';
import { Icons } from '@/components/shared/icons/icons-static';
import PostEditor from '@/components/shared/tiptap-editor';

export default function CreatePostModal({
  projectSlug,
  children,
}: {
  projectSlug: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [pinnedUrl, setPinnedUrl] = useState<string>('');
  const [pinnedLabel, setPinnedLabel] = useState<string>('');
  const [priority, setPriority] = useState<string>('normal');
  const [deadline, setDeadline] = useState<string>('flexible');
  const [attachments, setAttachments] = useState<RequestAttachment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  function resetForm() {
    setTitle('');
    setContent('');
    setPinnedUrl('');
    setPinnedLabel('');
    setPriority('normal');
    setDeadline('flexible');
    setAttachments([]);
  }

  function onSubmit() {
    setIsLoading(true);

    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: content,
          pinned_url: pinnedUrl.trim() || null,
          pinned_label: pinnedLabel.trim() || null,
          priority,
          deadline_bucket: deadline,
          attachment_urls: attachments,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    promise
      .then(() => {
        setOpen(false);
        resetForm();
        setIsLoading(false);
        toast.success(`${PRODUCT.requests.singular} submitted`);
        router.refresh();
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[520px]'>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{PRODUCT.requests.create}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Share what you need — add a link, files, priority, and when you need it.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              placeholder='What do you need?'
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              className='bg-secondary/30 font-light'
            />
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Label>Pinned link</Label>
              <Input
                placeholder='https://figma.com/...'
                value={pinnedUrl}
                onChange={(e) => {
                  setPinnedUrl(e.target.value);
                }}
                className='bg-secondary/30 font-light'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Link label (optional)</Label>
              <Input
                placeholder='Figma mockups'
                value={pinnedLabel}
                onChange={(e) => {
                  setPinnedLabel(e.target.value);
                }}
                className='bg-secondary/30 font-light'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className='bg-secondary/30'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Deadline</Label>
              <Select value={deadline} onValueChange={setDeadline}>
                <SelectTrigger className='bg-secondary/30'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEADLINE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <RequestAttachmentUpload projectSlug={projectSlug} attachments={attachments} onChange={setAttachments} />

          <div className='flex flex-col gap-2'>
            <Label htmlFor='content'>Details</Label>
            <div className='bg-secondary/30 focus-within:ring-ring ring-offset-root flex w-full flex-col items-center justify-end rounded-sm border p-4 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-offset-1'>
              <PostEditor
                content={content}
                setContent={setContent}
                className='min-h-[120px] w-full'
                showToolbar
              />
            </div>
            <Label className='text-foreground/50 text-xs font-extralight'>
              Use the toolbar for formatting. Headings, links, lists, and emphasis are supported.
            </Label>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <Button
            variant='default'
            type='submit'
            onClick={onSubmit}
            disabled={!title || content.replace(/<[^>]*>?/gm, '').length === 0 || isLoading}>
            {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
            {PRODUCT.requests.submit}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
