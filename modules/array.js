/**
 * @param {any[]} arr - Array to be forEach'd
 * @param {Function} func - Function to pass the array values to
 */
exports.forEachAsync = async function(arr, func) {
	for(let idx = 0; idx < arr.length; idx++) {
		// eslint-disable-next-line no-await-in-loop
		await func(arr[idx], idx);
	}
};

exports.makeGenerator = function*(arr) {
	yield* arr;
};

/**
 * @param {any[]} array - Array to be shuffled
 * @returns {any[]}
 */
exports.shuffle = function(array) {
	array = array.slice(0);
	for(let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

/**
 * @generator
 * @param {any[]} array - Array to be shuffled
 * @yields {any}
 */
exports.shuffleGenerator = function*(array) {
	yield* exports.shuffle(array);
};

/**
 * @param {number} size - Size of the array
 * @returns {number[]}
 */
exports.shuffleIndexes = function(size) {
	return exports.shuffle(Array.from(Array(size).keys()));
};

/**
 * @generator
 * @param {number} size - Size of the array
 * @yields {number}
 */
exports.shuffleIndexesGenerator = function*(size) {
	yield* exports.shuffleIndexes(size);
};
