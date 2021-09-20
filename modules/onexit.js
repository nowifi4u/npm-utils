/* eslint-disable no-invalid-this */
const fs = require('fs');

class OnExitHandler {
	constructor(cleanupHandler, process = require('process')) {
		if(typeof cleanupHandler !== 'function') throw new TypeError('cleanupHandler must be a function');

		async function signalHandler(signal) {
			console.log(`##### signalHandler pid:[${process.pid}] signal:[${signal}] #####`);

			await cleanupHandler(signal, null);
			this.removeListeners();
			process.kill(process.pid, signal);
		}

		async function exceptionHandler(err) {
			console.log(`##### exceptionHandler pid:[${process.pid}] err:[${err}] #####`);

			await cleanupHandler('uncaughtException', err);
			process.kill(process.pid, 'SIGKILL');
		}

		async function exitHandler(exitCode) {
			console.log(`##### exitHandler pid:[${process.pid}] exitCode:[${exitCode}] #####`);

			await cleanupHandler('exit', exitCode);
		}

		const _sigintHandler = signalHandler.bind(this, 'SIGINT');
		const _sighupHandler = signalHandler.bind(this, 'SIGHUP');
		const _sigquitHandler = signalHandler.bind(this, 'SIGQUIT');
		const _sigtermHandler = signalHandler.bind(this, 'SIGTERM');
		const _sigusr1Handler = signalHandler.bind(this, 'SIGUSR1');
		const _sigusr2Handler = signalHandler.bind(this, 'SIGUSR2');

		const _exitHandler = exitHandler.bind(this);
		const _exceptionHandler = exceptionHandler.bind(this);

		this.addListeners = function() {
			console.log(`##### addListeners pid:[${process.pid}] #####`);

			process.on('SIGINT', _sigintHandler);
			process.on('SIGHUP', _sighupHandler);
			process.on('SIGQUIT', _sigquitHandler);
			process.on('SIGTERM', _sigtermHandler);
			process.on('SIGUSR1', _sigusr1Handler);
			process.on('SIGUSR2', _sigusr2Handler);

			process.on('exit', _exitHandler);
			process.on('uncaughtException', _exceptionHandler);
		};

		this.removeListeners = function() {
			console.log(`##### removeListeners pid:[${process.pid}] #####`);

			process.removeListener('SIGINT', _sigintHandler);
			process.removeListener('SIGHUP', _sighupHandler);
			process.removeListener('SIGQUIT', _sigquitHandler);
			process.removeListener('SIGTERM', _sigtermHandler);
			process.removeListener('SIGUSR1', _sigusr1Handler);
			process.removeListener('SIGUSR2', _sigusr2Handler);

			process.removeListener('exit', _exitHandler);
			process.removeListener('uncaughtException', _exceptionHandler);
		};

		this.addListeners();
	}
}

module.exports = OnExitHandler;
