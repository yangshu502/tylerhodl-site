import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  let upstream: string | null = null;

  if (pathname === '/monitor' || pathname.startsWith('/monitor/')) {
    upstream = `https://haohaozhuanqian.pages.dev${pathname}${search}`;
  } else if (pathname === '/wallet' || pathname.startsWith('/wallet/')) {
    upstream = `https://tylerhodl.pages.dev${pathname}${search}`;
  }

  if (!upstream) return;

  const res = await fetch(upstream, {
    method: request.method,
    headers: {
      'user-agent': request.headers.get('user-agent') ?? '',
      'accept': request.headers.get('accept') ?? '*/*',
      'accept-language': request.headers.get('accept-language') ?? '',
      'accept-encoding': 'identity',
    },
    redirect: 'follow',
  });

  const headers = new Headers(res.headers);
  headers.delete('transfer-encoding');
  headers.delete('content-encoding');

  return new Response(res.body, {
    status: res.status,
    headers,
  });
}

export const config = {
  matcher: ['/monitor', '/monitor/:path*', '/wallet', '/wallet/:path*'],
};
