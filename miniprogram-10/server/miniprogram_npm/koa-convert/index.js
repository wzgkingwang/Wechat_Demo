module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1638253357078, function(require, module, exports) {


/**
 * Module dependencies.
 */

const co = require('co')
const compose = require('koa-compose')

/**
 * Expose `convert()`.
 */

module.exports = convert

/**
 * Convert Koa legacy generator-based middleware
 * to modern promise-based middleware.
 *
 *
 * @api public
 * */

function convert (mw) {
  if (typeof mw !== 'function') {
    throw new TypeError('middleware must be a function')
  }

  // assume it's Promise-based middleware
  if (
    mw.constructor.name !== 'GeneratorFunction' &&
    mw.constructor.name !== 'AsyncGeneratorFunction'
  ) {
    return mw
  }

  const converted = function (ctx, next) {
    return co.call(
      ctx,
      mw.call(
        ctx,
        (function * (next) { return yield next() })(next)
      ))
  }

  converted._name = mw._name || mw.name
  return converted
}

/**
 * Convert and compose multiple middleware
 * (could mix legacy and modern ones)
 * and return modern promise middleware.
 *
 *
 * @api public
 * */

// convert.compose(mw, mw, mw)
// convert.compose([mw, mw, mw])
convert.compose = function (arr) {
  if (!Array.isArray(arr)) {
    arr = Array.from(arguments)
  }

  return compose(arr.map(convert))
}

/**
 * Convert Koa modern promise-based middleware
 * to legacy generator-based middleware.
 *
 *
 * @api public
 * */

convert.back = function (mw) {
  if (typeof mw !== 'function') {
    throw new TypeError('middleware must be a function')
  }

  // assume it's generator middleware
  if (mw.constructor.name === 'GeneratorFunction' || mw.constructor.name === 'AsyncGeneratorFunction') {
    return mw
  }

  const converted = function * (next) {
    const ctx = this
    let called = false

    yield mw(ctx, function () {
      if (called) {
        // guard against multiple next() calls
        // https://github.com/koajs/compose/blob/4e3e96baf58b817d71bd44a8c0d78bb42623aa95/index.js#L36
        throw new Error('next() called multiple times')
      }

      called = true
      return co.call(ctx, next)
    })
  }

  converted._name = mw._name || mw.name
  return converted
}

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1638253357078);
})()
//# sourceMappingURL=index.js.map