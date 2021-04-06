/* eslint-disable eqeqeq */
function isObject(obj) {
	return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}

exports.hasOwnProperty = function(target, key) {
	return Object.prototype.hasOwnProperty.call(target, key);
};

exports.assignDeep = function(target, ...sources) {
	if(isObject(target)) {
		sources.forEach(source => {
			if(isObject(source)) {
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
			}
		});
	}

	return target;
};

exports.assignDeepCheck = function(target, ...sources) {
	if(isObject(target)) {
		sources.forEach(source => {
			if(isObject(source)) {
				for(const key in source) {
					if(isObject(source[key])) {
						if(!(key in target)) {
							if(!isObject(target[key])) throw new Error('Source value is object when target value is not');
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
		});
	}

	return target;
};

exports.merge = function(...sources) {
	return Object.assign({}, ...sources);
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
						output[key] = exports.mergeDeep(output[key], source[key]);
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
						if(!isObject(output[key])) throw new Error('Source value is object when target value is not');
						Object.assign(output, { [key]: source[key] });
					} else {
						output[key] = exports.mergeDeepCheck(output[key], source[key]);
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
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			Object.assign(output, { [key]: fnMap(source[key]) });
		}
	}
	return output;
};

exports.filter = function(source, fnFilter) {
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			if(fnFilter(source[key])) {
				Object.assign(output, { [key]: source[key] });
			}
		}
	}
	return output;
};

exports.filterMap = function(source, fnMap, fnFilter) {
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			if(fnFilter(source[key])) {
				Object.assign(output, { [key]: fnMap(source[key]) });
			}
		}
	}
	return output;
};

function _mapDeep(source, fnMap) {
	const output = {};
	for(const key in source) {
		if(isObject(source[key])) {
			if(isObject(source[key])) {
				output[key] = exports.mapDeep(output[key], fnMap);
			} else {
				Object.assign(output, { [key]: fnMap(source[key]) });
			}
		}
	}
	return output;
}

exports.mapDeep = function(source, fnMap) {
	const output = {};
	if(isObject(source)) {
		return _mapDeep(source, fnMap);
	}
	return output;
};

exports.mapKeys = function(source, fnMap) {
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			const newKey = fnMap(key);
			if(newKey !== undefined) {
				Object.assign(output, { [newKey]: source[key] });
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		}
	}
};

exports.filterKeys = function(source, fnFilter) {
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			if(fnFilter(key)) {
				Object.assign(output, { [key]: source[key] });
			}
		}
	}
};

exports.filterMapKeys = function(source, fnMap, fnFilter) {
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			const newKey = fnMap(key);
			if(fnFilter(key)) {
				Object.assign(output, { [newKey]: source[key] });
			}
		}
	}
};

exports.mapInKeys = function(source, keyMap = {}) {
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			if(key in keyMap) {
				Object.assign(output, { [keyMap[key]]: source[key] });
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		}
	}
};

exports.filterInKeys = function(source, keyMap = {}) {
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			if(key in keyMap) {
				Object.assign(output, { [key]: source[key] });
			}
		}
	}
};

exports.filterMapInKeys = function(source, keyMap = {}) {
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			if(key in keyMap) {
				Object.assign(output, { [keyMap[key]]: source[key] });
			}
		}
	}
};

function _filterDeep(source, fnFilter) {
	const output = {};
	for(const key in source) {
		if(isObject(source[key])) {
			if(isObject(source[key])) {
				output[key] = exports.filterDeep(output[key], fnFilter);
			} else if(fnFilter(source[key])) {
				Object.assign(output, { [key]: source[key] });
			}
		}
	}
	return output;
}

exports.filterDeep = function(source, fnBool) {
	const output = {};
	if(isObject(source)) {
		return _filterDeep(source, fnBool);
	}
	return output;
};

exports.filterMapDeep = function(source, fnMap, fnFilter) {
	const output = {};
	if(isObject(source)) {
		for(const key in source) {
			if(isObject(source[key])) {
				if(isObject(source[key])) {
					output[key] = exports.filterMapDeep(output[key], fnFilter);
				} else if(fnFilter(source[key])) {
					Object.assign(output, { [key]: fnMap(source[key]) });
				}
			}
		}
	}
	return output;
};

exports.cleanupDeep = function(source) {
	return exports.filterDeep(source, val => {
		if(val != null) return true;
		return false;
	});
};

exports.flattenObject = function(source) {
	const result = {};

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
 * @param {(key:any, value:any) => any | undefined} func Function to apply
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
 * @param {(key:any, value:any) => any} func Function to apply
 * @param {number} depth Depth of traversal
 */
exports.forEachVarRecursiveDepth = function(obj, func, depth = 0) {
	if(depth <= 0) {
		exports.forEach(obj, func);
	} else {
		for(const key in obj) {
			if(typeof obj[key] === 'object') {
				exports.forEachVarRecursiveDepth(obj[key], func, depth - 1);
			}
		}
	}
};
