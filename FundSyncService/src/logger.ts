import chalk from 'chalk';

export class logger {
	private SystemConfig = chalk.bold.underline.white.bgMagenta;
	private ErrorConfig = chalk.bold.red;
	private InformationConfig = chalk.white;
	private DataConfig = chalk.blue;
	private SuccessConfig = chalk.green;

	public System(message) {
		console.log(this.SystemConfig(message));
	}

	public Error(message) {
		console.log(this.ErrorConfig(message));
	}

	public Information(message) {
		console.log(this.InformationConfig(message));
	}

	public Data(message) {
		console.log(this.DataConfig(message));
	}

	public Success(message) {
		console.log(this.SuccessConfig(message));
	}

}
