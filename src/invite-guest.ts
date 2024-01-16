import { updateHeader, invite } from './util/headers';

export default {
	/**
	 * Modifies the original Content-Security-Policy response header to
	 * give GUEST_SITE_URL the same permissions as the host ('self').
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const res = await fetch(request);

		const text = await new Response(res.body, res).text();

		console.log('------------------------');
		console.log(text);
		console.log('------------------------');

		return updateHeader(new Response(text, res), 'Content-Security-Policy', invite(env.GUEST_SITE_URL));
	},
};
