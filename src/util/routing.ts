export function requestFrom(hostUrl: string, request: Request): Request {
	// Clone the request URL
	const host = new URL(hostUrl);
	const url = new URL(request.url);

	// Modify only the host (host = hostname:port)
	// url.host = host;
	url.protocol = host.protocol;
	url.host = host.host;

	console.info(`[URL Rewrite]: ${request.url} => ${url.toString()}`);

	// Clone the request and replace the URL
	return new Request(url.toString(), request);
}
