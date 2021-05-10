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
