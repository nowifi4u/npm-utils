/**
 * @param {*} gen - Generator to be cycles
 * @param  {...any} params - Parameters to be passed to the generator
 * @yields {*}
 * @generator
 */
exports.cycleGenerator = function*(gen, ...params) {
	while(true) {
		const generator = gen(...params);
		yield* generator;
	}
};
