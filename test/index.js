var expect = require('chai').expect;
var proxyquire = require('proxyquire');

function defaultHandler (options, callback) {
  callback(null, { statusCode: 200 }, options);
}

var handler = defaultHandler;
var request = function (options, callback) {
  handler(options, callback);
};

var superfetch = proxyquire('..', { 'request': request });

describe('superfetch', function () {
  describe('.option', function () {
    it('should change the options', function (done) {
      superfetch.get.option({ a: 1 }).option('b', 2)('http://a.com').then(function (res) {
        expect(res).to.eql({
          method: 'get',
          url: 'http://a.com',
          headers: {},
          a: 1,
          b: 2
        });
        done();
      });
    });

    it('should generate a new instance', function (done) {
      var parent = superfetch.get.option({ a: 1 });
      var child1 = parent.option('b', 2);
      parent.option('c', 3)('http://a.com').then(function (res) {
        expect(res).to.eql({
          method: 'get',
          url: 'http://a.com',
          headers: {},
          a: 1,
          c: 3
        });
        done();
      });
    });
  });

  describe('.header', function () {
    it('should change the header', function (done) {
      superfetch.get.header({ a: 1 }).header('b', 2)('http://a.com').then(function (res) {
        expect(res).to.eql({
          method: 'get',
          url: 'http://a.com',
          headers: { a: 1, b: 2 },
        });
        done();
      });
    });
  });

  describe('transform', function () {
    it('should reject when status code isnt begin with "2"', function (done) {
      handler = function (_, callback) {
        callback(null, { statusCode: 400 });
      };
      superfetch.get('http://a.com').catch(function (err) {
        handler = defaultHandler;
        done();
      });
    });

    describe('request', function () {
      it('should transform request', function (done) {
        superfetch.get.option('transform', {
          request: function (options) {
            options.url = 'http://b.com';
            return options;
          }
        })('http://a.com').then(function (res) {
          expect(res.url).to.eql('http://b.com');
          done();
        });
      });
    });

    describe('response', function () {
      it('should transform request', function (done) {
        superfetch.get.option('transform', {
          response: function (err, resp, body) {
            throw body;
          }
        })('http://a.com').catch(function (res) {
          expect(res.url).to.eql('http://a.com');
          done();
        });
      });
    });
  });

  describe('request', function () {
    it('should use the second param as the body', function (done) {
      superfetch.post('http://a.com', { a: 1 }).then(function (res) {
        expect(res).to.eql({
          method: 'post',
          url: 'http://a.com',
          json: { a: 1 },
          headers: {}
        });
        done();
      });
    });
  });

  describe('.defaults', function () {
    it('should set the default options', function (done) {
      var d = superfetch.defaults({ name: 'bob' });
      d.post('http://a.com').then(function (res) {
        expect(res).to.eql({
          method: 'post',
          url: 'http://a.com',
          name: 'bob'
        });
        done();
      });
    });
  });
});
