import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { PostgrestError } from '@supabase/supabase-js';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. /auth/callback (Supabase Auth callback)
     */
    '/((?!api/|auth/callback|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

function applySupabaseCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
  return target;
}

export default async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  const configuredRoot = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  // Get root domain (supports multi-label roots like projects.lizasem.com)
  const rootDomain = hostname.includes('localhost')
    ? hostname.split('.').slice(-1)[0]
    : hostname === configuredRoot || hostname.endsWith(`.${configuredRoot}`)
    ? configuredRoot
    : hostname.split('.').length >= 2
    ? `${hostname.split('.').slice(-2).join('.')}`
    : null;

  // If the request is for a custom domain, rewrite to project paths
  if (
    rootDomain !== configuredRoot ||
    process.env.CUSTOM_DOMAIN_WHITELIST?.split(',').includes(hostname)
  ) {
    // Retrieve the project from the database
    const { data, error } = (await supabase
      .from('project_configs')
      .select('project:project_id (slug)')
      .eq('custom_domain', hostname)
      .eq('custom_domain_verified', true)
      .single()) as { data: { project: { slug: string } } | null; error: PostgrestError | null };

    // If the project doesn't exist, return 404
    if (error || !data) {
      return applySupabaseCookies(NextResponse.next(), supabaseResponse);
    }

    // If the project exists, rewrite the request to the project's folder
    return applySupabaseCookies(
      NextResponse.rewrite(
        new URL(
          `/${data?.project?.slug}${path}${
            req.nextUrl.searchParams ? `?${req.nextUrl.searchParams.toString()}` : ''
          }`,
          req.url
        ),
        {
          headers: {
            'x-pathname': path,
            'x-project': data?.project?.slug,
            'x-powered-by': 'Projects',
          },
        }
      ),
      supabaseResponse
    );
  }

  // rewrites for dash pages
  if (
    hostname === `dash.${configuredRoot}` ||
    (process.env.SUBDOMAIN_HOSTING === 'true' &&
      hostname === `${process.env.DASHBOARD_SUBDOMAIN}.${configuredRoot}`)
  ) {
    // protect all app pages with authentication except for /login, /signup and /invite/*
    if (!user && path !== '/login' && path !== '/signup' && !path.startsWith('/invite/')) {
      return applySupabaseCookies(NextResponse.redirect(new URL('/login', req.url)), supabaseResponse);
    }

    // rewrite / to /dash
    return applySupabaseCookies(
      NextResponse.rewrite(new URL(`/dash${path === '/' ? '' : path}`, req.url), {
        headers: {
          'x-pathname': path,
          'x-project': path.split('/')[1],
        },
      }),
      supabaseResponse
    );
  }

  // rewrite root application to `/home` folder
  if (hostname === 'localhost:3000' || hostname === configuredRoot) {
    return applySupabaseCookies(
      NextResponse.rewrite(new URL(`/home${path === '/' ? '' : path}`, req.url), {
        headers: {
          'x-pathname': path,
          'x-project': path.split('/')[1],
        },
      }),
      supabaseResponse
    );
  }

  // rewrite /api to `/api` folder
  if (hostname === `api.${configuredRoot}`) {
    return applySupabaseCookies(
      NextResponse.rewrite(new URL(`/api${path}`, req.url), {
        headers: {
          'x-pathname': path,
          'x-project': path.split('/')[1],
        },
      }),
      supabaseResponse
    );
  }

  // rewrite everything else to `/[sub-domain]/[path] dynamic route
  return applySupabaseCookies(
    NextResponse.rewrite(
      new URL(
        `/${hostname.split('.')[0]}${path}${
          req.nextUrl.searchParams ? `?${req.nextUrl.searchParams.toString()}` : ''
        }`,
        req.url
      ),
      {
        headers: {
          'x-pathname': path,
          'x-project': hostname.split('.')[0],
          'x-powered-by': 'Projects',
        },
      }
    ),
    supabaseResponse
  );
}
