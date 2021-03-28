function isObject(obj, key) {
	return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}

const hasOwnProperty = Object.prototype.hasOwnProperty.call;

exports.assignDeep = function(target, ...sources) {
	if(isObject(target)) {
		sources.forEach(source => {
			if(isObject(source)) {
				Object.keys(source).forEach(key => {
					if(isObject(source[key])) {
						if(!(key in target)) {
							Object.assign(target, { [key]: source[key] });
						} else {
							exports.assignDeep(target[key], source[key]);
						}
					} else {
						Object.assign(target, { [key]: source[key] });
					}
				});
			}
		});
	}

	return target;
}

exports.assignDeepCheck = function(target, ...sources) {
	if(isObject(target)) {
		sources.forEach(source => {
			if(isObject(source)) {
				Object.keys(source).forEach(key => {
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
				});
			}
		});
	}

	return target;
}

exports.merge = function(...sources) {
	return Object.assign({}, ...sources);
}

exports.mergeDeep = function(...sources) {
	const output = {};
	sources.forEach(source => {
		if(isObject(source)) {
			Object.keys(source).forEach(key => {
				if(isObject(source[key])) {
					if(!(key in output)) {
						Object.assign(output, { [key]: source[key] });
					} else {
						output[key] = exports.mergeDeep(output[key], source[key]);
					}
				} else {
					Object.assign(output, { [key]: source[key] });
				}
			});
		}
	});

	return output;
}

exports.mergeDeepCheck = function(...sources) {
	const output = {};
	sources.forEach(source => {
		if(isObject(source)) {
			Object.keys(source).forEach(key => {
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
			});
		}
	});

	return output;
}

exports.mapDeep = function(source, fn_map) {
	const output = {};
	if(isObject(source)) {
		Object.keys(source).forEach(key => {
			if(isObject(source[key])) {
				if(isObject(source[key])) {
					output[key] = exports.mapDeep(output[key], fn_map);
				} else {
					Object.assign(output, { [key]: fn_map(source[key]) });
				}
			}
		});
	}
	return output;
}

exports.filterDeep = function(source, fn_bool) {
	const output = {};
	if(isObject(source)) {
		Object.keys(source).forEach(key => {
			if(isObject(source[key])) {
				if(isObject(source[key])) {
					output[key] = exports.filterDeep(output[key], fn_bool);
				} else {
					if(fn_bool(source[key])) {
						Object.assign(output, { [key]: source[key] });
					}
				}
			}
		});
	}
	return output;
}

exports.filterMapDeep = function(source, fn_map, fn_bool) {
	const output = {};
	if(isObject(source)) {
		Object.keys(source).forEach(key => {
			if(isObject(source[key])) {
				if(isObject(source[key])) {
					output[key] = exports.filterMapDeep(output[key], fn_bool);
				} else {
					if(fn_bool(source[key])) {
						Object.assign(output, { [key]: fn_map(source[key]) });
					}
				}
			}
		});
	}
	return output;
}

exports.cleanupDeep = function(source) {
	return exports.filterDeep(source, (val) => {
		if(val != null) return true;
		return false;
	});
}

exports.flattenObject = function(target) {
	const result = {};

	for(const key in target) {
		if(isObject(target[key])) {
			const flatObject = exports.flattenObject(target[key]);
			for(const fkey in flatObject) {
				if(!hasOwnProperty(flatObject, fkey)) continue;

				result[`${key}.${fkey}`] = flatObject[fkey];
			}
		} else {
			result[key] = target[key];
		}
	}

	return result;
}

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

	return exports.setValRecursive(obj[key1], val, ...keys);
}

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
}

exports.delValRecursive = function(obj, key1, ...keys) {
	if(keys.length === 0) {
		return delete obj[key1];
	}

	if(obj[key1] == null) return false;

	return exports.delValRecursive(obj[key1], ...keys);
}

/**
 * Traverses the object.
 * If function returns a non-undefined value sets its value to the result of the function
 * @param {Object} obj Object to traverse
 * @param {(key:any, value:any) => any | undefined} func Function to apply
 */
exports.forEach = function(obj, func) {
	for(const key in obj) {
		if(hasOwnProperty(obj, key)) {
			const result = func(key, obj[key]);
			if(result !== undefined) {
				obj[key] = result;
			}
		}
	}
}

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
}
