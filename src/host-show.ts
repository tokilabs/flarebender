import { invite } from './util/headers';

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

		console.log('    fetching:', env.HOST_SITE_URL);

		return invite(env.GUEST_SITE_URL, await fetch(env.HOST_SITE_URL));
	},
};
