import { getAssetFromKV, mapRequestToAsset, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
import { MethodNotAllowed, PageNotFound } from './util/reponse-templates';
const assetManifest = JSON.parse(manifestJSON);

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const pathname = new URL(request.url).pathname;
		console.log('[static]', pathname);

		const customKeyModifier = (req: Request) => {
			let url = req.url;
			//custom key mapping optional
			url = url.replace(env.STATIC_PREFIX, '');
			console.log('[static] customKeyModifier:', req.url, '=>', url);
			return mapRequestToAsset(new Request(url, req));
		};

		if (pathname.startsWith(env.STATIC_PREFIX)) {
			try {
				return await getAssetFromKV(
					{
						request,
						waitUntil(promise) {
							return ctx.waitUntil(promise);
						},
					},
					{
						mapRequestToAsset: customKeyModifier,
						ASSET_NAMESPACE: env.__STATIC_CONTENT,
						ASSET_MANIFEST: assetManifest,
					}
				);
			} catch (e) {
				if (e instanceof NotFoundError) {
					return PageNotFound(request);
				} else if (e instanceof MethodNotAllowedError) {
					return MethodNotAllowed(request);
				} else {
					return new Response('An unexpected error occurred', { status: 500 });
				}
			}
		} else return fetch(request);
	},
};
