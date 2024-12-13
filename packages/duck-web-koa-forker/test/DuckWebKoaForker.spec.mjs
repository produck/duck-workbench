import assert from 'node:assert/strict';
import http from 'node:http';
import { describe, it } from 'mocha';

import * as Duck from '@produck/duck';
import * as DuckWeb from '@produck/duck-web';
import * as DuckWebKoa from '@produck/duck-web-koa';

import * as DuckWebKoaForker from '../src/index.mjs';

describe('DuckWebKoaForkerPlugin()', function () {
	it('should create a plugin.', function () {
		const plugin = DuckWebKoaForker.Plugin({
			path: '/api',
		});

		assert.ok(typeof plugin === 'function');
	});

	it('>Forker()', async function () {
		let server;
		const flag = [];

		const MockApp = DuckWebKoa.define((app, { Forker }) => {
			app.use(Forker());
		}, [
			DuckWebKoaForker.Plugin({
				path: ['/api', '/foo'],
				provider: (router, { product, Kit }) => {
					assert.ok(Kit.Forker === undefined);

					router.get(async (ctx) => {
						ctx.body = product;
						flag.push(true);
					});
				},
				uses: [{
					path: ['/project/{projectId}', '/proj'],
					provider: (router) => {
						router.get(ctx => {
							ctx.body = {
								at: new Date(),
								id: ctx.params.projectId,
							};
						});
					},
				}],
			}),
		]);

		Duck.define({
			id: 'foo',
			components: [
				DuckWeb.Component([
					{ id: 'Mock', provider: MockApp },
				]),
			],
		}, function Foo({ Web }) {

			return {
				start() {
					const app = Web.Application('Mock');

					server = http.createServer(app).listen(8081);
				},
			};
		})().start();

		for (const [method, pathname, statusCode] of [
			['GET', '/foo/project/1', 200],
			['GET', '/foo/proj', 200],
			['GET', '/api/project/1', 200],
			['GET', '/api/proj', 200],
			['GET', '/foo', 200],
			['GET', '/api', 200],
			['DELETE', '/api', 405],
			['GET', '/foo/project', 404],
		]) {
			const response = await fetch(`http://127.0.0.1:8081${pathname}`, {
				method,
			});

			assert.equal(response.status, statusCode);
		}

		server.close();
	});
});
