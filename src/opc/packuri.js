/*
Provides the PackURI value type along with some useful known pack URI strings
such as PACKAGE_URI.
*/
let path = require('path');
let posixpath = path.posix ? path.posix : path;
let {ValueError} = require('../exceptions');

class PackURI extends String {
    /*
    Provides access to pack URI components such as the baseURI and the
    filename slice. Behaves as |str| otherwise.
    */

    constructor(pack_uri_str) {
        super(pack_uri_str);
        if (! (pack_uri_str.charAt(0) === "/")) {
            let msg = `PackURI must begin with slash, got '${pack_uri_str}'`;
            throw new ValueError(msg);
        }
        this.pack_uri_str = pack_uri_str;
        //this._parsed_path = posixpath.parse(pack_uri_str);
        this._dir = posixpath.dirname(pack_uri_str);
        this._ext = posixpath.extname(pack_uri_str);
        this._base = posixpath.basename(pack_uri_str);
        this._name = this._ext.length>0 ? this._base.slice(0,-this._ext.length) : this._base;
    }
    static from_rel_ref(baseURI, relative_ref){
        /*
        Return a |PackURI| instance containing the absolute pack URI formed by
        translating *relative_ref* onto *baseURI*.
        */
        let abs_uri, joined_uri;
        joined_uri = posixpath.join(baseURI, relative_ref);
        abs_uri = posixpath.resolve(joined_uri);
        return new PackURI(abs_uri);
    }
    get baseURI() {
        /*
        The base URI of this pack URI, the directory portion, roughly
        speaking. E.g. ``'/ppt/slides'`` for ``'/ppt/slides/slide1.xml'``.
        For the package pseudo-partname '/', baseURI is '/'.
        */
        //return this._parsed_path.dir;
        return this._dir;
    }
    get ext() {
        /*
        The extension portion of this pack URI, e.g. ``'xml'`` for
        ``'/word/document.xml'``. Note the period is not included.
        */
        //return this._parsed_path.ext.slice(1);
        return this._ext.slice(1);
    }
    get filename() {
        /*
        The "filename" portion of this pack URI, e.g. ``'slide1.xml'`` for
        ``'/ppt/slides/slide1.xml'``. For the package pseudo-partname '/',
        filename is ''.
        */
        //return this._parsed_path.base;
        return this._base;
    }
    get idx() {
        /*
        Return partname index as integer for tuple partname or None for
        singleton partname, e.g. ``21`` for ``'/ppt/slides/slide21.xml'`` and
        |None| for ``'/ppt/presentation.xml'``.
        */
        let _filename_re = `([a-zA-Z]+)([1-9][0-9]*)`;
        let filename, match, name_part;
        filename = this.filename;
        if (! filename) {
            return null;
        }
        name_part = this._name;//this._parsed_path.name;
        match = name_part.match(_filename_re);
        if (match === null) {
            return null;
        }
        if (match[2]) {
            return parseInt(match[2]);
        }
        return null;
    }
    get membername() {
        /*
        The pack URI with the leading slash stripped off, the form used as
        the Zip file membername for the package item. Returns '' for the
        package pseudo-partname '/'.
        */
        return this.pack_uri_str.slice(1);
    }
    relative_ref(baseURI) {
        /*
        Return string containing relative reference to package item from
        *baseURI*. E.g. PackURI('/ppt/slideLayouts/slideLayout1.xml') would
        return '../slideLayouts/slideLayout1.xml' for baseURI '/ppt/slides'.
        */

        return posixpath.relative(baseURI, this.pack_uri_str);
    }
    get rels_uri() {
        /*
        The pack URI of the .rels part corresponding to the current pack URI.
        Only produces sensible output if the pack URI is a partname or the
        package pseudo-partname '/'.
        */
        let rels_filename, rels_uri_str;
        rels_filename = `${this.filename}.rels`;
        rels_uri_str = posixpath.join(this.baseURI, "_rels", rels_filename);
        return new PackURI(rels_uri_str);
    }
}
let PACKAGE_URI = new PackURI("/");
let CONTENT_TYPES_URI = new PackURI("/[Content_Types].xml");

module.exports = {PACKAGE_URI, PackURI, CONTENT_TYPES_URI};
