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

exports.clamp = function(val, min, max) {
	if(val < min) return min;
	if(val > max) return max;
	return val;
};

exports.cycleClamp = function(val, min, max) {
	if(val < min) {
		const dist = min - val;
		const size = max - min;
		const loops = dist / size;
		const delta = loops - Math.floor(loops);
		return max - (delta * size);
	}
	if(val > max) {
		const dist = val - max;
		const size = max - min;
		const loops = dist / size;
		const delta = loops - Math.floor(loops);
		return min + (delta * size);
	}
	return val;
};
