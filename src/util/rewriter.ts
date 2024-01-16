export class AttributeRewriter {
	constructor(public readonly attributeName: string) {}

	element(element: Element) {
		const attribute = element.getAttribute(this.attributeName);
		if (attribute) {
			if (attribute.startsWith('/')) {
				element.setAttribute(this.attributeName, `https://www.calligo.com.br${attribute}`);
			}
		}
	}
}

export async function makeLinksAbsolute(res: Response) {
	const rewriter = new HTMLRewriter()
		.on('a', new AttributeRewriter('href'))
		.on('link', new AttributeRewriter('href'))
		.on('script', new AttributeRewriter('src'))
		.on('img', new AttributeRewriter('src'))
		.on('video', new AttributeRewriter('src'));

	const contentType = res.headers.get('Content-Type');

	// If the response is HTML, it can be transformed with
	// HTMLRewriter -- otherwise, it should pass through
	if (contentType?.startsWith('text/html')) {
		return rewriter.transform(res);
	} else {
		return res;
	}
}
