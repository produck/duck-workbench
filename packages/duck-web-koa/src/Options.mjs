
import { Normalizer, P, S } from '@produck/mold';

export const Schema = S.Array({ items: P.Function() });
export const normalize = Normalizer(Schema);
