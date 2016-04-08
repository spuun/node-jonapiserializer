var assert = require('assert');
var serializer = require('../');

describe('jonserialize', function() {
	it ('should serialize simple object', () => {
		var obj = {
			a: function() {},
			b: function() {},
			c: function() {}
		};
		
		var serialized = serializer.serialize(obj);

		assert.deepEqual(serialized, {'a':'a','b':'b','c':'c'});
	});

	it ('should serialize nestled 1 lvl object', () => {
		var obj = {
			a: function() {},
			b: function() {},
			c: {
				c1: function() {},
				c2: function() {}
			},
			d: function() {}
		};
		
		var serialized = serializer.serialize(obj);

		assert.deepEqual(serialized, {
			'a':'a',
			'b':'b',
			'c': {
				'c1': 'c1',
				'c2': 'c2'
			},
			'd':'d'
		});
	});

	it ('should serialize nestled 2 lvl object', () => {
		var obj = {
			a: function() {},
			b: function() {},
			c: {
				c1: function() {},
				c2: {
					c21: function() {},
					c22: function() {}
				}
			},
			d: function() {}
		};
		
		var serialized = serializer.serialize(obj);

		assert.deepEqual(serialized, {
			'a':'a',
			'b':'b',
			'c': {
				'c1': 'c1',
				'c2': {
					'c21': 'c21',
					'c22': 'c22',
				}
			},
			'd':'d'
		});
	});

	it ('should derserialize simple', () => {
		var data = {
			'a': 'a',
			'b': 'b',
			'c': 'c'
		};

		var obj = serializer.deserialize(data);

		assert.deepEqual(Object.keys(obj), ['a','b','c']);
		assert.equal(typeof obj['a'], 'function');
		assert.equal(typeof obj['b'], 'function');
		assert.equal(typeof obj['c'], 'function');
	});

	it ('should derserialize 2 level', () => {
		var data = {
			'a': 'a',
			'b': 'b',
			'c': {
				'c1': 'c1',
				'c2': 'c2',
			},
			'd': 'd'
		};

		var obj = serializer.deserialize(data);

		assert.deepEqual(Object.keys(obj), ['a','b','c', 'd']);
		assert.deepEqual(Object.keys(obj['c']), ['c1', 'c2']);
		assert.equal(typeof obj.a, 'function');
		assert.equal(typeof obj.b, 'function');
		assert.equal(typeof obj.c.c1, 'function');
		assert.equal(typeof obj.c.c2, 'function');
		assert.equal(typeof obj.d, 'function');
	});

	it ('should derserialize 3 level', () => {
		var data = {
			'a': 'a',
			'b': 'b',
			'c': {
				'c1': 'c1',
				'c2': {
					'c21': 'c21',
					'c22': 'c22'	
				},
			},
			'd': 'd'
		};

		var obj = serializer.deserialize(data);

		assert.deepEqual(Object.keys(obj), ['a','b','c', 'd']);
		assert.deepEqual(Object.keys(obj.c), ['c1', 'c2']);
		assert.deepEqual(Object.keys(obj.c.c2), ['c21', 'c22']);
		assert.equal(typeof obj.a, 'function');
		assert.equal(typeof obj.b, 'function');
		assert.equal(typeof obj.c.c1, 'function');
		assert.equal(typeof obj.c.c2.c21, 'function');
		assert.equal(typeof obj.c.c2.c22, 'function');
		assert.equal(typeof obj.d, 'function');
	});

	it('should call handler in deserialized api basic', () => {
			var data = {
				'a': 'a'
			};

			var val = '';
			var api = serializer.deserialize(data, function(methodName) {
				val = methodName;
			});
			api.a();
			assert.equal(val, 'a');
	});
	it('should call handler in deserialized api level 2', () => {
			var data = {
				'a': {
					'a1': 'a1' 
				}
			};

			var val = '';
			var api = serializer.deserialize(data, function(methodName) {
				val = methodName;
			});
			api.a.a1();
			assert.equal(val, 'a.a1');
	});
	it('should call handler in deserialized with args', () => {
			var data = {
				'a': 'a'
			};
			var testArgs = ['arg1','arg2'];

			var val = '';
			var api = serializer.deserialize(data, function(methodName, args) {
				val = args;
			});
			api.a(...testArgs);
			assert.deepEqual(val, testArgs);
	});

});
