var curry2 = require('ramda/src/internal/_curry2');
var curryN = require('ramda/src/curryN');

var isArray = Array.isArray || function(a) {
  return Object.prototype.toString.call(a) === '[object Array]';
};

function isFunction(f) { return typeof f === 'function'; }
function isNumber(n) { return typeof n === 'number'; }
function isString(s) { return typeof s === 'string'; }
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

function hasMethod(o, n) {
  return n !== undefined && n !== null && isFunction(o[n]);
}

// Array

function arrayEq(a, b) {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (!equals(a[i], b[i])) return false;
  }
  return true;
}

function arrayConcat(a, b) {
  var i, n = [];
  for (i = 0; i < a.length; ++i) n.push(a[i]);
  for (i = 0; i < b.length; ++i) n.push(b[i]);
  return n;
}

function arrayMap(a, f) {
  var i, n = [];
  for (i = 0; i < a.length; ++i) n[i] = f(a[i]);
  return n;
}

function arrayAp(a, b) {
  var i, j, n = [];
  for (i = 0; i < a.length; ++i) {
    for (j = 0; j < b.length; ++j) {
      n[i * b.length + j] = a[i](b[j]);
    }
  }
  return n;
}

function arrayChain(a, f) {
  var b, i, j, n = [];
  for (i = 0; i < a.length; ++i) {
    b = f(a[i]);
    for (j = 0; j < b.length; ++j) n.push(b[j]);
  }
  return n;
}

function arrayReduce(f, b, a) {
  for (var i = 0; i < a.length; ++i) {
    b = f(b, a[i]);
  }
  return b;
}

function append(a) {
  return function(b) {
    return [a].concat(b);
  }
}

function arraySequence(a, of) {
  return a.length === 0 ? of([])
                        : ap(map(append, a[0]), arraySequence(a.slice(1), of));
}

// Object

function objectEq(a, b) {
  var aN = 0, bN = 0;
  for (var key in a) {
    if (!(key in b) || !equals(a[key], b[key])) {
      return false;
    }
    aN++;
  }
  for (key in b) bN++;
  return aN === bN;
}

function objectConcat(a, b) {
  var key, n = {};
  for (key in b) n[key] = b[key];
  for (key in a) n[key] = a[key];
  return n;
}

function objectMap(o, f) {
  var key, n = {};
  for (key in o) {
    n[key] = f(o[key]);
  }
  return n;
}

// Function

function fnMap(g, f) {
  return curryN(f.length + g.length - 1, function() {
    return f(g.apply(null, arguments));
  });
}

function fnAp(f, b) {
  return function(x) {
    return f(x)(b(x));
  }
}

function fnOf(a) {
  return function(_) { return a; };
}

// (eq a, eq b) => a -> b -> boolean
function equals(a, b) {
  return isNumber(a) || isString(a) ? a === b
       : isArray(a)                 ? arrayEq(a, b)
       : hasMethod(a, 'equals')     ? a.equals(b)
       : isObject(a)                ? objectEq(a, b)
                                    : undefined;
}

// (Monoid m) => m -> m -> m
function concat(a, b) {
  return isNumber(a) || isString(a) ? a + b
       : isArray(a)                 ? arrayConcat(a, b)
       : hasMethod(a, 'concat')     ? a.concat(b)
       : isObject(a)                ? objectConcat(a, b)
                                    : undefined;
}

// (Monoid m) => * -> m
function empty(a) {
  return isNumber(a) ? 0
       : isString(a) ? ''
       : isArray(a)  ? []
       : hasMethod(a, 'empty') ? a.empty()
       : isObject(a) ? {}
                     : undefined;
}

// (Functor f) => (a -> b) -> f a -> f b
function map(f, a) {
  return isArray(a)          ? arrayMap(a, f)
       : isFunction(a)       ? fnMap(a, f)
       : hasMethod(a, 'map') ? a.map(f)
       : isObject(a)   ? objectMap(a, f)
                       : undefined;
}

// (Applicative f) => f (a -> b) -> f a -> f b
function ap(a, b) {
  return isArray(a) ? arrayAp(a, b)
       : isFunction(a) ? fnAp(a, b)
       : hasMethod(a, 'ap') ? a.ap(b)
                            : undefined;
}

// (Applicative f) => f a -> b -> f b
var of = curry2(function(a, b) {
  return isArray(a)         ? [b]
       : isFunction(a)      ? fnOf(b)
       : hasMethod(a, 'of') ? a.of(b)
                            : undefined;
});

// (Foldable t) => (a -> b -> b) -> b -> t a -> b
function reduce(f, b, a) {
  return isArray(a)          ? arrayReduce(f, b, a)
    : hasMethod(a, 'reduce') ? a.reduce(f, b)
                    : undefined;
}

function sequence(a, of) {
  return isArray(a)               ? arraySequence(a, of)
       : hasMethod(a, 'sequence') ? a.sequence(of)
                                  : undefined;
}

function chain(f, a) {
  return isArray(a) ? arrayChain(a, f)
       : hasMethod(a, 'chain') ? a.chain(f)
                    : undefined;
}

function extend(f, a) {
  return hasMethod(a, 'extend') ? a.extend(f)
                                : undefined;
}

function extract(a) {
  return hasMethod(a, 'extract') ? a.extract()
                                 : undefined;
}

module.exports = {
  equals: equals, concat: concat, empty: empty, map: map,
  ap: ap, of: of, reduce: reduce, sequence: sequence, chain: chain,
  extend: extend, extract: extract
};
