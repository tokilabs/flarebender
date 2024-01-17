export function requestFrom(host: string, request: Request): Request {
	const url = new URL(request.url);
	url.hostname = host;
	return new Request(url.toString(), request);
}
