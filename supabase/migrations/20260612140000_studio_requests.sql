-- Projects (projects.lizasem.com): request fields + brand update linkage

ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS pinned_url text,
  ADD COLUMN IF NOT EXISTS pinned_label text,
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS deadline_bucket text NOT NULL DEFAULT 'flexible',
  ADD COLUMN IF NOT EXISTS assignee_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS attachment_urls jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.changelogs
  ADD COLUMN IF NOT EXISTS source_feedback_id uuid REFERENCES public.feedback(id) ON DELETE SET NULL;

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('request-attachments', 'request-attachments', TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can insert request attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'request-attachments');

CREATE POLICY "Anyone can read request attachments"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'request-attachments');
