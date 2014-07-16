var util = require('cloud/gocardless-node/lib/partial_util_implementation.js');
var _ = require('cloud/lodash/dist/lodash.min.js');

var Resource = require('cloud/gocardless-node/lib/resources/resource');
var indexBehaviour = require('cloud/gocardless-node/lib/resources/shared/index-behaviour');
var cancelBehaviour = require('cloud/gocardless-node/lib/resources/shared/cancel-behaviour');
var connectBehaviour = require('cloud/gocardless-node/lib/resources/shared/connect-behaviour');

function PreAuthorization() {
  this.basePath = '/pre_authorizations';
  this.paramName = 'pre_authorization';
  Resource.apply(this, arguments);
}

util.inherits(PreAuthorization, Resource);
_.extend(PreAuthorization.prototype, indexBehaviour);
_.extend(PreAuthorization.prototype, cancelBehaviour);
_.extend(PreAuthorization.prototype, connectBehaviour);

module.exports = PreAuthorization;
