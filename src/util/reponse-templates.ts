export async function MethodNotAllowed(request: Request) {
	return new Response(`Method ${request.method} not allowed.`, {
		status: 405,
		headers: {
			Allow: 'GET',
		},
	});
}
