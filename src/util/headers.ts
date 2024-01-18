import { listAllHosts } from './sites';

export function removeHeaders(headers: string[], response: Response): Response {
	if (!headers || headers.length === 0) {
		throw new Error('Headers to be removed not provided to removeHeaders()');
	}

	// Clone the response so that it's no longer immutable
	const newResponse = new Response(response.body, response);

	// Delete headers
	headers.forEach((h) => newResponse.headers.delete(h));

	return newResponse;
}

export function updateHeader(response: Response, header: string, updater: (value: string | null) => string | null): Response {
	// Clone the response so that it's no longer immutable
	const newResponse = new Response(response.body, response);

	// Delete headers
	const newValue = updater(newResponse.headers.get(header));

	if (newValue !== null) {
		newResponse.headers.set(header, newValue);
	}

	return newResponse;
}

export function invite(guestHost: string, response: Response): Response;
export function invite(guestsHosts: string[], response: Response): Response;
export function invite(guests: string | string[], response: Response): Response {
	if (!guests || guests.length === 0) {
		return response;
	}

	if (Array.isArray(guests)) {
		guests = guests.join(' ');
	}

	const newResponse = updateHeader(response, 'Content-Security-Policy', (value: string | null) => {
		console.log(`Updating Content-Security-Policy Header to include ${guests}`);

		if (!value) {
			return null;
		}

		return (
			value
				// remove report-uri
				.replace(/report\-uri [^;]*;/, '')
				// append guest url after each 'self'
				.replace(/(['"]self['"])/g, `'self' ${guests}`)
		);
	});

	return removeHeaders(['Report-To'], newResponse);
}

export function inviteAllGuests(env: Env, response: Response): Response {
	if (Array.isArray(env.INVITE_ONLY) && env.INVITE_ONLY.length > 0) {
		return invite(env.INVITE_ONLY, response);
	}

	return invite(listAllHosts(env), response);
}
