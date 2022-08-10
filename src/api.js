/*
Directly exposed API functions and classes, :func:`Document` for now.
Provides a syntactically more convenient API for interacting with the
OpcPackage graph.
*/
//let path = require('path')
let {CT} = require('./opc/constants');
let {Package} = require('./package');
let {ValueError} = require('./exceptions')
let {default_docx_buf} = require('./templates/default_docx');
require('./oxml/register');
function Document(docx = null) {
    /*
    Return a |Document| object loaded from *docx*, where *docx* can be
    either a path to a ``.docx`` file (a string) or a file-like object. If
    *docx* is missing or ``None``, the built-in default document "template"
    is loaded.
    */
    let document_part, msg;
    if (docx===null)  docx = _default_docx_path();
    document_part = Package.open(docx).main_document_part;
    if (![CT.WML_DOCUMENT_MAIN, CT.WML_TEMPLATE_MAIN].includes(document_part.content_type)) {
        msg = `file '${docx}' is not a Word file, content type is '${document_part.content_type}'`;
        throw new ValueError(msg);
    }
    return document_part.document;
}
function _default_docx_path() {
    /*
    Return the path to the built-in default .docx package.
    */
    //return path.join(__dirname, "templates", "default.docx");
    return default_docx_buf;
}

module.exports = {Document};
