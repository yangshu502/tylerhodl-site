import { readFileSync, writeFileSync } from 'fs'

// 新增子站：只需编辑 proxy-routes.json，然后运行 npm run cf:rebuild
const PROXY_ROUTES = JSON.parse(readFileSync('./proxy-routes.json', 'utf8'))

// 清空 assets/_redirects，防止 CF 静态资源层在 Worker 之前拦截
const redirectsPath = '.open-next/assets/_redirects'
writeFileSync(redirectsPath, '')
console.log('_redirects cleared')

const workerPath = '.open-next/worker.js'
const original = readFileSync(workerPath, 'utf8')

if (original.includes('proxyUpstream')) {
  console.log('worker.js already patched, skipping.')
  process.exit(0)
}

// 从 proxy-routes.json 动态生成路由判断代码
const routeConditions = PROXY_ROUTES.map(r =>
  `  if (url.pathname === '${r.prefix}' || url.pathname.startsWith('${r.prefix}/')) {\n` +
  `    upstream = '${r.upstream}' + url.pathname + url.search;\n` +
  `  } else`
).join('\n') + '\n  {}'

const proxyCode = `
async function proxyUpstream(request) {
  const url = new URL(request.url);
  let upstream = null;
${routeConditions}
  if (!upstream) return null;

  // redirect:'manual' — CF Workers 跨 Zone 时 redirect:'follow' 会把 301 透传给浏览器
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
  headers.delete('location');
  return new Response(res.body, { status: res.status, headers });
}
`

const patched = original
  .replace('export default {', proxyCode + 'export default {')
  .replace(
    'return runWithCloudflareRequestContext(request, env, ctx, async () => {',
    'return runWithCloudflareRequestContext(request, env, ctx, async () => {\n            const proxyResp = await proxyUpstream(request);\n            if (proxyResp) return proxyResp;'
  )

if (patched === original) {
  console.error('ERROR: patch-worker.mjs could not find injection point in worker.js')
  process.exit(1)
}

writeFileSync(workerPath, patched)
console.log(`worker.js patched — proxy routes: ${PROXY_ROUTES.map(r => r.prefix).join(', ')}`)
