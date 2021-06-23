const fs = require('fs-extra');
const path = require('path');

module.exports = function(prefix = 'undefined', config = {}) {
	config = {
		timeZone: 'UTC', logdir: undefined, loglevel: 5,
		...config
	};

	function getDateString(date = new Date()) {
		// eslint-disable-next-line max-len
		return date.toLocaleDateString('lt-LT', { day: '2-digit', month: '2-digit', year: 'numeric', hour12: false, timeZone: config.timeZone });
	}

	function getTimeString(date = new Date()) {
		// eslint-disable-next-line max-len
		return `${date.toLocaleTimeString('lt-LT', { second: '2-digit', minute: '2-digit', hour: '2-digit', hour12: false })}.${date.getMilliseconds().toString().padStart(3, '0')}`;
	}

	function ensureLogDir(nowdate) {
		const filepath = path.join(config.logdir, nowdate.replace(/\//, '.'));
		fs.ensureDirSync(filepath);
		return filepath;
	}

	let curDay;
	let curDayLogFile;

	function ensureLogFile(id) {
		const filepath = path.join(curDayLogFile, `${id}.log`);
		fs.ensureFileSync(filepath);
		return filepath;
	}

	function updateCurrentDay(now = new Date()) {
		const nowdate = getDateString(now);
		if(config.logdir) curDayLogFile = ensureLogDir(nowdate);
		console.log('Date: ', nowdate);
		curDay = new Date().getDate();
	}

	updateCurrentDay();

	function errorHandler(err) {
		if(err) console.log(err);
	}

	async function appendLogFile(id, content = '') {
		const filepath = ensureLogFile(id);
		await fs.appendFile(filepath, content, errorHandler);
	}

	function leveledLog(iprefix) {
		return function(id, ...msg) {
			const now = new Date();
			const nowtime = getTimeString(now);

			if(now.getDate() !== curDay) {
				updateCurrentDay(now);
			}

			const content = `[${nowtime}] [${iprefix}/${prefix}] ${msg.join(' ')}`;
			console.log(`[${id}] ${content}`);
			if(config.logdir) {
				appendLogFile(id, `${content}\n`);
			}

			return this;
		};
	}

	function noop() {
		return this;
	}

	function makeLeveledLog(iloglevel, iprefix) {
		return config.loglevel >= iloglevel ? leveledLog(iprefix).bind(this) : noop.bind(this);
	}

	const obj = {};
	obj.error = makeLeveledLog(1, 'ERROR').bind(obj);
	obj.warn = makeLeveledLog(2, 'WARN').bind(obj);
	obj.info = makeLeveledLog(3, 'INFO').bind(obj);
	obj.debug = makeLeveledLog(4, 'DEBUG').bind(obj);

	return obj;
};
