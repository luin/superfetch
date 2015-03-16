SuperFetch
==========
SuperFetch is a promise-based HTTP client for Node.js. It's based on the [request](https://github.com/request/request) library and has an elegant interface.

[![Build Status](https://travis-ci.org/luin/superfetch.png?branch=master)](https://travis-ci.org/luin/superfetch)

Install
------

```shell
$ npm install superfetch
```

Super easy to use
-----------------

```javascript
var fetch = require('superfetch');
fetch.get('http://example.com').then(function (body) {
  // when the status code begins with "2", only the response body is returned.
}).catch(function (response) {
  // otherwise, the whole response(including status code) is returned.
});

// It's easy to pass the option to the request library
fetch.get.option({ encoding: 'utf8' })('http://example.com').then(//...

// Chain!
var base = fetch.post.option({ baseSetting: 'foo' }).option({ otherSetting: 'bar' });
base('http://example1.com', { postbody: {} }).then(//...
base.option({ thirdSetting: 'zoo' })('http://example2.com');
```

API
----

1. `fetch[http verb]` will returns a VerbInstance.
2. `VerbInstance.option(settingObj)` or `VerbInstance.option(key, value)` will returns a new VerbInstance with the specified settings setted. All options will be passed to the request library except the `transform` which will be introduced later.
3. `VerbInstance.header(headerObj)` or `VerbInstance.header(key, value)` is an alias for `VerbInstance.option('headers', headerObj)`.
4. `VerbInstance.auth(user, pass)` is an alias for `VerbInstance.option('auth', { user: user, pass: pass })`.

Transform
---------

Both request and response can be transformed.

```javascript
fetch.option('transform', {
  request: function (options) {
    options.method = 'post';
    return options;
  },
  response: function (err, resp, body) {
    if (err) {
      throw err;
    }
    return resp;
  }
}).then(function (resp) {
});
```
