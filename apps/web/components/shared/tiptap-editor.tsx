'use client';

import './placeholder.css';
import React from 'react';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Typography } from '@tiptap/extension-typography';
import { AnyExtension, EditorContent, type Editor, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { cn } from '@ui/lib/utils';
import { Bold, Italic, Link2, List, ListOrdered } from 'lucide-react';
import { Button } from 'ui/components/ui/button';

function runEditorCommand(editor: Editor, command: string, attrs?: Record<string, string | number>) {
  const commands = editor.commands as Editor['commands'] &
    Record<string, (attrs?: Record<string, string | number>) => boolean>;
  commands[command]?.(attrs);
}

const HEADING_LEVELS = [1, 2, 3] as const;

function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className='border-border/60 flex flex-wrap items-center gap-1 border-b pb-2'>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        className='h-8 w-8 p-0'
        onClick={() => {
          runEditorCommand(editor, 'toggleBold');
        }}>
        <Bold className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        className='h-8 w-8 p-0'
        onClick={() => {
          runEditorCommand(editor, 'toggleItalic');
        }}>
        <Italic className='h-4 w-4' />
      </Button>
      <div aria-hidden className='bg-border/60 mx-0.5 h-5 w-px' />
      {HEADING_LEVELS.map((level) => (
        <Button
          key={level}
          type='button'
          size='sm'
          variant={editor.isActive('heading', { level }) ? 'secondary' : 'ghost'}
          className='h-8 min-w-8 px-2 text-xs font-semibold'
          onClick={() => {
            runEditorCommand(editor, 'toggleHeading', { level });
          }}>
          H{level}
        </Button>
      ))}
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
        className='h-8 w-8 p-0'
        onClick={() => {
          runEditorCommand(editor, 'toggleBulletList');
        }}>
        <List className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
        className='h-8 w-8 p-0'
        onClick={() => {
          runEditorCommand(editor, 'toggleOrderedList');
        }}>
        <ListOrdered className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('link') ? 'secondary' : 'ghost'}
        className='h-8 w-8 p-0'
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href as string | undefined;
          // eslint-disable-next-line no-alert -- simple link entry without adding modal UI
          const url = window.prompt('Enter a link URL', previousUrl || 'https://');
          if (url === null) return;
          if (url === '') {
            runEditorCommand(editor, 'unsetLink');
            return;
          }
          runEditorCommand(editor, 'setLink', { href: url });
        }}>
        <Link2 className='h-4 w-4' />
      </Button>
    </div>
  );
}

export default function RichTextEditor({
  content,
  setContent,
  placeholder,
  className,
  characterLimit,
  proseInvert,
  showToolbar = false,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  className?: string;
  characterLimit?: number;
  proseInvert?: boolean;
  showToolbar?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }) as AnyExtension,
      Highlight,
      Typography,
      Link.configure({
        HTMLAttributes: {
          class: 'cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
      }),
      CharacterCount.configure({
        limit: characterLimit || undefined,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose prose-sm dark:prose-invert focus:outline-none${proseInvert ? ' prose-invert' : ''}`,
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className={cn('flex h-full w-full flex-col gap-2', className)}>
      {showToolbar && editor ? <EditorToolbar editor={editor} /> : null}
      <EditorContent editor={editor} className='h-full w-full p-0 text-sm font-light outline-none' />
    </div>
  );
}
