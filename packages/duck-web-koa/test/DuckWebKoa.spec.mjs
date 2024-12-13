import assert from 'node:assert/strict';
import http from 'node:http';
import { describe, it } from 'mocha';

import * as Duck from '@produck/duck';
import * as DuckWeb from '@produck/duck-web';

import * as DuckWebKoa from '../src/index.mjs';

describe('DuckWebKoa::::defineKoaApp()', function () {
	it('should create a Koa App.', function () {
		DuckWebKoa.define();
	});

	it('should throw if bad factory.', function () {
		assert.throws(() => DuckWebKoa.define(null), {
			name: 'TypeError',
			message: 'Invalid "factory", one "function" expected.',
		});
	});

	it('should throw if bad plugins.', function () {
		assert.throws(() => DuckWebKoa.define(DuckWebKoa.DefaultFactory, null), {
			name: 'TypeError',
			message: 'Invalid "", one "array" expected.',
		});
	});

	it('should install a plugin.', function () {
		const flag = [];

		const Kit = Duck.define({
			id: 'foo',
			components: [
				DuckWeb.Component([
					{
						id: 'Bar',
						provider: DuckWebKoa.define(DuckWebKoa.DefaultFactory, [
							Kit => flag.push(Kit.product),
						]),
					},
				]),
			],
		})();

		Kit.Web.Application('Bar');

		assert.equal(flag[0].meta.id, 'foo');
	});

	it('should create an default app instance.', function () {
		const Kit = Duck.define({
			id: 'foo',
			components: [
				DuckWeb.Component([
					{ id: 'Bar', provider: DuckWebKoa.define() },
				]),
			],
		})();

		const app = Kit.Web.Application('Bar');

		assert.ok(typeof app === 'function');
	});

	it('should get product from http server.', async function () {
		let server;

		const product = Duck.define({
			id: 'foo',
			components: [
				DuckWeb.Component([
					{ id: 'Bar', provider: DuckWebKoa.define() },
				]),
			],
		}, function Mock({ Web }) {
			return {
				start() {
					const app = Web.Application('Bar');

					server = http.createServer(app).listen(8080);
				},
			};
		})();

		product.start();

		const response = await fetch('http://127.0.0.2:8080');

		assert.equal(response.status, 200);
		server.close();
	});
});
