var assert = require('assert');
var p = require('../seamless-fantasy.js');

var equals = p.equals;
var concat = p.concat;
var empty = p.empty;
var map = p.map;
var ap = p.ap;
var of = p.of;
var reduce = p.reduce;
var sequence = p.sequence;
var chain = p.chain;

function double(n) {
  return n * 2;
}

function add(n, m) {
  return n + m;
}

function addTwo(n) {
  return n + 2;
}

describe('numbers', function() {
  describe('equals', function() {
    it('is equal if same number', function() {
      assert.strictEqual(equals(12, 13), false);
      assert.strictEqual(equals(7, 7), true);
      assert.strictEqual(equals(12, -12), false);
      assert.strictEqual(equals(0, 0), true);
    });
  });
  describe('concat', function() {
    it('add numbers', function() {
      assert.strictEqual(concat(1, 3), 4);
      assert.strictEqual(concat(-17, 17), 0);
    });
  });
  describe('empty', function() {
    it('is zero', function() {
      assert.strictEqual(empty(12), 0);
      assert.strictEqual(empty(-17), 0);
    });
  });
});

describe('string', function() {
  describe('equals', function() {
    it('is equal if same string', function() {
      assert.strictEqual(equals('hello', 'there'), false);
      assert.strictEqual(equals('hello', 'hello'), true);
    });
  });
  describe('concat', function() {
    it('concatenates strings', function() {
      assert.strictEqual(concat('hello ', 'world'), 'hello world');
      assert.strictEqual(concat('', 'foo'), 'foo');
    });
  });
  describe('empty', function() {
    it('is empty string', function() {
      assert.strictEqual(empty('hello'), '');
      assert.strictEqual(empty('rabbit'), '');
    });
  });
});

describe('array', function() {
  describe('equals', function() {
    it('is equal if elements are equal', function() {
      assert.strictEqual(equals([1, 2, 3], [1, 2, 1]), false);
      assert.strictEqual(equals([], []), true);
      assert.strictEqual(equals([], [4, 5]), false);
      assert.strictEqual(equals([1, 2, 3], [1, 2, 3]), true);
    });
  });
  describe('concat', function() {
    it('concatenates arrays', function() {
      assert.deepEqual(concat([1, 2, 3], [4, 5]), [1, 2, 3, 4, 5]);
      assert.deepEqual(concat([1, 2], []), [1, 2]);
    });
  });
  describe('empty', function() {
    it('is zero', function() {
      assert.deepEqual(empty([1, 2, 3]), []);
      assert.deepEqual(empty([7]), []);
    });
  });
  describe('map', function() {
    it('maps properly', function() {
      assert.deepEqual(map(double, [1, 2, 3]), [2, 4, 6]);
    });
    it('invokes mapper with one argument', function() {
      function mapper(n) {
        assert.equal(arguments.length, 1);
        return 2 * n;
      }
      assert.deepEqual(map(mapper, [1, 2, 3]), [2, 4, 6]);
    });
  });
  describe('ap', function() {
    it('applies each function in first to each value in second', function() {
      assert.deepEqual(ap([double, addTwo], [1, 2, 3]), [2, 4, 6, 3, 4, 5]);
    });
  });
  describe('of', function() {
    it('returns list of value', function() {
      assert.deepEqual(of([1, 2], 3), [3]);
      assert.deepEqual(of(['hello', 'there'], 'of'), ['of']);
    });
  });
  describe('reduce', function() {
    it('reduces array', function() {
      assert.strictEqual(reduce(add, 3, [3, 4, 10]), 20);
    });
  });
  describe('sequence', function() {
    it('first array operation', function() {
      assert.deepEqual(sequence([[1, 2, 3]], of([])), [[1], [2], [3]]);
    });
    it('second array operation', function() {
      assert.deepEqual(sequence([[1,2,3],[4,5,6]], of([])), [[1,4],[1,5],[1,6],[2,4],[2,5],[2,6],[3,4],[3,5],[3,6]]);
    })
  });
  describe('chain', function() {
    it('concats arrays created by function', function() {
      function f(n) { return [n, 2*n, 3*n]; }
      assert.deepEqual(chain(f, [1, 2, 3]), [1, 2, 3, 2, 4, 6, 3, 6, 9]);
    });
  });
});

describe('object', function() {
  describe('equals', function() {
    it('is equal if values are equal', function() {
      assert.strictEqual(equals({a: 12, likes: 'to', play: [1, 2]},
                                {a: 12, likes: 'to', play: [1, 2]}), true);
    });
    it('is not equal if values differ', function() {
      assert.strictEqual(equals({a: 12, likes: 'to', play: [1, 2]},
                                {a: 13, likes: 'to', play: [1, 2]}), false);
      assert.strictEqual(equals({a: 12, likes: 'to', play: [1, 2]},
                                {a: 12, likes: 'tO', play: [1, 2]}), false);
      assert.strictEqual(equals({a: 12, likes: 'to', play: [1, 2]},
                                {a: 12, likes: 'to', play: [2, 2]}), false);
    });
    it('is not equal if extra keys are in second object', function() {
      assert.strictEqual(equals({a: 12, play: [1, 2]},
                                {a: 12, likes: 'to', play: [1, 2]}), false);
    });
  });
  describe('empty', function() {
    it('is object without keys', function() {
      assert.equal(Object.keys(empty({foo: 'bar'})).length, 0);
    });
  });
  describe('concat', function() {
    it('merges keys', function() {
      var o1 = {hello: 'I', my: 'name', is: 'nice'};
      var o2 = {i: 'think', youre: 'famous'};
      var m = concat(o1, o2);
      assert.deepEqual(Object.keys(m).sort(), [
        'hello', 'i', 'is', 'my', 'youre'
      ]);
    });
    it('merges values', function() {
      var o1 = {hello: 'I', my: 'name', is: 'nice'};
      var o2 = {i: 'think', youre: 'famous'};
      var m = concat(o1, o2);
      assert.deepEqual(m,
        {hello: 'I', my: 'name', is: 'nice',
        i: 'think', youre: 'famous'}
      );
    });
    it('overrides with values from left', function() {
      var o1 = {hello: 'there'};
      var o2 = {hello: 'you'};
      assert.deepEqual(concat(o1, o2), {hello: 'there'});
    })
  })
});

describe('function', function() {
  describe('map', function() {
    it('composes two unary functions', function() {
      var fn = map(double, addTwo);
      assert.equal(fn.length, 1);
      assert.equal(fn(5), 14);
    });
    it('composes a unary and a binary function', function() {
      var fn = map(double, add);
      assert.equal(fn.length, 2);
      assert.equal(fn(1, 3), 8);
    });
  });
  describe('ap', function() {
    it('applies functions correctly', function() {
      var fn = ap(function(_) { return addTwo; }, double);
      assert.equal(fn(3), 8);
      assert.equal(fn(7), 16);
    });
  })
  describe('of', function() {
    it('creates function that always returns first argument', function() {
      var fn = of(function() {}, 4);
      assert.equal(fn(2), 4);
      assert.equal(fn('hello'), 4);
    });
  });
})
