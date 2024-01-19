declare global {
	interface Window {
		dev: Dev; // Add the 'dev' property to the Window interface
	}
}

// Define an interface for the action data structure
interface ActionData {
	action: string;
	data: HTMLElement;
}

// Interface to describe the structure of the `dev` object
interface Dev {
	history: ActionData[];
	record(action: string, data: HTMLElement): void;
	undo(): void;
	watch(): void;
}

// Create and export the `dev` object with typed methods
export const dev: Dev = {
	history: [],

	record(action: string, data: HTMLElement): void {
		window.dev.history.push({
			action,
			data,
		});
	},

	undo(): void {
		const lastAction = window.dev.history.pop();
		if (lastAction && lastAction.action === 'created') {
			lastAction.data.remove();
		}
	},

	watch(): void {
		const { app, logo, history } = window as any;
		console.dir({ app, logo, history });
	},
};

(window as any).dev = dev;

export const $ = (selector: string): HTMLElement | null => document.querySelector(selector);
export const $$ = (selector: string): NodeList => document.querySelectorAll(selector);

// Document and export the copyCss function
/**
 * Copies CSS properties from one element to another.
 * @param from Selector of the element to copy styles from.
 * @param to Selector of the element to copy styles to.
 * @param props Array of property names to be copied.
 */
export function copyCss(from: string, to: string, props: string[]): void {
	const fromEl = $(from);
	const toEl = $(to);

	if (!fromEl) {
		console.error(`Element ${from} not found.`);
		return;
	}

	if (!toEl) {
		console.error(`Element ${to} not found.`);
		return;
	}

	const fromStyle = window.getComputedStyle(fromEl);
	for (const prop of props) {
		(toEl as HTMLElement).style[prop as any] = fromStyle[prop as any];
	}
}

const navLinkClass: string = $('nav a:last-child')!.className;
const navLinkInnerClass: string = $('nav a:last-child > span')!.className;

// Document and export the NavLink function
/**
 * Generates HTML for a navigation link.
 * @param url URL of the navigation link.
 * @param text Text of the navigation link.
 * @returns A string of HTML for the new link.
 */
export function NavLink(url: string, text: string): string {
	return `<a href="${url}" class="${navLinkClass}">
            <span class='${navLinkInnerClass}'>
              <span>${text}</span>
            </span>
          </a>`;
}

// Document and export the htmlToFragment function
/**
 * Converts a string of HTML into a DocumentFragment.
 * @param html A string containing HTML.
 * @returns A DocumentFragment of the provided HTML.
 */
export function htmlToFragment(html: string): DocumentFragment {
	const template = document.createElement('template');
	template.innerHTML = html;
	return template.content.cloneNode(true) as DocumentFragment;
}

// Document and export the el function
/**
 * Converts a string of HTML to the first Element in the template.
 * @param elementHtml A string containing HTML for one element.
 * @returns The Element created from the provided HTML string.
 */
export function el(elementHtml: string): Element | null {
	const template = document.createElement('template');
	template.innerHTML = elementHtml;
	return template.content.firstElementChild;
}

// Position aliases and their respective positions in the DOM
export const positionAliases: { [key: string]: InsertPosition } = {
	/**
	 * Alias for 'beforebegin': Before the targetElement itself.
	 */
	before: 'beforebegin',
	/**
	 * Alias for 'afterbegin': Just inside the targetElement, before its first child.
	 */
	after: 'afterend',
	/**
	 * Alias for 'beforeend': Just inside the targetElement, after its last child.
	 */
	start: 'afterbegin',
	/**
	 * Alias for 'afterend': After the targetElement itself.
	 */
	end: 'beforeend',
};

// Document and export the at function
/**
 * Returns a function that inserts an element in relation to another element at the specified position.
 * @param pos The position relative to the target element to insert the new element.
 * @returns A function that takes a node and then a function that inserts the provided node at the specified position.
 */
export function at(pos: InsertPosition): (node: Node) => (inserted: Element | string) => void {
	return (node: Node) => (inserted: Element | string) => {
		findEl(node).insertAdjacentElement(pos, findEl(inserted));
	};
}

export const before = at(positionAliases.before);
export const after = at(positionAliases.after);
export const start = at(positionAliases.start);
export const end = at(positionAliases.end);

// Document and export the findEl function
/**
 * Finds an Element based on the provided parameter.
 * @param el The element or selector to find the element.
 * @returns The found Element.
 * @throws Will throw an error if the element could not be found or the found item is not an Element.
 */
export function findEl(el: Element | string): Element {
	if (el instanceof Element) {
		return el;
	} else if (typeof el === 'string') {
		const found = $(el);
		if (found instanceof HTMLElement) {
			return found;
		}
		if (!found) {
			throw new Error(`Element ${el} not found`);
		}
		throw new Error(`Element ${el} found but it is not of type HTMLElement`);
	}
	throw new Error(`Invalid type for element: ${el}`);
}

// Document and export the insert function
/**
 * Inserts a node at a specified position.
 * @param node The node to insert.
 * @param where A function that specifies where to insert the node.
 * @throws Will throw an error if the node is not of type Node.
 */
export function insert(node: Node, where: (inserted: Element | string) => void): void {
	if (!node || !(node instanceof Node)) {
		throw new Error('You must pass a valid Node to insert as the first argument. Received: ' + node);
	}
	where(node);
}

// Extra properties have been given types for addNavLink function parameters
type AtFunction = (inserted: Element | string) => void;

// Document and export the addNavLink function
/**
 * Adds a new navigation link to the nav element.
 * @param url The URL for the new navigation link.
 * @param text The text for the new navigation link.
 * @param insertFn A function that specifies how to insert the new link.
 * @returns The newly created Element.
 */
export function addNavLink(url: string, text: string, insertFn: AtFunction | null = null): Element | null {
	const nav: Element = $('nav')!;
	const newLink: Element | null = el(NavLink(url, text));

	if (newLink) {
		if (typeof insertFn === 'function') {
			insertFn(newLink);
		} else {
			nav.appendChild(newLink);
		}

		dev.record('created', newLink as HTMLElement);
	}

	return newLink;
}

const leftNav: Element | null = el('<div id="left-nav"></div>');

const logo: HTMLElement | null = $('nav a[href="/"]');
if (logo && leftNav) {
	insert(leftNav, after(logo));
}

if (leftNav) {
	// The props argument should be a string array, updated accordingly
	copyCss('nav form', '#left-nav', ['borderLeft']);
}

if (leftNav) {
	addNavLink('https://www.calligo.com.br/manifesto', 'Nosso Propósito', start(leftNav));
}
