/* eslint-disable no-prototype-builtins */
function isObject(obj) {
	// eslint-disable-next-line eqeqeq
	return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}

function hasOwnProperty(target, key) {
	return Object.prototype.hasOwnProperty.call(target, key);
}

function assign(target, ...sources) {
	return Object.assign(target, ...sources);
}

// eslint-disable-next-line camelcase
function _impl_assignDeep(target, source) {
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		if(isObject(source[key])) {
			if(!(key in target)) {
				assign(target, { [key]: source[key] });
			} else {
				_impl_assignDeep(target[key], source[key]);
			}
		} else {
			assign(target, { [key]: source[key] });
		}
	}

	return target;
}

function assignDeep(target, ...sources) {
	sources.forEach(source => {
		if(isObject(source)) {
			_impl_assignDeep(target, source);
		}
	});

	return target;
}

// eslint-disable-next-line camelcase
function _impl_assignDeepCheck(target, source) {
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		if(isObject(source[key])) {
			if(!(key in target)) {
				// eslint-disable-next-line max-depth, max-len, max-depth
				if(!isObject(target[key]) && target[key] !== undefined) throw new Error('Source value is object when target value is not');
				assign(target, { [key]: source[key] });
			} else {
				_impl_assignDeepCheck(target[key], source[key]);
			}
		} else {
			if(isObject(target[key])) throw new Error('Source value is not object when target value is');
			assign(target, { [key]: source[key] });
		}
	}
}

function assignDeepCheck(target, ...sources) {
	sources.forEach(source => {
		if(isObject(source)) {
			_impl_assignDeepCheck(target, source);
		}
	});

	return target;
}

function merge(...sources) {
	const output = {};
	sources.forEach(source => {
		if(isObject(source)) {
			assign(output, source);
		}
	});
	return output;
}

function mergeDeep(...sources) {
	const output = {};
	sources.forEach(source => {
		if(isObject(source)) {
			for(const key in source) {
				if(!hasOwnProperty(source, key)) continue;
				if(isObject(source[key])) {
					if(!(key in output)) {
						assign(output, { [key]: source[key] });
					} else {
						assignDeep(output[key], source[key]);
					}
				} else {
					assign(output, { [key]: source[key] });
				}
			}
		}
	});

	return output;
}

function mergeDeepCheck(...sources) {
	const output = {};
	sources.forEach(source => {
		if(isObject(source)) {
			for(const key in source) {
				if(!hasOwnProperty(source, key)) continue;
				if(isObject(source[key])) {
					if(!(key in output)) {
						// eslint-disable-next-line max-depth, max-len, max-depth
						if(!isObject(output[key]) && output[key] !== undefined) throw new Error('Source value is object when target value is not');
						assign(output, { [key]: source[key] });
					} else {
						assignDeepCheck(source[key], source[key]);
					}
				} else {
					if(isObject(output[key])) throw new Error('Source value is not object when target value is');
					assign(output, { [key]: source[key] });
				}
			}
		}
	});

	return output;
}

function map(source, mapper = val => val) {
	const output = {};
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		assign(output, { [key]: mapper(source[key], key) });
	}
	return output;
}

function filter(source, filterer = () => true) {
	const output = {};
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		if(filterer(source[key])) {
			assign(output, { [key]: source[key] });
		}
	}
	return output;
}

function filterMap(source, mapper = val => val, filterer = () => true) {
	const output = {};
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		if(filterer(source[key])) {
			assign(output, { [key]: mapper(source[key], key) });
		}
	}
	return output;
}

function mapKeys(source, fnMap = val => val) {
	const output = {};
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		const newKey = fnMap(key);
		if(newKey !== undefined) {
			assign(output, { [newKey]: source[key] });
		} else {
			assign(output, { [key]: source[key] });
		}
	}
	return output;
}

function filterKeys(source, fnBool = () => true) {
	const output = {};
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		if(fnBool(key)) {
			assign(output, { [key]: source[key] });
		}
	}
	return output;
}

function filterMapKeys(source, fnMap = val => val, fnBool = () => true) {
	const output = {};
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		const newKey = fnMap(key);
		if(fnBool(key)) {
			assign(output, { [newKey]: source[key] });
		}
	}
	return output;
}

function mapDeep(source, mapper = val => val) {
	const output = {};
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		if(isObject(source[key])) {
			output[key] = mapDeep(source[key], mapper);
		} else {
			assign(output, { [key]: mapper(source[key], key) });
		}
	}
	return output;
}

function filterDeep(source, fnBool) {
	const output = {};
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		if(isObject(source[key])) {
			output[key] = filterDeep(source[key], fnBool);
		} else if(fnBool(source[key], key)) {
			assign(output, { [key]: source[key] });
		}
	}
	return output;
}

function filterMapDeep(source, fnMap, fnBool) {
	const output = {};
	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		if(isObject(source[key])) {
			output[key] = filterMapDeep(source[key], fnBool);
		} else if(fnBool(source[key])) {
			assign(output, { [key]: fnMap(source[key], key) });
		}
	}
	return output;
}

function cleanupDeep(source) {
	// eslint-disable-next-line eqeqeq
	return filterDeep(source, val => val != null);
}

function flatten(source, joinkey = '.') {
	const result = {};

	for(const key in source) {
		if(!hasOwnProperty(source, key)) continue;
		if(isObject(source[key])) {
			const flatObject = flatten(source[key], joinkey);
			for(const fkey in flatObject) {
				if(!hasOwnProperty(flatObject, fkey)) continue;

				result[`${key}${joinkey}${fkey}`] = flatObject[fkey];
			}
		} else {
			result[key] = source[key];
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
function setValRecursive(obj, val, key1, ...keys) {
	if(keys.length === 0) {
		obj[key1] = val;
		return;
	}

	// eslint-disable-next-line eqeqeq
	if(obj[key1] == null) obj[key1] = {};

	setValRecursive(obj[key1], val, ...keys);
}

/**
 *
 * @param {Object} obj Object to traverse
 * @param {string} key1 First key
 * @param {...string} keys Other keys
 * @returns {any}
 */
function getValRecursive(obj, key1, ...keys) {
	if(keys.length === 0) {
		return obj[key1];
	}

	// eslint-disable-next-line eqeqeq
	if(obj[key1] == null) return undefined;

	return getValRecursive(obj[key1], ...keys);
}

function delValRecursive(obj, key1, ...keys) {
	if(keys.length === 0) {
		return delete obj[key1];
	}

	// eslint-disable-next-line eqeqeq
	if(obj[key1] == null) return false;

	return delValRecursive(obj[key1], ...keys);
}

/**
 * Traverses the object.
 * @param {Object} obj Object to traverse
 * @param {Function} func Function to apply
 */
function forEach(obj, func) {
	for(const key in obj) {
		if(hasOwnProperty(obj, key)) {
			func(obj[key], key);
		}
	}
}

/**
 * Traverses the object.
 * @param {Object} obj Object to traverse
 * @param {Function} func Function to apply
 */
async function forEachAsync(obj, func) {
	for(const key in obj) {
		if(hasOwnProperty(obj, key)) {
			// eslint-disable-next-line no-await-in-loop
			await func(obj[key], key);
		}
	}
}

/**
 *
 * @param {Object} obj Object to traverse
 * @param {Function} func Function to apply
 * @param {number} depth Depth of traversal
 */
function forEachAtDepth(obj, func, depth = 0) {
	if(depth <= 0) {
		forEach(obj, func);
	} else {
		for(const key in obj) {
			if(isObject(obj[key])) {
				forEachAtDepth(obj[key], func, depth - 1);
			}
		}
	}
}

function toMap(obj = {}) {
	return new Map(Object.entries(obj));
}

function toMapDeep(obj = {}) {
	const _map = new Map();
	for(const key in obj) {
		const val = obj[key];
		if(isObject(val)) {
			_map.set(key, toMapDeep(val));
		} else {
			_map.set(key, val);
		}
	}
	return _map;
}

function fromMap(_map = new Map()) {
	return Object.fromEntries(_map.entries());
}

function fromMapDeep(_map = new Map()) {
	const obj = {};
	for(const [key, val] of _map) {
		if(val instanceof Map) {
			obj[key] = fromMapDeep(val);
		} else {
			obj[key] = val;
		}
	}
	return obj;
}

module.exports = {
	isObject,
	hasOwnProperty,
	assign,
	assignDeep,
	assignDeepCheck,
	merge,
	mergeDeep,
	mergeDeepCheck,
	map,
	filter,
	filterMap,
	mapKeys,
	filterKeys,
	filterMapKeys,
	mapDeep,
	filterDeep,
	filterMapDeep,
	cleanupDeep,
	flatten,
	getValRecursive,
	setValRecursive,
	delValRecursive,
	forEach,
	forEachAsync,
	forEachAtDepth,
	toMap,
	toMapDeep,
	fromMap,
	fromMapDeep
};
