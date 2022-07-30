/*
Namespace-related objects.
*/

let nsmap = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "c": "http://schemas.openxmlformats.org/drawingml/2006/chart",
    "cp": "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
    "dc": "http://purl.org/dc/elements/1.1/",
    "dcmitype": "http://purl.org/dc/dcmitype/",
    "dcterms": "http://purl.org/dc/terms/",
    "dgm": "http://schemas.openxmlformats.org/drawingml/2006/diagram",
    "m": "http://schemas.openxmlformats.org/officeDocument/2006/math",
    "pic": "http://schemas.openxmlformats.org/drawingml/2006/picture",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "sl": "http://schemas.openxmlformats.org/schemaLibrary/2006/main",
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    'w14': "http://schemas.microsoft.com/office/word/2010/wordml",
    "wp": "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
    "xml": "http://www.w3.org/XML/1998/namespace",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance",
};
let pfxmap = {};
for(let [key,value] of Object.entries(nsmap)) pfxmap[value] = key;

class NamespacePrefixedTag extends String {
    /*
    Value object that knows the semantics of an XML tag having a namespace
    prefix.
    */
    constructor(nstag) {
        super(nstag);
        let [_pfx, _local_part] = nstag.split(":");
        this._pfx = _pfx;
        this._local_part = _local_part;
        this._ns_uri = nsmap[_pfx];
    }
    get clark_name() {
        return `{${this._ns_uri}}${this._local_part}`;
    }
    static from_clark_name(clark_name) {
        let local_name, nstag, nsuri;
        [nsuri, local_name] = clark_name.slice(1).split("}");
        nstag = `${pfxmap[nsuri]}:${local_name}`;
        return new this(nstag);
    }
    get local_part() {
        /*
        Return the local part of the tag as a string. E.g. 'foobar' is
        returned for tag 'f:foobar'.
        */
        return this._local_part;
    }
    get nsmap() {
        /*
        Return a dict having a single member, mapping the namespace prefix of
        this tag to it's namespace name (e.g. {'f': 'http://foo/bar'}). This
        is handy for passing to xpath calls and other uses.
        */
        return {[this._pfx]: this._ns_uri};
    }
    get nspfx() {
        /*
        Return the string namespace prefix for the tag, e.g. 'f' is returned
        for tag 'f:foobar'.
        */
        return this._pfx;
    }
    get nsuri() {
        /*
        Return the namespace URI for the tag, e.g. 'http://foo/bar' would be
        returned for tag 'f:foobar' if the 'f' prefix maps to
        'http://foo/bar' in nsmap.
        */
        return this._ns_uri;
    }
}

function nsdecls(...prefixes) {
    /*
    Return a string containing a namespace declaration for each of the
    namespace prefix strings, e.g. 'p', 'ct', passed as *prefixes*.
    */

    let a = [];
    for(let pfx of prefixes){
        a.push(`xmlns:${pfx}="${nsmap[pfx]}"`);
    }
    return a.join(' ');
}

function nspfxmap(...nspfxs) {
    /*
    Return a dict containing the subset namespace prefix mappings specified by
    *nspfxs*. Any number of namespace prefixes can be supplied, e.g.
    namespaces('a', 'r', 'p').
    */
    let m = {};
    for(let pfx of nspfxs){
        m[pfx] = nsmap[pfx];
    }
    return m;
}
function qn(tag) {
    /*
    Stands for "qualified name", a utility function to turn a namespace
    prefixed tag name into a Clark-notation qualified tag name for lxml. For
    example, ``qn('p:cSld')`` returns ``'{http://schemas.../main}cSld'``.
    */
    let prefix, tagroot, uri;
    [prefix, tagroot] = tag.split(":");
    uri = nsmap[prefix];
    return `{${uri}}${tagroot}`;
}

function nsUri(tag) {
    let prefix;
    [prefix, ] = tag.split(":");
    return nsmap[prefix];
}

module.exports = {NamespacePrefixedTag, nsmap, nsdecls, nspfxmap, qn, nsUri}


