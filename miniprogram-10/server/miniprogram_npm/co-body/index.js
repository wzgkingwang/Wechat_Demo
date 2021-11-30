module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1638253357007, function(require, module, exports) {


exports = module.exports = require('./lib/any');
exports.json = require('./lib/json');
exports.form = require('./lib/form');
exports.text = require('./lib/text');

}, function(modId) {var map = {"./lib/any":1638253357008,"./lib/json":1638253357009,"./lib/form":1638253357011,"./lib/text":1638253357012}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1638253357008, function(require, module, exports) {


/**
 * Module dependencies.
 */

const typeis = require('type-is');
const json = require('./json');
const form = require('./form');
const text = require('./text');

const jsonTypes = [ 'json', 'application/*+json', 'application/csp-report' ];
const formTypes = [ 'urlencoded' ];
const textTypes = [ 'text' ];

/**
 * Return a Promise which parses form and json requests
 * depending on the Content-Type.
 *
 * Pass a node request or an object with `.req`,
 * such as a koa Context.
 *
 * @param {Request} req
 * @param {Options} [opts]
 * @return {Function}
 * @api public
 */

module.exports = async function(req, opts) {
  req = req.req || req;
  opts = opts || {};

  // json
  const jsonType = opts.jsonTypes || jsonTypes;
  if (typeis(req, jsonType)) return json(req, opts);

  // form
  const formType = opts.formTypes || formTypes;
  if (typeis(req, formType)) return form(req, opts);

  // text
  const textType = opts.textTypes || textTypes;
  if (typeis(req, textType)) return text(req, opts);

  // invalid
  const type = req.headers['content-type'] || '';
  const message = type ? 'Unsupported content-type: ' + type : 'Missing content-type';
  const err = new Error(message);
  err.status = 415;
  throw err;
};

}, function(modId) { var map = {"./json":1638253357009,"./form":1638253357011,"./text":1638253357012}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1638253357009, function(require, module, exports) {


/**
 * Module dependencies.
 */

const raw = require('raw-body');
const inflate = require('inflation');
const utils = require('./utils');

// Allowed whitespace is defined in RFC 7159
// http://www.rfc-editor.org/rfc/rfc7159.txt
const strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/;

/**
 * Return a Promise which parses json requests.
 *
 * Pass a node request or an object with `.req`,
 * such as a koa Context.
 *
 * @param {Request} req
 * @param {Options} [opts]
 * @return {Function}
 * @api public
 */

module.exports = async function(req, opts) {
  req = req.req || req;
  opts = utils.clone(opts);

  // defaults
  const len = req.headers['content-length'];
  const encoding = req.headers['content-encoding'] || 'identity';
  if (len && encoding === 'identity') opts.length = ~~len;
  opts.encoding = opts.encoding || 'utf8';
  opts.limit = opts.limit || '1mb';
  const strict = opts.strict !== false;

  const str = await raw(inflate(req), opts);
  try {
    const parsed = parse(str);
    return opts.returnRawBody ? { parsed, raw: str } : parsed;
  } catch (err) {
    err.status = 400;
    err.body = str;
    throw err;
  }

  function parse(str) {
    if (!strict) return str ? JSON.parse(str) : str;
    // strict mode always return object
    if (!str) return {};
    // strict JSON test
    if (!strictJSONReg.test(str)) {
      throw new SyntaxError('invalid JSON, only supports object and array');
    }
    return JSON.parse(str);
  }
};

}, function(modId) { var map = {"./utils":1638253357010}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1638253357010, function(require, module, exports) {


/**
 * Module dependencies.
 */

exports.clone = function(opts) {
  const options = {};
  opts = opts || {};
  for (const key in opts) {
    options[key] = opts[key];
  }
  return options;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1638253357011, function(require, module, exports) {


/**
 * Module dependencies.
 */

const raw = require('raw-body');
const inflate = require('inflation');
const qs = require('qs');
const utils = require('./utils');

/**
 * Return a Promise which parses x-www-form-urlencoded requests.
 *
 * Pass a node request or an object with `.req`,
 * such as a koa Context.
 *
 * @param {Request} req
 * @param {Options} [opts]
 * @return {Function}
 * @api public
 */

module.exports = async function(req, opts) {
  req = req.req || req;
  opts = utils.clone(opts);
  const queryString = opts.queryString || {};

  // keep compatibility with qs@4
  if (queryString.allowDots === undefined) queryString.allowDots = true;

  // defaults
  const len = req.headers['content-length'];
  const encoding = req.headers['content-encoding'] || 'identity';
  if (len && encoding === 'identity') opts.length = ~~len;
  opts.encoding = opts.encoding || 'utf8';
  opts.limit = opts.limit || '56kb';
  opts.qs = opts.qs || qs;

  const str = await raw(inflate(req), opts);
  try {
    const parsed = opts.qs.parse(str, queryString);
    return opts.returnRawBody ? { parsed, raw: str } : parsed;
  } catch (err) {
    err.status = 400;
    err.body = str;
    throw err;
  }
};

}, function(modId) { var map = {"./utils":1638253357010}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1638253357012, function(require, module, exports) {


/**
 * Module dependencies.
 */

const raw = require('raw-body');
const inflate = require('inflation');
const utils = require('./utils');

/**
 * Return a Promise which parses text/plain requests.
 *
 * Pass a node request or an object with `.req`,
 * such as a koa Context.
 *
 * @param {Request} req
 * @param {Options} [opts]
 * @return {Function}
 * @api public
 */

module.exports = async function(req, opts) {
  req = req.req || req;
  opts = utils.clone(opts);

  // defaults
  const len = req.headers['content-length'];
  const encoding = req.headers['content-encoding'] || 'identity';
  if (len && encoding === 'identity') opts.length = ~~len;
  opts.encoding = opts.encoding === undefined ? 'utf8' : opts.encoding;
  opts.limit = opts.limit || '1mb';

  const str = await raw(inflate(req), opts);
  // ensure return the same format with json / form
  return opts.returnRawBody ? { parsed: str, raw: str } : str;
};

}, function(modId) { var map = {"./utils":1638253357010}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1638253357007);
})()
//# sourceMappingURL=index.js.map