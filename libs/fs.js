var fs = require('fs');
var pify = require('pify');
var pfs = pify(fs);

module.exports = pfs;