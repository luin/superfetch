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
  // when the status code begins with "2", the response body will be returned.
}).catch(function (response) {
  // otherwise, the whole response(including headers) is returned.
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

1. `fetch[http verb]` will return a VerbInstance.
2. `VerbInstance.option(settingObj)` or `VerbInstance.option(key, value)` will return a new VerbInstance with the specified settings setted. All options will be passed to the request library except the `transform` which will be introduced later.
3. `VerbInstance.header(headerObj)` or `VerbInstance.header(key, value)` is an alias for `VerbInstance.option('headers', headerObj)`.
4. `VerbInstance.auth(user, pass)` is an alias for `VerbInstance.option('auth', { user: user, pass: pass })`.
5. `VerbInstance(url[, body])` will send a request, and the optionally `body` sets the `json` property of the request library.
6. `fetch.defaults(defaultOptions)` will create a new fetch instance with a different default options:
```javascript
var d = fetch.defaults({ encoding: 'utf8' });
d.post('http://example.com').then(//
```

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

Run tests
---------

```shell
$ npm test
```

More examples can refer to the `test` directory.

Why build another HTTP client?
-------------
I'm aware that there are many Node.js HTTP client libraries such as [request](https://github.com/request/request), [superagent](https://github.com/visionmedia/superagent) and [axios](https://github.com/mzabriskie/axios). However, I find out none of these libraries exactly suit my needs. What I want is a library that is powerful, supports promise and has an elegant API, while the fact is request lib is powerful but doesn't support promise, superagent has an elegant API but doesn't as powerful as request lib, and axios lib supports promise but lacks many features I want. So here is SuperFetch.

Articles
-------
[DailyJs: AniCollection, SuperFetch](http://dailyjs.com/2015/03/19/anicollection-superfetch/)
