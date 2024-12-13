import Koa from 'koa';
import * as DuckWeb from '@produck/duck-web';
import { defineAny } from '@produck/duck';
import { Assert } from '@produck/idiom';

import * as Options from './Options.mjs';

export function DefaultFactory(app, { product }) {
	app.use(ctx => ctx.body = JSON.stringify(product));
}

export function defineKoaApp(factory = DefaultFactory, plugins = []) {
	Assert.Type.Function(factory, 'factory');

	const finalPlugins = Options.normalize(plugins);

	return DuckWeb.defineApplication(function KoaApplication(Kit) {
		const KoaAppKit = Kit('KoaApp');

		for (const install of finalPlugins) {
			install(KoaAppKit);
		}

		return function Application(options) {
			const app = new Koa();
			const KoaAppInstanceKit = KoaAppKit('KoaApp::Instance');

			factory(app, KoaAppInstanceKit, options);

			return app.callback();
		};
	});
}

export {
	Options,
	defineKoaApp as define,
	defineAny as definePlugin,
};
