import { inviteAllGuests } from './util/headers';
import { MethodNotAllowed } from './util/reponse-templates';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		// Only GET requests work with this proxy.
		if (request.method !== 'GET') return MethodNotAllowed(request);

		const hostRequest = new Request(env.HOST_SITE_URL, request);

		console.log('    fetching:', hostRequest.url);
		return inviteAllGuests(env, await fetch(hostRequest));
	},
};
