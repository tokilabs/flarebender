import { makeLinksAbsolute } from './util/rewriter';
import { invite, removeHeaders, updateHeader } from './util/headers';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		async function MethodNotAllowed(request: Request) {
			return new Response(`Method ${request.method} not allowed.`, {
				status: 405,
				headers: {
					Allow: 'GET',
				},
			});
		}
		// Only GET requests work with this proxy.
		if (request.method !== 'GET') return MethodNotAllowed(request);

		const res = await fetch(env.GUEST_SITE_URL);

		invite(env.HOST_SITE_URL, res);
		invite(env.FLAREBENDER_URL, res);

		return makeLinksAbsolute(res);
	},
};
