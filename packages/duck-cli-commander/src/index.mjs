import * as DuckCLI from '@produck/duck-cli';
import { T } from '@produck/mold';
import { Command } from 'commander';

const OptionalToken = value => `[${value}]`;
const RequiredToken = value => `<${value}>`;

/**
 * @param {Command} command
 * @param {DuckCLI.Bridge.Feature.Options} optionList
 */
function setOptions(command, optionList) {
	for (const option of optionList) {
		const flags = [`--${option.name}`];

		if (T.Native.String(option.alias)) {
			flags.unshift(`-${option.alias},`);
		}

		if (T.Native.String(option.value)) {
			const Token = option.allowBoolean ? OptionalToken : RequiredToken;

			flags.push(Token(option.value));
		}

		command.option(flags.join(' '), option.description, option.default);
	}
}

/**
 * @param {Command} command
 * @param {DuckCLI.Bridge.Feature.Arguments} argumentList
 */
function setArguments(command, argumentList) {
	for (const argument of argumentList) {
		const Token = argument.required ? RequiredToken : OptionalToken;
		const flags = [argument.name];

		if (argument.variadic) {
			flags.unshift('...');
		}

		const token = Token(flags.join(''));

		command.argument(token);
	}
}

/**
 * @param {Command} command
 * @param {DuckCLI.Bridge.Feature.Arguments} argumentList
 */
function setAction(command, handler) {
	command.action(function () {
		return handler(this.args, this.opts());
	});
}

export const Provider = DuckCLI.defineProvider({
	name: 'Commander',
	Builder: () => {
		const map = new Map();
		const program = new Command();

		return {
			program: ({ current, feature }) => {
				map.set(current, program);
				setArguments(program, feature.arguments);
				setOptions(program, feature.options);
				setAction(program, feature.handler);
			},
			commander: ({ parent, current, feature }) => {
				/** @type {Command} */
				const parentCommand = map.get(parent);
				const command = parentCommand.command(feature.name);

				map.set(current, command);
				command.aliases(feature.aliases);
				setArguments(command, feature.arguments);
				setOptions(command, feature.options);
				setAction(command, feature.handler);
			},
			parse: async (argv) => {
				await program.parseAsync(argv, { from: 'user' });
			},
		};
	},
});
