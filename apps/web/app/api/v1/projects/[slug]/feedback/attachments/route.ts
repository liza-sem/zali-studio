import { NextResponse } from 'next/server';
import { decode } from 'base64-arraybuffer';
import { withProjectAuth } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(req: Request, context: { params: { slug: string } }) {
  const { fileName, dataUrl } = (await req.json()) as { fileName?: string; dataUrl?: string };

  if (!fileName || !dataUrl) {
    return NextResponse.json({ error: 'fileName and dataUrl are required.' }, { status: 400 });
  }

  const result = await withProjectAuth<{ url: string }>(async (_user, supabase, project, error) => {
    if (error) return { data: null, error };

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${project!.slug}/${Date.now()}-${safeName}`;
    const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '');
    const contentType = dataUrl.match(/^data:(?<mime>[^;]+);/)?.groups?.mime || 'application/octet-stream';

    const { error: uploadError } = await supabase.storage
      .from('request-attachments')
      .upload(path, decode(base64), { contentType });

    if (uploadError) {
      return { data: null, error: { message: uploadError.message, status: 500 } };
    }

    const { data: publicUrlData } = supabase.storage.from('request-attachments').getPublicUrl(path);
    return { data: { url: publicUrlData.publicUrl }, error: null };
  })(context.params.slug, 'route', true, true);

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: result.error.status });
  }

  return NextResponse.json(result.data, { status: 200 });
}
