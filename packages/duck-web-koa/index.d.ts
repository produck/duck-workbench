import * as Koa from 'koa';
import * as Duck from '@produck/duck';
import * as DuckWeb from '@produck/duck-web';

export interface KoaAppKit extends Duck.ProductKit { }
interface KoaAppInstanceKit extends KoaAppKit { }

type Factory = (app: Koa, Kit: KoaAppInstanceKit) => void;
type Plugin = (Kit: KoaAppKit) => void;

export function defineKoaApp(
	factory?: Factory,
	plugins?: Array<Plugin>
): DuckWeb.Provider;

export const definePlugin: Duck.AnyDefiner<Plugin>;
export { defineKoaApp as define };
export const DefaultFactory: Factory;
