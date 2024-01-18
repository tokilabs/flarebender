import { makeLinksAbsolute } from './util/rewriter';
import { inviteAllGuests } from './util/headers';
import { MethodNotAllowed } from './util/reponse-templates';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		// Only GET requests work with this proxy.
		if (request.method !== 'GET') return MethodNotAllowed(request);

		console.log('    fetching:', request.url);
		return inviteAllGuests(env, await fetch(request.url));
	},
};
