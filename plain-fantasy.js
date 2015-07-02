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
  var i, j, n = [];
  for (i = 0; i < a.length; ++i) n[i] = a[i];
  for (j = 0; j < b.length; ++j) n[i + j] = b[j];
  return n;
}

function arrayMap(a, f) {
  var i, n = [];
  for (i = 0; i < a.length; ++i) n[i] = f(a[i]);
  return n;
}

function equals(a, b) {
  return isNumber(a) ? a === b
       : isString(a) ? a === b
       : isArray(a)  ? arrayEq(a, b)
                     : undefined;
}

e.concat = function concat(a, b) {
  return isNumber(a) ? a + b
       : isString(a) ? a + b
       : isArray(a)  ? arrayConcat(a, b)
                     : undefined;
};

e.empty = function empty(a) {
  return isNumber(a) ? 0
       : isString(a) ? ''
       : isArray(a)  ? []
                     : undefined;
};

e.map = function map(f, a) {
  return isArray(a)  ? arrayMap(a, f)
                     : undefined;
};

e.ap = function ap() {
  return isNumber(a) ? 0
       : isString(a) ? ''
       : isArray(a)  ? []
                     : undefined;
};

e.of = function of(a, b) {
  return isArray(a)  ? [b]
                     : undefined;
};

e.reduce = function reduce() {
};

e.sequence = function sequence() {
};

e.chain = function chain() {
};

e.extend = function extend() {
};

e.extract = function extract() {
};

e.equals = equals;
