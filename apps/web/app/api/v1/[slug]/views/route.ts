import { NextRequest, NextResponse } from 'next/server';
import { recordClick } from '@/lib/tinybird';

/*
  Record page view
  POST /api/v1/[project]/views
  {
    "feedbackId": "string",
    "changelogId": "string",
  }
*/
export async function POST(req: NextRequest, context: { params: { slug: string } }) {
  const { feedbackId, changelogId } = await req.json();

  // Analytics is optional when Tinybird is not configured (common for self-hosted).
  if (!process.env.TINYBIRD_API_URL || !process.env.TINYBIRD_API_KEY) {
    return NextResponse.json({ data: null, skipped: true }, { status: 200 });
  }

  const data = await recordClick({
    req,
    projectId: context.params.slug,
    feedbackId,
    changelogId,
  });

  return NextResponse.json({ data }, { status: 200 });
}
