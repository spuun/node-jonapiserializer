'use strict';
var serialize = obj => {
	var _serialize = (obj) => {
		var ret = {};
		Object.keys(obj).forEach(x => {
			if (typeof obj[x] == 'function') {
				ret[x] = x;
			} else {
				ret[x] = _serialize(obj[x]);
			}
		});
		return ret;
	};
	return _serialize(obj);
};

var deserialize = (obj, handler) => {
	var _deserialize = (obj, handler, prefix) => {
		prefix = prefix || []; 
		var ret = {};
		Object.keys(obj).forEach(x => {
			if (typeof obj[x] != 'string') {
				ret[x] = _deserialize(obj[x], handler, [...prefix, x]);
			} else {
				let methodName = [...prefix, x].join('.');
				ret[x] = function() {
					var args = [];
					for (var i=0;i<arguments.length;++i) {
						args.push(arguments[i]);
					}
					handler(methodName, args);
				};
			}
		});
		return ret;
	};
	return _deserialize(obj, handler);
};

module.exports = {
	serialize,
	deserialize
};
