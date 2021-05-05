/* eslint-disable eqeqeq */
function isObject(obj) {
	return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}

exports.hasOwnProperty = function(target, key) {
	return Object.prototype.hasOwnProperty.call(target, key);
};

function _impl_assignDeep(target, source) {
	for(const key in source) {
		if(isObject(source[key])) {
			if(!(key in target)) {
				Object.assign(target, { [key]: source[key] });
			} else {
				exports.assignDeep(target[key], source[key]);
			}
		} else {
			Object.assign(target, { [key]: source[key] });
		}
	}

	return target;
}

exports.assignDeep = function(target, ...sources) {
	sources.forEach(source => {
		if(isObject(source)) {
			_impl_assignDeep(target, source);
		}
	});

	return target;
};

function _impl_assignDeepCheck(target, source) {
	for(const key in source) {
		if(isObject(source[key])) {
			if(!(key in target)) {
				if(!isObject(target[key]) && target[key] !== undefined) throw new Error('Source value is object when target value is not');
				Object.assign(target, { [key]: source[key] });
			} else {
				exports.assignDeepCheck(target[key], source[key]);
			}
		} else {
			if(isObject(target[key])) throw new Error('Source value is not object when target value is');
			Object.assign(target, { [key]: source[key] });
		}
	}
}

exports.assignDeepCheck = function(target, ...sources) {
	sources.forEach(source => {
		if(isObject(source)) {
			_impl_assignDeepCheck(target, sources);
		}
	});

	return target;
};

exports.merge = function(...sources) {
	const output = {};
	sources.forEach(source => {
		if(isObject(source)) {
			Object.assign(output, source);
		}
	});
	return output;
};

exports.mergeDeep = function(...sources) {
	const output = {};
	sources.forEach(source => {
		if(isObject(source)) {
			for(const key in source) {
				if(isObject(source[key])) {
					if(!(key in output)) {
						Object.assign(output, { [key]: source[key] });
					} else {
						exports.assignDeep(output[key], source[key]);
					}
				} else {
					Object.assign(output, { [key]: source[key] });
				}
			}
		}
	});

	return output;
};

exports.mergeDeepCheck = function(...sources) {
	const output = {};
	sources.forEach(source => {
		if(isObject(source)) {
			for(const key in source) {
				if(isObject(source[key])) {
					if(!(key in output)) {
						if(!isObject(output[key]) && output[key] !== undefined) throw new Error('Source value is object when target value is not');
						Object.assign(output, { [key]: source[key] });
					} else {
						exports.assignDeepCheck(source[key], source[key]);
					}
				} else {
					if(isObject(output[key])) throw new Error('Source value is not object when target value is');
					Object.assign(output, { [key]: source[key] });
				}
			}
		}
	});

	return output;
};

exports.map = function(source, fnMap) {
	const output = new source.constructor();
	for(const key in source) {
		Object.assign(output, { [key]: fnMap(source[key]) });
	}
	return output;
};

exports.filter = function(source, fnBool) {
	const output = new source.constructor();
	for(const key in source) {
		if(fnBool(source[key])) {
			Object.assign(output, { [key]: source[key] });
		}
	}
	return output;
};

exports.filterMap = function(source, fnMap, fnFilter) {
	const output = new source.constructor();
	for(const key in source) {
		if(fnFilter(source[key])) {
			Object.assign(output, { [key]: fnMap(source[key]) });
		}
	}
	return output;
};

exports.mapDeep = function(source, fnMap) {
	const output = new source.constructor();
	for(const key in source) {
		if(isObject(source[key])) {
			output[key] = exports.mapDeep(source[key], fnMap);
		} else {
			Object.assign(output, { [key]: fnMap(source[key]) });
		}
	}
	return output;
};

exports.mapKeys = function(source, fnMap) {
	const output = new source.constructor();
	for(const key in source) {
		const newKey = fnMap(key);
		if(newKey !== undefined) {
			Object.assign(output, { [newKey]: source[key] });
		} else {
			Object.assign(output, { [key]: source[key] });
		}
	}
	return output;
};

exports.filterKeys = function(source, fnBool) {
	const output = new source.constructor();
	for(const key in source) {
		if(fnBool(key)) {
			Object.assign(output, { [key]: source[key] });
		}
	}
	return output;
};

exports.filterMapKeys = function(source, fnMap, fnBool) {
	const output = new source.constructor();
	for(const key in source) {
		const newKey = fnMap(key);
		if(fnBool(key)) {
			Object.assign(output, { [newKey]: source[key] });
		}
	}
	return output;
};

exports.mapInKeys = function(source, keyMap = {}) {
	const output = new source.constructor();
	for(const key in source) {
		if(key in keyMap) {
			Object.assign(output, { [keyMap[key]]: source[key] });
		} else {
			Object.assign(output, { [key]: source[key] });
		}
	}
	return output;
};

exports.filterInKeys = function(source, keyMap = {}) {
	const output = new source.constructor();
	for(const key in source) {
		if(key in keyMap) {
			Object.assign(output, { [key]: source[key] });
		}
	}
	return output;
};

exports.filterMapInKeys = function(source, keyMap = {}) {
	const output = new source.constructor();
	for(const key in source) {
		if(key in keyMap) {
			Object.assign(output, { [keyMap[key]]: source[key] });
		}
	}
	return output;
};

exports.filterDeep = function(source, fnBool) {
	const output = new source.constructor();
	for(const key in source) {
		if(isObject(source[key])) {
			output[key] = exports.filterDeep(source[key], fnBool);
		} else if(fnBool(source[key])) {
			Object.assign(output, { [key]: source[key] });
		}
	}
	return output;
};

exports.filterMapDeep = function(source, fnMap, fnBool) {
	const output = new source.constructor();
	for(const key in source) {
		if(isObject(source[key])) {
			output[key] = exports.filterMapDeep(source[key], fnBool);
		} else if(fnBool(source[key])) {
			Object.assign(output, { [key]: fnMap(source[key]) });
		}
	}
	return output;
};

exports.cleanupDeep = function(source) {
	return exports.filterDeep(source, val => val != null);
};

exports.flattenObject = function(source) {
	const result = new source.constructor();

	for(const key in source) {
		if(isObject(source[key])) {
			const flatObject = exports.flattenObject(source[key]);
			for(const fkey in flatObject) {
				if(!exports.hasOwnProperty(flatObject, fkey)) continue;

				result[`${key}.${fkey}`] = flatObject[fkey];
			}
		} else {
			result[key] = source[key];
		}
	}
	return result;
};

/**
 *
 * @param {Object} obj Object to traverse
 * @param {any} val Value to set
 * @param {any} key1 First key
 * @param  {...any} keys Other keys
 */
exports.setValRecursive = function(obj, val, key1, ...keys) {
	if(keys.length === 0) {
		obj[key1] = val;
		return;
	}

	if(obj[key1] == null) obj[key1] = {};

	exports.setValRecursive(obj[key1], val, ...keys);
};

/**
 *
 * @param {Object} obj Object to traverse
 * @param {string} key1 First key
 * @param {...string} keys Other keys
 * @returns {any}
 */
exports.getValRecursive = function(obj, key1, ...keys) {
	if(keys.length === 0) {
		return obj[key1];
	}

	if(obj[key1] == null) return undefined;

	return exports.getValRecursive(obj[key1], ...keys);
};

exports.delValRecursive = function(obj, key1, ...keys) {
	if(keys.length === 0) {
		return delete obj[key1];
	}

	if(obj[key1] == null) return false;

	return exports.delValRecursive(obj[key1], ...keys);
};

/**
 * Traverses the object.
 * If function returns a non-undefined value sets its value to the result of the function
 * @param {Object} obj Object to traverse
 * @param {Function} func Function to apply
 */
exports.forEach = function(obj, func) {
	for(const key in obj) {
		if(exports.hasOwnProperty(obj, key)) {
			const result = func(key, obj[key]);
			if(result !== undefined) {
				obj[key] = result;
			}
		}
	}
};

/**
 *
 * @param {Object} obj Object to traverse
 * @param {Function} func Function to apply
 * @param {number} depth Depth of traversal
 */
exports.forEachVarRecursiveDepth = function(obj, func, depth = 0) {
	if(depth <= 0) {
		exports.forEach(obj, func);
	} else {
		for(const key in obj) {
			if(isObject(obj[key])) {
				exports.forEachVarRecursiveDepth(obj[key], func, depth - 1);
			}
		}
	}
};
