var assert = require('assert');
var p = require('../plain-fantasy.js');

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
  });
  describe('of', function() {
    it('returns list of value', function() {
      assert.deepEqual(of([1, 2], 3), [3]);
      assert.deepEqual(of(['hello', 'there'], 'of'), ['of']);
    });
  });
});
