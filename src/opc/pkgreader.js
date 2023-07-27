/*
Provides a low-level, read-only API to a serialized Open Packaging Convention
(OPC) package.
*/
let {RTM, RT} = require('./constants');
let {parse_xml} = require('../oxml/xmlhandler');
let {PACKAGE_URI, PackURI} = require('./packuri');
let {PhysPkgReader} = require('./phys_pkg');
let {CaseInsensitiveDict} = require('./shared');
let {ValueError, KeyError} = require('../exceptions');
let {getType} = require('../oxml/simpletypes')
class PackageReader  {
    /*
    Provides access to the contents of a zip-format OPC package via its
    :attr:`serialized_parts` and :attr:`pkg_srels` attributes.
    */
    constructor(content_types, pkg_srels, sparts) {
        this._pkg_srels = pkg_srels;
        this._sparts = sparts;
    }
    static from_file(pkg_file){
        /*
        Return a |PackageReader| instance loaded with contents of *pkg_file*.
        */
        let content_types, phys_reader, pkg_srels, sparts;
        phys_reader = PhysPkgReader(pkg_file);
        content_types = _ContentTypeMap.from_xml(phys_reader.content_types_xml);
        pkg_srels = PackageReader._srels_for(phys_reader, PACKAGE_URI);
        sparts = PackageReader._load_serialized_parts(
            phys_reader, pkg_srels, content_types
        );
        phys_reader.close();
        return new PackageReader(content_types, pkg_srels, sparts);
    }
    iter_sparts() {
        /*
        Generate a 4-tuple `(partname, content_type, reltype, blob)` for each
        of the serialized parts in the package.
        */
        let _sparts = this._sparts;
        return {
            [Symbol.iterator]: function* iter() {
                for (let s of _sparts)
                    yield [s.partname, s.content_type, s.reltype, s.blob];
            },
        };
    }
    iter_srels() {
        /*
        Generate a 2-tuple `(source_uri, srel)` for each of the relationships
        in the package.
        */
        let _pkg_srels = this._pkg_srels;
        let _sparts = this._sparts
        return {
            [Symbol.iterator]: function *iter() {
                for (let srel of _pkg_srels) {
                    yield [PACKAGE_URI, srel];
                }
                for (let spart of _sparts) {
                    for (let srel of spart.srels) {
                        yield [spart.partname, srel];
                    }
                }
            },
        }
    }
    static _load_serialized_parts(phys_reader, pkg_srels, content_types) {
        /*
        Return a list of |_SerializedPart| instances corresponding to the
        parts in *phys_reader* accessible by walking the relationship graph
        starting with *pkg_srels*.
        */
        let sparts = []
        let part_walker = PackageReader._walk_phys_parts(phys_reader, pkg_srels)
        for(let [partname, blob, reltype, srels] of part_walker){
            let content_type = content_types.getitem(partname);
            let spart = new _SerializedPart(
                partname, content_type, reltype, blob, srels
            )
            sparts.push(spart);
        }

        return sparts
    }
    static _srels_for(phys_reader, source_uri) {
        /*
        Return |_SerializedRelationships| instance populated with
        relationships for source identified by *source_uri*.
        */
        let rels_xml;
        rels_xml = phys_reader.rels_xml_for(source_uri);
        return _SerializedRelationships.load_from_xml(
            source_uri.baseURI, rels_xml);
    }
    static _walk_phys_parts(phys_reader, srels, visited_partnames = null) {
        /*
        Generate a 4-tuple `(partname, blob, reltype, srels)` for each of the
        parts in *phys_reader* by walking the relationship graph rooted at
        srels.
        */
        if (visited_partnames === null) {
            visited_partnames = [];
        }
        return {
            [Symbol.iterator]: function* iter() {
                for (let srel of srels) {
                    if (srel.is_external)
                        continue;
                    let partname = srel.target_partname;
                    if (visited_partnames.includes(partname))
                        continue;
                    visited_partnames.push(partname);
                    let reltype = srel.reltype;
                    let part_srels = PackageReader._srels_for(phys_reader, partname);
                    let blob = phys_reader.blob_for(partname);
                    yield [partname, blob, reltype, part_srels];
                    let next_walker = PackageReader._walk_phys_parts(
                        phys_reader, part_srels, visited_partnames
                    )
                    //for (let [partname, blob, reltype, srels] of next_walker)
                    //    yield [partname, blob, reltype, srels];
                    yield* next_walker;
                }
            },
        };
    }
}
class _ContentTypeMap  {
    /*
    Value type providing dictionary semantics for looking up content type by
    part name, e.g. ``content_type = cti['/ppt/presentation.xml']``.
    */
    constructor() {
        this._overrides = new CaseInsensitiveDict();
        this._defaults = new CaseInsensitiveDict();
    }
    getitem(partname) {
        /*
        Return content type for part identified by *partname*.
        */
        let msg;
        if ( typeof partname == 'string' ||! partname instanceof PackURI) {
            msg = `_ContentTypeMap key must be <type 'PackURI'>, got ${getType(partname)}`;
            throw new KeyError(msg);
        }
        if (this._overrides.has(partname)) {
            return this._overrides.get(partname);
        }
        if (this._defaults.has(partname.ext)) {
            return this._defaults.get(partname.ext);
        }
        msg = `no content type for partname '${partname}' in [Content_Types].xml`;
        throw new KeyError(msg);
    }
    static from_xml(content_types_xml) {
        /*
        Return a new |_ContentTypeMap| instance populated with the contents
        of *content_types_xml*.
        */
        let types_elm = parse_xml(content_types_xml)
        let ct_map = new _ContentTypeMap()
        for (let o of types_elm.overrides)
            ct_map._add_override(o.partname, o.content_type);
        for(let d of types_elm.defaults)
            ct_map._add_default(d.extension, d.content_type)
        return ct_map
    }
    _add_default(extension, content_type) {
        /*
        Add the default mapping of *extension* to *content_type* to this
        content type mapping.
        */
        this._defaults.set(extension, content_type);
    }
    _add_override(partname, content_type) {
        /*
        Add the _default mapping of *partname* to *content_type* to this
        content type mapping.
        */
        this._overrides.set(partname, content_type);
    }
}
class _SerializedPart  {
    /*
    Value object for an OPC package part. Provides access to the partname,
    content type, blob, and serialized relationships for the part.
    */
    constructor(partname, content_type, reltype, blob, srels) {
        this._partname = partname;
        this._content_type = content_type;
        this._reltype = reltype;
        this._blob = blob;
        this._srels = srels;
    }
    get partname() {
        return this._partname;
    }
    get content_type() {
        return this._content_type;
    }
    get blob() {
        return this._blob;
    }
    get reltype() {
        /*
        The referring relationship type of this part.
        */
        return this._reltype;
    }
    get srels() {
        return this._srels;
    }
    toString(){
        return [this._partname, this._content_type, this._reltype, this._blob, this._srels].toString();
    }
}
class _SerializedRelationship  {
    /*
    Value object representing a serialized relationship in an OPC package.
    Serialized, in this case, means any target part is referred to via its
    partname rather than a direct link to an in-memory |Part| object.
    */
    constructor(baseURI, rel_elm) {
        this._baseURI = baseURI;
        this._rId = rel_elm.rId;
        this._reltype = rel_elm.reltype;
        this._target_mode = rel_elm.target_mode;
        this._target_ref = rel_elm.target_ref;
    }
    get is_external() {
        /*
        True if target_mode is ``RTM.EXTERNAL``
        */
        return this._target_mode === RTM.EXTERNAL;
    }
    get reltype() {
        /* Relationship type, like ``RT.OFFICE_DOCUMENT`` */
        return this._reltype;
    }
    get rId() {
        /*
        Relationship id, like 'rId9', corresponds to the ``Id`` attribute on
        the ``CT_Relationship`` element.
        */
        return this._rId;
    }
    get target_mode() {
        /*
        String in ``TargetMode`` attribute of ``CT_Relationship`` element,
        one of ``RTM.INTERNAL`` or ``RTM.EXTERNAL``.
        */
        return this._target_mode;
    }
    get target_ref() {
        /*
        String in ``Target`` attribute of ``CT_Relationship`` element, a
        relative part reference for internal target mode or an arbitrary URI,
        e.g. an HTTP URL, for external target mode.
        */
        return this._target_ref;
    }
    get target_partname() {
        /*
        |PackURI| instance containing partname targeted by this relationship.
        Raises ``ValueError`` on reference if target_mode is ``'External'``.
        Use :attr:`target_mode` to check before referencing.
        */
        let msg;
        if (this.is_external) {
            msg = "target_partname attribute on Relationship is undefined where TargetMode == \"External\"";
            throw new ValueError(msg);
        }
        // lazy-load _target_partname attribute
        if (!this.hasOwnProperty("_target_partname")) {
            this._target_partname = PackURI.from_rel_ref(this._baseURI, this.target_ref);
        }
        return this._target_partname;
    }
}
class _SerializedRelationships  {
    /*
    Read-only sequence of |_SerializedRelationship| instances corresponding
    to the relationships item XML passed to constructor.
    */

    constructor() {
        this._srels = [];
        this[Symbol.iterator] = this.iter;
    }
    *iter() {
        /* Support iteration, e.g. 'for x in srels:' */
        let _srels = this._srels;
        for(let _srel of _srels){
            yield _srel;
        }
    }
    static load_from_xml(baseURI, rels_item_xml) {
        /*
        Return |_SerializedRelationships| instance loaded with the
        relationships contained in *rels_item_xml*. Returns an empty
        collection if *rels_item_xml* is |None|.
        */
        let rels_elm, srels;
        srels = new _SerializedRelationships();
        if (rels_item_xml !== null) {
            rels_elm = parse_xml(rels_item_xml);
            for(let rel_elm of rels_elm.Relationship_lst)
                srels._srels.push(new _SerializedRelationship(baseURI, rel_elm));
        }
        return srels;
    }
}

module.exports = {PackageReader, _ContentTypeMap, _SerializedPart,
    _SerializedRelationship, _SerializedRelationships} ;
