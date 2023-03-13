import * as DuckCLI from '@produck/duck-cli';
import { T } from '@produck/mold';
import { Command, Option, Argument } from 'commander';

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

		const hasValue = !T.Helper.Null(option.value);

		if (hasValue) {
			const valueOptions = option.value;
			const tokens = [valueOptions.name];
			const Token = valueOptions.required ? RequiredToken : OptionalToken;

			if (valueOptions.variadic) {
				tokens.unshift('...');
			}

			flags.push(Token(tokens.join('')));
		}

		const args = [flags.join(' ')];

		if (typeof option.description === 'string') {
			args.push(option.description);
		}

		const opt = new Option(...args);

		opt.mandatory = option.required;

		if (hasValue && !T.Helper.Null(option.value.default)) {
			opt.default(option.value.default);
		}

		command.addOption(opt);
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
		const args = [token];

		if (T.Native.String(argument.description)) {
			args.push(argument.description);
		}

		const arg = new Argument(...args);

		if (!T.Helper.Null(argument.default)) {
			arg.default(argument.default);
		}

		command.addArgument(arg);
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
			commander: ({ parent, current, feature, isDefault }) => {
				/** @type {Command} */
				const parentCommand = map.get(parent);
				const command = parentCommand.command(feature.name, { isDefault });

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
