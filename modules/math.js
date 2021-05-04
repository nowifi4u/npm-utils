exports.mapRangeToUnit = function(val, min, max) {
	return (val - min) / (max - min);
};

exports.mapFunctionRangeToUnit = function(fn, min, max) {
	return (...params) => exports.mapFunctionRangeToUnit(fn(...params), min, max);
};

exports.mapRangeFromUnit = function(val, min, max) {
	return min + (val * (max - min));
};

exports.mapFunctionRangeFromUnit = function(fn, min, max) {
	return (...params) => exports.mapFunctionRangeFromUnit(fn(...params), min, max);
};

exports.mapRange = function(val, min1, max1, min2, max2) {
	return exports.mapRangeFromUnit(exports.mapRangeToUnit(val, min1, max1), min2, max2);
};

exports.mapFunctionRange = function(fn, min1, max1, min2, max2) {
	return (...params) => exports.mapRange(fn(...params), min1, max1, min2, max2);
};
