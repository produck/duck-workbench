import assert from 'node:assert';
import * as Duck from '@produck/duck';
import * as DuckCLI from '@produck/duck-cli';

import * as DuckCLICommander from '../src/index.mjs';

describe('DuckCLICommander::Provider()', function () {
	it('should build a program.', async function () {
		const flags = [];

		const Program = DuckCLI.defineFactory(({ Commander, setProgram }) => {
			const program = new Commander({
				name: 'bar',
				options: [
					{ name: 'version', alias: 'V', description: 'Display verion.' },
				],
				handler: (_args, opts) => {
					flags.push(_args, opts);
				},
			});

			setProgram(program);
		});

		const Kit = Duck.define({
			id: 'Foo',
			components: [
				DuckCLI.Component(Program, DuckCLICommander.Provider),
			],
		})();

		await Kit.CLI.parse(['--version']);
		assert.deepEqual(flags, [[], { version: true }]);
	});

	it('should build a program with child commander.', async function () {
		const flags = [];

		const Program = DuckCLI.defineFactory(({ Commander, setProgram }) => {
			const program = new Commander({
				name: 'bar',
				options: [
					{ name: 'version', alias: 'V', description: 'Display verion.' },
				],
			});

			const child = new Commander({
				name: 'baz',
				options: [
					{
						name: 'delay',
						value: {
							name: 'ms',
							required: false,
						},
						description: 'Delay time in ms.',
					},
				],
				arguments: [
					{ name: 'name', required: true },
				],
				handler: (_args, opts) => {
					flags.push(_args, opts);
				},
			});

			program.appendChild(child);

			setProgram(program);
		});

		const Kit = Duck.define({
			id: 'Foo',
			components: [
				DuckCLI.Component(Program, DuckCLICommander.Provider),
			],
		})();

		await Kit.CLI.parse([
			'baz',
			'admin',
			'--delay', '3000',
		]);

		assert.deepEqual(flags, [['admin'], { delay: 3000 }]);
	});

	it('should build a program with variadic arguments.', async function () {
		const flags = [];

		const Program = DuckCLI.defineFactory(({ Commander, setProgram }) => {
			const program = new Commander({
				name: 'bar',
				arguments: [
					{ name: 'name', required: true, variadic: true },
				],
				handler: (_args, opts) => {
					flags.push(_args, opts);
				},
			});

			setProgram(program);
		});

		const Kit = Duck.define({
			id: 'Foo',
			components: [
				DuckCLI.Component(Program, DuckCLICommander.Provider),
			],
		})();

		await Kit.CLI.parse(['foo', 'bar', 'baz']);
		assert.deepEqual(flags, [['foo', 'bar', 'baz'], {}]);
	});

	it('should build a program with variadic options.', async function () {
		const flags = [];

		const Program = DuckCLI.defineFactory(({ Commander, setProgram }) => {
			const program = new Commander({
				name: 'bar',
				options: [
					{
						name: 'delay',
						value: {
							name: 'ms',
							variadic: true,
							default: ['1', '2'],
							required: true,
						},
						description: 'Delay time in ms.',
					},
				],
				handler: (_args, opts) => {
					flags.push(_args, opts);
				},
			});

			setProgram(program);
		});

		const Kit = Duck.define({
			id: 'Foo',
			components: [
				DuckCLI.Component(Program, DuckCLICommander.Provider),
			],
		})();

		await Kit.CLI.parse(['foo', 'bar', 'baz']);
		assert.deepEqual(flags, [['foo', 'bar', 'baz'], { delay: ['1', '2'] }]);
	});

	it('should build a program with optional arguments.', async function () {
		const flags = [];

		const Program = DuckCLI.defineFactory(({ Commander, setProgram }) => {
			const program = new Commander({
				name: 'bar',
				arguments: [
					{ name: 'name', required: false, description: 'bar', default: 'a' },
				],
				handler: (_args, opts) => {
					flags.push(_args, opts);
				},
			});

			setProgram(program);
		});

		const Kit = Duck.define({
			id: 'Foo',
			components: [
				DuckCLI.Component(Program, DuckCLICommander.Provider),
			],
		})();

		await Kit.CLI.parse([]);
		assert.deepEqual(flags, [[], {}]);
	});
});
