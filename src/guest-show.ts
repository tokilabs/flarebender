import { makeLinksAbsolute } from './util/rewriter';
import { invite, inviteAllGuests, removeHeaders, updateHeader } from './util/headers';

async function MethodNotAllowed(request: Request) {
	return new Response(`Method ${request.method} not allowed.`, {
		status: 405,
		headers: {
			Allow: 'GET',
		},
	});
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		// Only GET requests work with this proxy.
		if (request.method !== 'GET') return MethodNotAllowed(request);

		const guestRequest = new Request(env.GUEST_SITE_URL, request);

		console.log('    fetching:', guestRequest.url);
		return makeLinksAbsolute(inviteAllGuests(env, await fetch(guestRequest)));
	},
};
