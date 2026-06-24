import { readFileSync, writeFileSync } from 'fs';

// Clear any redirect rules that would intercept /monitor and /wallet before the Worker runs
const redirectsPath = '.open-next/assets/_redirects';
writeFileSync(redirectsPath, '');
console.log('_redirects cleared');

const workerPath = '.open-next/worker.js';
const original = readFileSync(workerPath, 'utf8');

if (original.includes('proxyUpstream')) {
  console.log('worker.js already patched, skipping.');
  process.exit(0);
}

const proxyCode = `
async function proxyUpstream(request) {
  const url = new URL(request.url);
  let upstream = null;
  if (url.pathname === '/monitor' || url.pathname.startsWith('/monitor/')) {
    upstream = 'https://haohaozhuanqian.pages.dev' + url.pathname + url.search;
  } else if (url.pathname === '/wallet' || url.pathname.startsWith('/wallet/')) {
    upstream = 'https://tylerhodl.pages.dev' + url.pathname + url.search;
  }
  if (!upstream) return null;

  // Use redirect:'manual' — CF Workers 跨 Zone 时 redirect:'follow' 会把 301 透传给浏览器
  // 手动跟跳转，最多 5 跳，确保最终响应不含 Location 头
  let res = await fetch(upstream, {
    method: request.method,
    headers: {
      'user-agent': request.headers.get('user-agent') ?? '',
      'accept': request.headers.get('accept') ?? '*/*',
      'accept-language': request.headers.get('accept-language') ?? '',
      'accept-encoding': 'identity',
    },
    redirect: 'manual',
  });
  for (let i = 0; i < 5 && res.status >= 300 && res.status < 400; i++) {
    const loc = res.headers.get('location');
    if (!loc) break;
    upstream = new URL(loc, upstream).href;
    res = await fetch(upstream, {
      headers: {
        'user-agent': request.headers.get('user-agent') ?? '',
        'accept': request.headers.get('accept') ?? '*/*',
        'accept-language': request.headers.get('accept-language') ?? '',
        'accept-encoding': 'identity',
      },
      redirect: 'manual',
    });
  }

  const headers = new Headers(res.headers);
  headers.delete('transfer-encoding');
  headers.delete('content-encoding');
  headers.delete('location'); // 绝不把上游跳转暴露给浏览器
  return new Response(res.body, { status: res.status, headers });
}
`;

// Inject proxy before the default export fetch handler
const patched = original.replace(
  'export default {',
  proxyCode + 'export default {'
).replace(
  'return runWithCloudflareRequestContext(request, env, ctx, async () => {',
  'return runWithCloudflareRequestContext(request, env, ctx, async () => {\n            const proxyResp = await proxyUpstream(request);\n            if (proxyResp) return proxyResp;'
);

if (patched === original) {
  console.error('ERROR: patch-worker.mjs could not find injection point in worker.js');
  process.exit(1);
}

writeFileSync(workerPath, patched);
console.log('worker.js patched with proxy routes for /monitor and /wallet');
