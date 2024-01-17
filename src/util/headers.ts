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

	return removeHeaders(
		['Report-To'],
		updateHeader(response, 'Content-Security-Policy', (value: string | null) => {
			console.log(`Updating Content-Security-Policy Header to include ${guests}`);
			console.log(`    current value: ${value}`);

			if (!value) {
				return null;
			}

			// remove report-uri
			value = value.replace(/report\-uri [^;];/, '');

			const updatedVal = value.replace(/(['"]self['"])/, `'self' ${guests}`);

			console.log(`    updated value: ${updatedVal}`);

			return updatedVal;
		})
	);
}

export function inviteAllGuests(env: Env, response: Response): Response {
	return invite(listAllHosts(env), response);
}
