var util = require('cloud/gocardless-node/lib/partial_util_implementation.js');
var Resource = require('cloud/gocardless-node/lib/resources/resource');

function Merchant() {
  this.basePath = '/merchants';
  Resource.apply(this, arguments);
}

util.inherits(Merchant, Resource);

Merchant.prototype.getSelf = function getSelf(cb) {
  return this.get({ id: this.opts.merchantId }, cb);
};

module.exports = Merchant;
