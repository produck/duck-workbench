import { C, Circ, Cust, Normalizer, P, S, T } from '@produck/mold';

const DEFAULT_PATH = '/';

export const PathObjectSchema = S.Object({
	name: P.OrNull(P.String(), false),
	path: P.String(DEFAULT_PATH),
});

const SimplePathSchema = Cust(P.String(DEFAULT_PATH), (_v, _e, next) => {
	return { name: null, path: next() };
});

export const PathSchema = Cust(C.Or([
	SimplePathSchema,
	PathObjectSchema,
	S.Array({ items: SimplePathSchema, minLength: 1 }),
	S.Array({ items: PathObjectSchema, minLength: 1 }),
]), (_value, _empty, next) => {
	const path = next();

	return T.Helper.Array(path) ? path : [path];
});

export const Schema = Circ(Self => S.Object({
	name: P.String('anonymous'),
	path: PathSchema,
	provider: P.Function(() => {}),
	uses: S.Array({ items: Self }),
}));

export const normalize = Normalizer(Schema);
