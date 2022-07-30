let  xpath = require('xpath');
let {nsmap} = require('./ns');
let select = xpath.useNamespaces(nsmap);

module.exports = {select};
