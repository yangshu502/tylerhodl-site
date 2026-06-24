//@ts-expect-error: Will be resolved by wrangler build
import { handleCdnCgiImageRequest, handleImageRequest } from "./cloudflare/images.js";
//@ts-expect-error: Will be resolved by wrangler build
import { runWithCloudflareRequestContext } from "./cloudflare/init.js";
//@ts-expect-error: Will be resolved by wrangler build
import { maybeGetSkewProtectionResponse } from "./cloudflare/skew-protection.js";
// @ts-expect-error: Will be resolved by wrangler build
import { handler as middlewareHandler } from "./middleware/handler.mjs";
//@ts-expect-error: Will be resolved by wrangler build
export { DOQueueHandler } from "./.build/durable-objects/queue.js";
//@ts-expect-error: Will be resolved by wrangler build
export { DOShardedTagCache } from "./.build/durable-objects/sharded-tag-cache.js";
//@ts-expect-error: Will be resolved by wrangler build
export { BucketCachePurge } from "./.build/durable-objects/bucket-cache-purge.js";

async function proxyUpstream(request) {
  const url = new URL(request.url);
  let upstream = null;
  if (url.pathname === '/monitor' || url.pathname.startsWith('/monitor/')) {
    upstream = 'https://haohaozhuanqian.pages.dev' + url.pathname + url.search;
  } else
  if (url.pathname === '/research' || url.pathname.startsWith('/research/')) {
    upstream = 'https://research-3sk.pages.dev' + url.pathname + url.search;
  } else
  if (url.pathname === '/wallet' || url.pathname.startsWith('/wallet/')) {
    upstream = 'https://tylerhodl.pages.dev' + url.pathname + url.search;
  } else
  {}
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
export default {
    async fetch(request, env, ctx) {
        return runWithCloudflareRequestContext(request, env, ctx, async () => {
            const proxyResp = await proxyUpstream(request);
            if (proxyResp) return proxyResp;
            const response = maybeGetSkewProtectionResponse(request);
            if (response) {
                return response;
            }
            const url = new URL(request.url);
            // Serve images in development.
            // Note: "/cdn-cgi/image/..." requests do not reach production workers.
            if (url.pathname.startsWith("/cdn-cgi/image/")) {
                return handleCdnCgiImageRequest(url, env);
            }
            // Fallback for the Next default image loader.
            if (url.pathname ===
                `${globalThis.__NEXT_BASE_PATH__}/_next/image${globalThis.__TRAILING_SLASH__ ? "/" : ""}`) {
                return await handleImageRequest(url, request.headers, env);
            }
            // - `Request`s are handled by the Next server
            const reqOrResp = await middlewareHandler(request, env, ctx);
            if (reqOrResp instanceof Response) {
                return reqOrResp;
            }
            // @ts-expect-error: resolved by wrangler build
            const { handler } = await import("./server-functions/default/handler.mjs");
            return handler(reqOrResp, env, ctx, request.signal);
        });
    },
};
