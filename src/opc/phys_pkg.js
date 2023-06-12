/*
Provides a general interface to a *physical* OPC package, such as a zip file.
*/
let path = require('path');
let fs = require('fs');
let AdmZip = require('adm-zip');
let {is_string} = require('./compat');
let {CONTENT_TYPES_URI} = require('./packuri');
function isdir(_path){
    return fs.statSync(_path).isDirectory();
}
function PhysPkgReader (pkg_file) {
    /*
    Factory for physical package reader objects.
    */
        let reader_cls;
        if (is_string(pkg_file)) {
            if (isdir(pkg_file)) {
                reader_cls = _DirPkgReader;
            } else {
                reader_cls = _ZipPkgReader;
            }
        } else {
            reader_cls = _ZipPkgReader;
        }
        return new reader_cls(pkg_file);
}
function PhysPkgWriter(pkg_file)  {
    /*
    Factory for physical package writer objects.
    */
    return new _ZipPkgWriter(pkg_file);
}
class _DirPkgReader {
    /*
    Implements |PhysPkgReader| interface for an OPC package extracted into a
    directory.
    */
    constructor(_path) {
        /*
        *path* is the path to a directory containing an expanded package.
        */
        this._path = path.resolve(_path);
    }
    blob_for(pack_uri, xml=false) {
        /*
        Return contents of file corresponding to *pack_uri* in package
        directory.
        */
        let filePath = path.join(this._path, pack_uri.membername)
        if(xml) return fs.readFileSync(filePath, 'utf8');
        else return fs.readFileSync(filePath);
    }
    close() {
        /*
        Provides interface consistency with |ZipFileSystem|, but does
        nothing, a directory file system doesn't need closing.
        */
    }
    get content_types_xml() {
        /*
        Return the `[Content_Types].xml` blob from the package.
        */
        return this.blob_for(CONTENT_TYPES_URI, true);
    }
    rels_xml_for(source_uri) {
        /*
        Return rels item XML for source with *source_uri*, or None if the
        item has no rels item.
        */
        let rels_xml;
        try {
            rels_xml = this.blob_for(source_uri.rels_uri, true);
        } catch(e) {
            if (e.message.includes('no such file or directory')) {
                rels_xml = null;
            } else {
                throw e;
            }
        }
        return rels_xml;
    }
}
class _ZipPkgReader {
    /*
    Implements |PhysPkgReader| interface for a zip file OPC package.
    */
    constructor(pkg_file) {
        if(pkg_file instanceof ArrayBuffer){
            pkg_file = Buffer.from(pkg_file);
        }
        this._zipf = new AdmZip(pkg_file);
    }
    blob_for(pack_uri, xml=false) {
        /*
        Return blob corresponding to *pack_uri*. Raises |ValueError| if no
        matching member is present in zip archive.
        */
        let entry = this._zipf.getEntry(pack_uri.membername)
        if(entry)
            if(xml) return entry.getData().toString();
            else return entry.getData();
        return null;
    }
    close() {
        /*
        Close the zip archive, releasing any resources it is using.
        */
        //this._zipf.close();
    }
    get content_types_xml() {
        /*
        Return the `[Content_Types].xml` blob from the zip package.
        */
        return this.blob_for(CONTENT_TYPES_URI, true);
    }
    rels_xml_for(source_uri) {
        /*
        Return rels item XML for source with *source_uri* or None if no rels
        item is present.
        */
        return this.blob_for(source_uri.rels_uri, true);
    }
}
class _ZipPkgWriter {
    /*
    Implements |PhysPkgWriter| interface for a zip file OPC package.
    */
    constructor(pkg_file) {
        this.pkg_file = pkg_file;
        this._zipf = new AdmZip();
    }

    close() {
        /*
        Close the zip archive, flushing any pending physical writes and
        releasing any resources it's using.
        */
        if(is_string(this.pkg_file)) {
            this._zipf.writeZip(this.pkg_file);
        } else {
            return this._zipf.toBuffer();
        }
    }
    write(pack_uri, blob) {
        /*
        Write *blob* to this zip package with the membername corresponding to
        *pack_uri*.
        */
        this._zipf.addFile(pack_uri.membername, blob)
    }
}

module.exports = {PhysPkgReader, PhysPkgWriter,
    _DirPkgReader, _ZipPkgReader, _ZipPkgWriter};
