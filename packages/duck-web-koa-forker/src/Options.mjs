import { Normalizer, P, S } from '@produck/mold';
import KoaForker from 'koa-forker';

export const {
	DefaultMethodNotAllowed,
	DefaultNotImplemented,
} = KoaForker.Preset.Middleware;

export const Schema = S.Object({
	onMethodNotAllowed: P.Function(DefaultMethodNotAllowed),
	onNotImplemented: P.Function(DefaultNotImplemented),
});

export const normalize = Normalizer(Schema);
