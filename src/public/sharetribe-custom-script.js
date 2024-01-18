const dev = {
	history: [],

	record(action, data) {
		window.dev.history.push({
			action,
			data,
		});
	},

	undo() {
		const lastAction = window.dev.history.pop();
		if (lastAction.action === 'created') {
			lastAction.data.remove();
		}
	},

	watch() {
		const { app, logo, history } = window;
		console.dir({ app, logo, history });
	},
};

window.dev = dev;

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function copyCss(from, to, props) {
	const fromEl = $(from);
	const toEl = $(to);

	if (fromEl === null) {
		console.error(`Element ${from} not found.`);
		return;
	}

	if (toEl === null) {
		console.error(`Element ${to} not found.`);
		return;
	}

	const fromStyle = window.getComputedStyle(fromEl);
	const toStyle = window.getComputedStyle(toEl);
	props.forEach((prop) => {
		toEl.style[prop] = fromStyle[prop];
	});
}

const navLinkClass = $('nav a:last-child').className;
const navLinkInnerClass = $('nav a:last-child > span').className;

function NavLink(url, text) {
	return `
  <a href="${url}" class="${navLinkClass}">
    <span class='${navLinkInnerClass}'>
      <span>${text}</span>
    </span>
  </a>`;
}

function htmlToFragment(html) {
	const template = document.createElement('template');
	template.innerHTML = html;
	return template.content.cloneNode(true);
}

function el(elementHtml) {
	const template = document.createElement('template');
	template.innerHTML = elementHtml;
	return template.content.firstElementChild.cloneNode(true);
}

const positionAliases = {
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

function at(pos) {
	return (node) => (inserted) => findEl(node).insertAdjacentElement(pos, findEl(inserted));
}

before = at(positionAliases['before']);
after = at(positionAliases['after']);
start = at(positionAliases['start']);
end = at(positionAliases['end']);

function findEl(el) {
	if (el instanceof Element) {
		return el;
	}

	if (typeof el === 'string') {
		const found = $(el);

		if (found instanceof Element) {
			return found;
		}

		if (!found) {
			throw new Error(`Element ${el} not found`);
		}

		throw new Error(`We found ${el} but it is not an Element`);
	}

	return el;
}

function insert(node, where) {
	if (!node || !(node instanceof Node)) {
		throw new Error('You must pass a valid Node to insert as the first argument. Received: ', node);
	}
	where(findEl(node));
}

/**
 * @param {string} url
 * @param {string} Link text
 * @param {function} [optional] An at, before, after, start or end function return. The default is to use appendChild.
 **/
function addNavLink(url, text, insertFn) {
	const nav = $('nav');
	const newLink = el(NavLink(url, text));

	if (typeof insertFn === 'function') {
		insertFn(newLink);
	} else {
		nav.appendChild(newLink);
	}

	dev.record('created', newLink);

	return newLink;
}

const leftNav = el('<div id="left-nav"></div>');

const logo = $('nav a[href="/"]');
insert(leftNav, after(logo));

copyCss('nav form', '#left-nav', '#left-nav-copy', ['borderLeft']);

addNavLink('https://www.calligo.com.br/manifesto', 'Nosso Propósito', start($('#left-nav')));

// #region rest
// document.onload = () => {
//   console.log('DOCUMENT LOADED ---------------');
//   const app = $('#app').contentDocument;
//   console.log('App', app);

//   window.app = app;

//   let fix = () => {
//     const logo = $$('[href="/"]', app)[0];

//     console.log('[iframe] App', app);
//     console.log('[iframe] Logo id/url', logo.getAttribute('id'), logo.href);

//     logo.setAttribute('href', "https://www.calligo.com.br");

//     logo.onclick = (evt) => {
//       window.location.href = "https://www.calligo.com.br";
//       console.log(evt);
//       evt.preventDefault = true;
//     };

//     console.log('[iframe] Logo id/url', logo.getAttribute('id'), logo.href);
//     console.log('[iframe] Logo', logo);

//   };

//   const a = document.createElement('a');
//   a.className = 'calligo-nav-link';
//   a.href = 'https://www.calligo.com.br/manifest';
//   a.innerHTML = `<span class='calligo-nav-link-inner'>
//     <span>Nosso Propósito</span>
//   </span>`;

//   $('nav').appendChild(a);

//   app.onload = fix;
// };
// #endregion
