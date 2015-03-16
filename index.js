var _ = require('lodash');
var methods = require('methods');
var request = require('request');

var superfetch = module.exports = {};

var defaults = {
  options: { headers: {} },
};

var proto = {
  option: function (key, value) {
    var clonedData = _.cloneDeep(this.__data);
    if (typeof key === 'object') {
      for (var k in key) {
        clonedData.options[k] = key[k];
      }
    } else {
      clonedData.options[key] = value;
    }
    return wrap(clonedData);
  },
  header: function (key, value) {
    var clonedData = _.cloneDeep(this.__data);
    if (typeof key === 'object') {
      for (var k in key) {
        clonedData.options.headers[k] = key[k];
      }
    } else {
      clonedData.options.headers[key] = value;
    }
    return wrap(clonedData);
  },
  auth: function (user, pass) {
    return this.option(auth, { user: user, pass: pass });
  }
};

methods.forEach(function (method) {
  var data = _.cloneDeep(defaults);
  data.options.method = method;
  superfetch[method] = wrap(data);
});

function wrap (data) {
  var newF = fetch.bind(data);
  newF.__data = data;
  for (var key in proto) {
    if (proto.hasOwnProperty(key)) {
      newF[key] = proto[key];
    }
  }
  return newF;
}

function fetch (url) {
  var req = _.cloneDeep(this.options);
  req.url = url;

  var promise;
  if (req.transform && req.transform.request) {
    req = req.transform.request(req);
    if (typeof req !== 'object' || req === null) {
      throw new Error('`transform` should return an object');
    }
    if (typeof req.then === 'function') {
      promise = req;
    }
  }
  if (!promise) {
    promise = Promise.resolve(req);
  }
  return promise.then(function(req) {
    return new Promise(function(resolve, reject) {
      request(req, function(err, res, body) {
        if (req.transform && req.transform.response) {
          try {
            resolve(req.transform.response(err, res, body));
          } catch (e) {
            throw e;
          }
          return;
        }
        if (err) {
          reject(err);
        } else {
          var code = res.statusCode.toString();
          if (code && code[0] === '2') {
            resolve(body);
          } else {
            reject(res);
          }
        }
      });
    });
  });
}
