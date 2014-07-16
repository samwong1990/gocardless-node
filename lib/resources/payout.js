var util = require('cloud/gocardless-node/lib/partial_util_implementation.js');

var _ = require('cloud/lodash/dist/lodash.min.js');

var Resource = require('cloud/gocardless-node/lib/resources/resource');
var indexBehaviour = require('cloud/gocardless-node/lib/resources/shared/index-behaviour');

function Payout() {
  this.basePath = '/payouts';
  Resource.apply(this, arguments);
}

util.inherits(Payout, Resource);
_.extend(Payout.prototype, indexBehaviour);

module.exports = Payout;
