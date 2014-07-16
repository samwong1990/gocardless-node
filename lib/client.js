var _ = require('cloud/lodash/dist/lodash.min.js');
// var request = require('request'); // we have to use the parse one here

var constants = require('cloud/gocardless-node/lib/constants');

var Bill = require('cloud/gocardless-node/lib/resources/bill');
var User = require('cloud/gocardless-node/lib/resources/user');
var Payout = require('cloud/gocardless-node/lib/resources/payout');
var Merchant = require('cloud/gocardless-node/lib/resources/merchant');
var Subscription = require('cloud/gocardless-node/lib/resources/subscription');
var PreAuthorization = require('cloud/gocardless-node/lib/resources/pre-authorization');
var Signer = require('cloud/gocardless-node/lib/helpers/request-signer');

function assignAuthHeader(opts, token) {
  var authHeader = 'bearer ' + token;
  opts.headers = (opts.headers || {});
  opts.headers.Authorization = (opts.headers.Authorization || authHeader);
  return opts;
}

function Client(config) {
  if (!config || config.baseUrl == null) {
    throw new Error('ArgumentError: config.baseUrl is required');
  }

  this.config = config;

  var merchantId = config.merchantId;
  this.user = new User(this, { merchantId: merchantId });
  this.payout = new Payout(this, { merchantId: merchantId });
  this.merchant = new Merchant(this, { merchantId: merchantId });

  var connectConfig = {
    merchantId: merchantId,
    appId: config.appId,
    secret: config.appSecret,
    baseUrl: config.baseUrl
  };
  this.bill = new Bill(this, connectConfig);
  this.subscription = new Subscription(this, connectConfig);
  this.preAuthorization = new PreAuthorization(this, connectConfig);
}

Client.prototype.request = function(opts, cb) {
  if (!opts.auth) opts = assignAuthHeader(opts, this.config.token);
  opts.headers = (opts.headers || {});
  opts.headers.Accept = 'application/json';
  opts.headers['User-Agent'] = 'gocardless-node/v' + constants.VERSION;
  opts.uri = this.config.baseUrl + (opts.path || '');
  // return request(opts, cb);
  
  // Use the parse one instead
  return Parse.Cloud.httpRequest({
    url: opts.uri,
    headers: opts.headers,
    // success: function(httpResponse) {
    //     nodeResponse = {};
    //     nodeResponse.statusCode = httpResponse.status;

    //     cb(null, nodeResponse, httpResponse.text);
    // },
    // error: function(httpResponse) {
    //   console.error('Request failed with response code ' + httpResponse.status);
    //   nodeResponse = {};
    //   nodeResponse.statusCode = httpResponse.status;
        
    //   cb(httpResponse.status, nodeResponse, httpResponse.text);
    // }
  });

  
};

Client.prototype.confirmResource = function confirmResource(params, cb) {
  if (!Signer.verify(params, this.config.appSecret)) {
    var err = 'Signature does not match params.' +
              'This request has been tampered with.';
    return _.isFunction(cb) && cb(new Error(err));
  }

  var opts = {
    path: constants.API_ROOT + '/confirm',
    method: 'POST',
    json: {
      resource_type: params.resource_type,
      resource_id: params.resource_id
    },
    auth: {
      user: this.config.appId,
      pass: this.config.appSecret
    }
  };
  return this.request(opts, cb);
};

Client.prototype.webhookValid = function webhookValid(params) {
  return Signer.verify(params.payload, this.config.appSecret);
};

module.exports = Client;
