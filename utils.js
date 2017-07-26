module.exports.objToArray = function objToArray(obj) {
	return Object.keys(obj).map((k) => obj[k]);
};