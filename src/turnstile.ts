export async function inject(response: Response, { content, html }: { content: string; html: boolean; env: Env }) {
	// Instantiate the API to run on specific elements, for example, `head`, `div`
	return (
		new HTMLRewriter()

			// `.on` attaches the element handler and this allows you to match on element/attributes or to use the specific methods per the API
			.on('head', {
				element(element) {
					// In this case, you are using `append` to add a new script to the `head` element
					element.append(content, { html });
				},
			})
			// .on('div', {
			// 	element(element) {
			//    const SITE_KEY = env.HOST_SITE_URL;
			//
			// 		// You are using the `getAttribute` method here to retrieve the `id` or `class` of an element
			// 		if (element.getAttribute('id') === <NAME_OF_ATTRIBUTE>) {
			// 			element.append(`<div class="cf-turnstile" data-sitekey="${SITE_KEY}" data-theme="light"></div>`, { html: true });
			// 		}
			// 	},
			// })
			.transform(response)
	);
}
