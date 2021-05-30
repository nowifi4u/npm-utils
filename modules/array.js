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

// eslint-disable-next-line camelcase
function* _impl_allPossibleChunksBigLittleGenerator(arr = [], istart = arr.length, pchain = []) {
	if(istart <= 0) {
		yield pchain;
	} else {
		for(let idx = istart; idx >= 1; idx--) {
			const chain = [arr.slice(idx - 1, istart), ...pchain];
			yield* _impl_allPossibleChunksBigLittleGenerator(arr, idx - 1, chain);
		}
	}
}

/**
 * @generator
 * @param {any[]} arr - Array to be used
 * @param {number} istart - Start of the splitting
 * @yields {any[][]}
 */
exports.allPossibleChunksBigLittleGenerator = function*(arr = [], istart = arr.length) {
	yield* _impl_allPossibleChunksBigLittleGenerator(arr, istart);
};

// eslint-disable-next-line camelcase
function* _impl_allPossibleChunksLittleBigGenerator(arr = [], istart = 0, pchain = []) {
	if(istart < arr.length) {
		for(let idx = istart; idx < arr.length; idx++) {
			const chain = [...pchain, arr.slice(istart, idx + 1)];
			yield* _impl_allPossibleChunksLittleBigGenerator(arr, idx + 1, chain);
		}
	} else {
		yield pchain;
	}
}

/**
 * @generator
 * @param {any[]} arr - Array to be used
 * @param {number} istart - Start of the splitting
 * @yields {any[][]}
 */
exports.allPossibleChunksLittleBigGenerator = function*(arr = [], istart = 0) {
	yield* _impl_allPossibleChunksLittleBigGenerator(arr, istart);
};

// eslint-disable-next-line camelcase
function* _impl_allPossibleChunksBigLittleGeneratorReverse(arr = [], istart = arr.length, pchain = []) {
	if(istart <= 0) {
		yield pchain;
	} else {
		for(let idx = 1; idx <= istart; idx++) {
			const chain = [arr.slice(idx - 1, istart), ...pchain];
			yield* _impl_allPossibleChunksBigLittleGeneratorReverse(arr, idx - 1, chain);
		}
	}
}

/**
 * @generator
 * @param {any[]} arr - Array to be used
 * @param {number} istart - Start of the splitting
 * @yields {any[][]}
 */
exports.allPossibleChunksBigLittleGeneratorReverse = function*(arr = [], istart = arr.length) {
	yield* _impl_allPossibleChunksBigLittleGeneratorReverse(arr, istart);
};

// eslint-disable-next-line camelcase
function* _impl_allPossibleChunksLittleBigGeneratorReverse(arr = [], istart = 0, pchain = []) {
	if(istart < arr.length) {
		for(let idx = arr.length; idx >= istart; idx--) {
			const chain = [...pchain, arr.slice(istart, idx + 1)];
			yield* _impl_allPossibleChunksLittleBigGeneratorReverse(arr, idx + 1, chain);
		}
	} else {
		yield pchain;
	}
}

/**
 * @generator
 * @param {any[]} arr - Array to be used
 * @param {number} istart - Start of the splitting
 * @yields {any[][]}
 */
exports.allPossibleChunksLittleBigGeneratorReverse = function*(arr = [], istart = 0) {
	yield* _impl_allPossibleChunksLittleBigGeneratorReverse(arr, istart);
};
