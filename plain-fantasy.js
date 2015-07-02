var isArray = Array.isArray || function(a) {
  return Object.prototype.toString.call(a) === '[object Array]';
};

function isFunction(f) { return typeof f === 'function'; }
function isNumber(n) { return typeof n === 'number'; }
function isString(s) { return typeof s === 'string'; }

var e = module.exports;

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

// (Eq a, Eq b) => a -> b -> Boolean
function equals(a, b) {
  return isNumber(a) ? a === b
       : isString(a) ? a === b
       : isArray(a)  ? arrayEq(a, b)
                     : undefined;
}

// (Monoid m) => m -> m -> m
function concat(a, b) {
  return isNumber(a) ? a + b
       : isString(a) ? a + b
       : isArray(a)  ? arrayConcat(a, b)
                     : undefined;
}

// (Monoid m) => * -> m
function empty(a) {
  return isNumber(a) ? 0
       : isString(a) ? ''
       : isArray(a)  ? []
                     : undefined;
}

// (Functor f) => (a -> b) -> f a -> f b
function map(f, a) {
  return isArray(a)  ? arrayMap(a, f)
                     : undefined;
}

// (Applicative f) => f (a -> b) -> f a -> f b
function ap(a, b) {
  return isArray(a) ? arrayAp(a, b)
                    : undefined;
}

// (Applicative f) => f a -> b -> f b
function of(a, b) {
  return isArray(a) ? [b]
                    : undefined;
}

// (Foldable t) => (a -> b -> b) -> b -> t a -> b
function reduce(f, b, a) {
  return isArray(a) ? arrayReduce(f, b, a)
                    : undefined;
}

function sequence() {
}

function chain(f, a) {
  return isArray(a) ? arrayChain(a, f)
                    : undefined;
}

function extend() {
}

function extract() {
}

module.exports = {
  equals: equals, concat: concat, empty: empty, map: map, ap: ap, of: of,
  reduce: reduce, chain: chain
};
