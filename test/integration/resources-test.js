var path = require('path');

var expect = require('expect.js');
var nock = require('nock');

var GoCardless = require('../../lib/gocardless');

var fixtures = path.resolve('test/fixtures');
var environmentUrls = {
  live: 'https://gocardless.com/',
  sandbox: 'https://sandbox.gocardless.com/'
};

describe('Resource requests', function() {
  function testResources(env) {
    var server, gocardless, config;

    beforeEach(function() {
      config = {
        token:'9012IJKL',
        app_id: '1234ABCD',
        app_secret: '5678EFGH',
        merchant_id:'3456MNOP',
        sandbox: (env === 'sandbox')
      };

      gocardless = GoCardless(config);
      server = nock(environmentUrls[env])
                 .matchHeader('Accept', 'application/json')
                 .matchHeader('Authorization', 'bearer ' + config.token);
    });

    describe('Bill', function() {
      it('gets one', function(done) {
        var billId = '0ABC123456';
        server
          .get('/api/v1/bills/' + billId)
          .replyWithFile(200, fixtures + '/bill.json');

        gocardless.bill.get({ id: billId }, done);
      });
    });

    describe('Merchant', function() {
      it('gets self', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchant_id)
          .replyWithFile(200, fixtures + '/merchant.json');

        gocardless.merchant.getSelf(done);
      });
    });

    describe('User', function() {
      it('gets index', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchant_id + '/users')
          .replyWithFile(200, fixtures + '/users.json');

        gocardless.user.index(done);
      });
    });

    describe('Subscription', function() {
      it('gets one', function(done) {
        server
          .get('/api/v1/subscriptions/123')
          .replyWithFile(200, fixtures + '/subscription.json');

        gocardless.subscription.get({ id: 123 }, done);
      });

      it('gets index', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchant_id + '/subscriptions')
          .replyWithFile(200, fixtures + '/subscriptions.json');

        gocardless.subscription.index(done);
      });

      it('cancels one', function(done) {
        server
          .put('/api/v1/subscriptions/123/cancel')
          .replyWithFile(200, fixtures + '/subscription.json');

        gocardless.subscription.cancel({ id: 123 }, done);
      });
    });

    describe('PreAuthorization', function() {
      it('gets one', function(done) {
        server
          .get('/api/v1/pre_authorizations/123')
          .replyWithFile(200, fixtures + '/pre-authorization.json');

        gocardless.preAuthorization.get({ id: 123 }, done);
      });

      it('gets index', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchant_id + '/pre_authorizations')
          .replyWithFile(200, fixtures + '/pre-authorizations.json');

        gocardless.preAuthorization.index(done);
      });

      it('cancels one', function(done) {
        server
          .put('/api/v1/pre_authorizations/123/cancel')
          .replyWithFile(200, fixtures + '/pre-authorization.json');

        gocardless.preAuthorization.cancel({ id: 123 }, done);
      });
    });
  }

  describe('in live mode', function() {
    testResources('live');
  });

  describe('in sandbox mode', function() {
    testResources('sandbox');
  });
});
