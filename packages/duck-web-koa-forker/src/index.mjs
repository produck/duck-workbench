import KoaForker from 'koa-forker';
import { defineAny } from '@produck/duck';
import * as DuckWebKoa from '@produck/duck-web-koa';

import * as Descriptor from './Descriptor.mjs';
import * as Options from './Options.mjs';

export function DuckWebKoaForkerPlugin(descriptor, options = {}) {
	const rootDescriptor = Descriptor.normalize(descriptor);
	const finalOptions = Options.normalize(options);

	return DuckWebKoa.definePlugin(Kit => {
		Kit.Forker = () => {
			const rootRouter = new KoaForker.Router();

			(function build(descriptor, parent) {
				const { name, prefix, path, provider, uses } = descriptor;
				const router = new KoaForker.Router({ name, prefix });
				const KoaForkerKit = Kit(`KoaForker<${name}>`);

				KoaForkerKit.Forker = undefined;
				provider(router, KoaForkerKit);
				parent.use(path, router);
				uses.forEach(child => build(child, router));

				return router;
			})(rootDescriptor, rootRouter);

			return rootRouter.Middleware(finalOptions);
		};
	});
}

export {
	Descriptor,
	Options,
	DuckWebKoaForkerPlugin as Plugin,
	defineAny as defineRouter,
};
