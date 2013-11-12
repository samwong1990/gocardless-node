var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

var gocardless = require('../../lib/gocardless.js');
var Client = require('../../lib/client');

describe('gocardless', function() {

  beforeEach(function() {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  var opts;
  describe('with incorrect config options', function() {
    beforeEach(function() {
      opts = {};
    });

    it('throws an error', function() {
      expect(gocardless).withArgs(opts).to.throwError();
    });
  });

  describe('with correct config options', function() {
    var ClientMock;
    var gocardless;

    beforeEach(function() {
      ClientMock = sinon.spy(Client);
      mockery.registerMock('./client', ClientMock);
      gocardless = require('../../lib/gocardless');

      opts = { app_id: '', app_secret: '', token: '', merchant_id: '' };
    });

    afterEach(function() {
      ClientMock.reset();
    });

    it('returns a new Client', function() {
      var returned = gocardless(opts);
      ClientMock.withArgs(opts);

      expect(ClientMock.withArgs(opts).calledOnce).to.be.ok();
      expect(returned).to.be.a(ClientMock)
    });

    describe('in live mode', function() {
      it('sets live baseUrl', function() {
        var expected = 'https://gocardless.com/api/v1';
        gocardless(opts);
        expect(ClientMock.args[0][0].baseUrl).to.be(expected);
      });
    });

    describe('in sandbox mode', function() {
      beforeEach(function() {
        opts.sandbox = true;
      });

      it('sets sandbox baseUrl', function() {
        var expected = 'https://sandbox.gocardless.com/api/v1';
        gocardless(opts);
        expect(ClientMock.args[0][0].baseUrl).to.be(expected);
      });
    });
  });
});