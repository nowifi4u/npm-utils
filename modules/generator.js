/**
 * @param {GeneratorFunction} genfunc - Generator function to be cycled
 * @param  {...any} params - Parameters to be passed to the generator
 * @yields {*}
 * @generator
 */
exports.cycleGenerator = function*(genfunc, ...params) {
	while(true) {
		const generator = genfunc(...params);
		yield* generator;
	}
};

/**
 * @param {Generator} gen - Generator to be cycled
 * @param {Function} func - Function to be passed the values to
 */
exports.forEach = function(gen, func) {
	for(const val of gen) {
		func(val);
	}
};

/**
 * @param {Generator} gen - Generator to be cycled
 * @param {Function} func - Function to be passed the values to
 * @param {?number} limit - Limit to the number of times the function can be called
 */
exports.forEachLimited = function(gen, func, limit = Infinity) {
	let val = gen.next();
	for(let idx = 0; idx < limit && !val.done; idx++) {
		func(val.value, idx);
		val = gen.next();
	}
};

exports.rangeGenerator = function*({ min = 0, max = 0, step = 1 } = {}) {
	if(step < 0) {
		[min, max] = [max, min];
		step = -step;
	}
	for(let idx = min; idx < max; idx += step) {
		yield idx;
	}
};
