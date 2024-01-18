export function requestFrom(host: string, request: Request): Request {
	// Clone the request URL
	const url = new URL(request.url);

	// Modify only the host (host = hostname:port)
	url.host = host;

	// Clone the request and replace the URL
	return new Request(url.toString(), request);
}
