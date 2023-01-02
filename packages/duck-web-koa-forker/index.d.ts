import * as Koa from 'koa';
import * as KoaForker from 'koa-forker';
import * as Mold from '@produck/mold';
import * as Duck from '@produck/duck';
import * as DuckWebKoa from '@produck/duck-web-koa';

declare module '@produck/duck-web-koa' {
	interface KoaAppKit {
		Forker: () => Koa.Middleware;
	}
}

type RouterProvider = (router: KoaForker.Router, Kit: KoaForkerKit) => void;

export namespace Descriptor {
	type PathString = string;

	interface PathObject {
		name: string;
		path: string;
	}

	type Path = PathString | PathObject | Array<PathString> | Array<PathObject>;

	interface Object {
		name: string;
		path: Path;
		provider: RouterProvider;
		uses: Array<Object>;
	}

	export const PathObjectSchema: Mold.Schema<PathObject>;
	export const PathSchema: Mold.Schema<Path>;
	export const Schema: Mold.Schema<Object>;
	export function normalize(descriptor: Object): Object;
}

export namespace Options {
	interface Object {
		onMethodNotAllowed: Koa.Middleware;
		onNotImplemented: Koa.Middleware;
	}

	export const onMethodNotAllowed: Koa.Middleware;
	export const onNotImplemented: Koa.Middleware;
	export const Schema: Mold.Schema<Object>;
	export function normalize(descriptor: Object): Object;
}

interface KoaForkerKit extends DuckWebKoa.KoaAppKit { }

export function DuckWebKoaForkerPlugin(
	descriptor: Descriptor.Object,
	options: Options.Object
): DuckWebKoa.Plugin;

export { DuckWebKoaForkerPlugin as Plugin };
export const defineRouter: Duck.AnyDefiner<RouterProvider>;
