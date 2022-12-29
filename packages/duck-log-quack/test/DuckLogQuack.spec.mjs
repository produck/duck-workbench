import assert from 'node:assert/strict';
import * as Duck from '@produck/duck';
import * as DuckLog from '@produck/duck-log';
import * as DuckLogQuack from '../src/index.mjs';

describe('DuckLogQuack.Transcriber()', function () {
	it('should log a message.', function () {
		const flag = [];

		const Transcriber = DuckLogQuack.Transcriber({
			appenders: [(message) => flag.push(message)],
		});

		Duck.define({
			id: 'Foo',
			components: [
				DuckLog.Component({
					bar: { Transcriber },
				}),
			],
		}, function Foo({ Log }) {
			Log.bar('test');
		})();

		assert.ok(typeof flag[0] === 'string');
	});
});
