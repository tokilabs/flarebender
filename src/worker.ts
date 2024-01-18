/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { inject } from './inject.js';
import handleProxy from './proxy.js';
import handleRedirect from './redirect.js';
import apiRouter from './api-router.js';
import show from './show.js';
import { invite, inviteAllGuests } from './util/headers.js';
import { PageNotFound } from './util/reponse-templates.js';
import { requestFrom } from './util/routing.js';

// Export a default object containing event handlers
export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		try {
			console.log('Environment Variables:', JSON.stringify(env, null, 2));

			// You'll find it helpful to parse the request.url string into a URL object.
			// Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
			const url = new URL(request.url);
			// FIXME: check why on dev protocol is always http
			url.protocol = 'https';

			console.log('Handling request:', request.url);
			console.log('    .pathname:', url.pathname);
			// You can get pretty far with simple logic like if/switch-statements
			switch (url.pathname) {
				case '/':
					return show.fetch(requestFrom(env.GUEST_SITE_URL, request), env, ctx);

				case '/redirect':
					return handleRedirect.fetch(request, env, ctx);

				case '/proxy':
					return handleProxy.fetch(request, env, ctx);

				case '/s':
					return inject(await show.fetch(requestFrom(env.HOST_SITE_URL, request), env, ctx), {
						content: String('<script type="text/javascript" src="/assets/sharetribe-custom-script.js"></script>'),
						html: true,
						env,
					});
			}

			if (url.pathname.startsWith('/assets/')) {
				// You can also use more robust routing
				// return new Response(
				// 	fs.readFile(new URL(url.pathname, import.meta.url)),
				// )
				console.log('[asset]', request.url);
				return fetch(request.url);
			}

			if (url.pathname.startsWith('/_astro/')) {
				// You can also use more robust routing
				console.log('Astro URL detected:', request.url);

				const newRequest = requestFrom(env.GUEST_SITE_URL, request);
				console.log(`    requesting from ${newRequest.url}`);

				return show.fetch(newRequest, env, ctx);
			}

			// if (url.pathname.startsWith('/api/')) {
			// 	// You can also use more robust routing
			// 	return apiRouter.handle(request);
			// }

			// Forward all other path names to the DEFAULT_SITE
			if (env.DEFAULT_SITE && env.DEFAULT_SITE != 'NONE') {
				let defaultSiteUrl = env.HOST_SITE_URL;
				let otherSiteUrl = env.GUEST_SITE_URL;

				if (env.DEFAULT_SITE == 'GUEST') {
					defaultSiteUrl = env.GUEST_SITE_URL;
					otherSiteUrl = env.HOST_SITE_URL;
				}

				const destUrl = new URL(defaultSiteUrl);
				destUrl.protocol = 'https';
				destUrl.pathname = url.pathname;
				destUrl.hash = url.hash;
				destUrl.search = url.search;

				console.log(`URL ${url} => ${destUrl}`);

				return inviteAllGuests(env, await fetch(destUrl));
			}
		} catch (err) {
			console.error(err);
			return new Response(err?.message || '', { status: 500 });
		}

		return PageNotFound(request);
	},
};
