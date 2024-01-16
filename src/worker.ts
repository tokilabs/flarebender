/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import showGuest from './guest-show.js';
import showHost from './host-show.js';
import inviteGuest from './invite-guest.js';
import handleProxy from './proxy.js';
import handleRedirect from './redirect.js';
import apiRouter from './router.js';
import { invite } from './util/headers.js';

// Export a default object containing event handlers
export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		console.log('Environment Variables:', JSON.stringify(env, null, 2));

		// You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
		const url = new URL(request.url);

		console.log('Handling URL:', url);
		console.log('    .pathname:', url.pathname);
		// You can get pretty far with simple logic like if/switch-statements
		switch (url.pathname) {
			case '/redirect':
				return handleRedirect.fetch(request, env, ctx);

			case '/proxy':
				return handleProxy.fetch(request, env, ctx);

			case '/host':
				return showHost.fetch(request, env, ctx);

			case '/guest':
				return showGuest.fetch(request, env, ctx);
		}

		if (url.pathname.startsWith('/api/')) {
			// You can also use more robust routing
			return apiRouter.handle(request);
		}

		try {
			// Forward all other path names to the DEFAULT_SITE
			if (env.DEFAULT_SITE && env.DEFAULT_SITE != 'NONE') {
				let hostUrl = env.HOST_SITE_URL;
				let guestUrl = env.GUEST_SITE_URL;

				if (env.DEFAULT_SITE == 'GUEST') {
					hostUrl = env.GUEST_SITE_URL;
					guestUrl = env.HOST_SITE_URL;
				}

				const destUrl = new URL(hostUrl);
				destUrl.pathname = url.pathname;

				console.log(`URL ${url} => ${destUrl}`);

				return invite(guestUrl, await fetch(destUrl));
			}
		} catch (err) {
			console.error(err);
			return new Response(err?.message || '', { status: 500 });
		}

		return new Response('', { status: 404 });
	},
};
