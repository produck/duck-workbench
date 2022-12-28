import assert from 'node:assert/strict';
import * as Duck from '@produck/duck';
import * as DuckLog from '@produck/duck-log';
import * as DuckLogQuack from '../src/index.mjs';

describe('DuckLogQuack.Transcriber()', function () {
	it('should log a message.', function () {
		const flag = [];

		Duck.define({
			id: 'Foo',
			components: [
				DuckLog.Component({
					bar: {
						Transcriber: DuckLogQuack.Transcriber({
							appenders: [(message) => flag.push(message)],
						}),
					},
				}),
			],
		}, function Foo({ Log }) {
			Log.bar('test');
		})();

		assert.ok(typeof flag[0] === 'string');
	});
});
