import * as DuckLog from '@produck/duck-log';
import * as Quack from '@produck/quack';

export function Transcriber(options = {}) {
	const finalOptions = Quack.Options.normalize(options);

	return DuckLog.defineTranscriber(function QuackTranscriber() {
		const logger = new Quack.Logger(finalOptions);

		return (label, level, time, message) => {
			logger.log({ label, level, time }, message);
		};
	});
}
