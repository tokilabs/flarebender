interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;

	HOST_SITE_URL: string;

	/**
	 * The Guest site is the one you want to attach to main site.
	 *
	 * It is like a parasite, attached to the host and that is allowed
	 * in it's system via modifications made to the Content-Security-Policy
	 * header.
	 */
	GUEST_SITE_URL: string;

	/**
	 * Custom domain of the Flarebender worker on Cloudflare
	 */
	FLAREBENDER_URL: string;

	DEFAULT_SITE: 'HOST' | 'GUEST' | 'NONE';
}
