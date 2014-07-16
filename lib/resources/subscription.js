var util = require('cloud/gocardless-node/lib/partial_util_implementation.js');
var _ = require('cloud/lodash/dist/lodash.min.js');

var Resource = require('cloud/gocardless-node/lib/resources/resource');
var indexBehaviour = require('cloud/gocardless-node/lib/resources/shared/index-behaviour');
var cancelBehaviour = require('cloud/gocardless-node/lib/resources/shared/cancel-behaviour');
var connectBehaviour = require('cloud/gocardless-node/lib/resources/shared/connect-behaviour');

function Subscription() {
  this.basePath = '/subscriptions';
  this.paramName = 'subscription';
  Resource.apply(this, arguments);
}

util.inherits(Subscription, Resource);
_.extend(Subscription.prototype, indexBehaviour);
_.extend(Subscription.prototype, cancelBehaviour);
_.extend(Subscription.prototype, connectBehaviour);

module.exports = Subscription;
