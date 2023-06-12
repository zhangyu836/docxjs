/*
Provides a low-level, write-only API to a serialized Open Packaging
Convention (OPC) package, essentially an implementation of OpcPackage.save()
*/
let {CT} = require('./constants');
let {CT_Types, serialize_part_xml} = require('./oxml');
let {CONTENT_TYPES_URI, PACKAGE_URI} = require('./packuri');
let {PhysPkgWriter} = require('./phys_pkg');
let {CaseInsensitiveDict} = require('./shared');
let {default_content_types} = require('./spec');


class PackageWriter  {
    /*
    Writes a zip-format OPC package to *pkg_file*, where *pkg_file* can be
    either a path to a zip file (a string) or a file-like object. Its single
    API method, :meth:`write`, is static, so this class is not intended to
    be instantiated.
    */
    static write(pkg_file, pkg_rels, parts) {
        /*
        Write a physical package (.pptx file) to *pkg_file* containing
        *pkg_rels* and *parts* and a content types stream based on the
        content types of the parts.
        */
        let phys_writer;
        phys_writer = PhysPkgWriter(pkg_file);
        PackageWriter._write_content_types_stream(phys_writer, parts);
        PackageWriter._write_pkg_rels(phys_writer, pkg_rels);
        PackageWriter._write_parts(phys_writer, parts);
        return phys_writer.close();
    }
    static _write_content_types_stream(phys_writer, parts) {
        /*
        Write ``[Content_Types].xml`` part to the physical package with an
        appropriate content type lookup target for each part in *parts*.
        */
        let cti;
        cti = _ContentTypesItem.from_parts(parts);
        phys_writer.write(CONTENT_TYPES_URI, cti.blob);
    }
    static _write_parts(phys_writer, parts) {
        /*
        Write the blob of each part in *parts* to the package, along with a
        rels item for its relationships if and only if it has any.
        */
        for (let part of parts) {
            phys_writer.write(part.partname, part.blob);
            if (part._rels.size>0) {
                phys_writer.write(part.partname.rels_uri, part._rels.xml);
            }
        }
    }
    static _write_pkg_rels(phys_writer, pkg_rels) {
        /*
        Write the XML rels item for *pkg_rels* ('/_rels/.rels') to the
        package.
        */
        phys_writer.write(PACKAGE_URI.rels_uri, pkg_rels.xml);
    }
}
class _ContentTypesItem  {
    /*
    Service class that composes a content types item ([Content_Types].xml)
    based on a list of parts. Not meant to be instantiated directly, its
    single interface method is xml_for(), e.g.
    ``_ContentTypesItem.xml_for(parts)``.
    */
    constructor() {
        this._defaults = new CaseInsensitiveDict();
        this._overrides = new Map();
    }
    get blob() {
        /*
        Return XML form of this content types item, suitable for storage as
        ``[Content_Types].xml`` in an OPC package.
        */
        return serialize_part_xml(this.element);
    }
    static from_parts(parts) {
        /*
        Return content types XML mapping each part in *parts* to the
        appropriate content type and suitable for storage as
        ``[Content_Types].xml`` in an OPC package.
        */
        let cti;
        cti = new this();
        cti._defaults.set("rels", CT.OPC_RELATIONSHIPS);
        cti._defaults.set("xml", CT.XML);
        for (let part of parts) {
            cti._add_content_type(part.partname, part.content_type);
        }
        return cti;
    }
    _add_content_type(partname, content_type) {
        /*
        Add a content type for the part with *partname* and *content_type*,
        using a default or override as appropriate.
        */
        let ext;
        ext = partname.ext;
        if (default_content_types.contains([ext.toLowerCase(), content_type])) {
            this._defaults.set(ext, content_type);
        } else {
            this._overrides.set(partname, content_type);
        }
    }
    get element() {
        /*
        Return XML form of this content types item, suitable for storage as
        ``[Content_Types].xml`` in an OPC package. Although the sequence of
        elements is not strictly significant, as an aid to testing and
        readability Default elements are sorted by extension and Override
        elements are sorted by partname.
        */
        let _types_elm;
        _types_elm = CT_Types._new();
        let keys = [...this._defaults.keys()];
        for (let ext of keys.sort()) {
            _types_elm.add_default(ext, this._defaults.get(ext));
        }
        keys = [...this._overrides.keys()];
        for (let partname of keys.sort()) {
            _types_elm.add_override(partname, this._overrides.get(partname));
        }
        return _types_elm;
    }
}

module.exports = {PackageWriter, _ContentTypesItem};
