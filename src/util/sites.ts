export function listAllSites(env: Env): string[] {
	return [env.HOST_SITE_URL, env.GUEST_SITE_URL, env.FLAREBENDER_URL, ...env.OTHER_SITES];
}

export function listAllDomains(env: Env): string[] {
	return [env.HOST_SITE_URL, env.GUEST_SITE_URL, env.FLAREBENDER_URL, ...env.OTHER_SITES].map((url) => new URL(url).hostname);
}

export function listAllHosts(env: Env): string[] {
	return [env.HOST_SITE_URL, env.GUEST_SITE_URL, env.FLAREBENDER_URL, ...env.OTHER_SITES].map((url) => new URL(url).host);
}
