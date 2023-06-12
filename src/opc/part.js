
/*
Open Packaging Convention (OPC) objects related to _package parts.
*/
let {serialize_part_xml} = require('./oxml');
let {parse_xml} = require('../oxml/xmlhandler');
let {PackURI} = require('./packuri');
let {Relationships} = require('./rel');
let {getType} = require('../oxml/simpletypes');
let {is_string} = require('./compat');



class Part {
    /*
    Base class for package parts. Provides common properties and methods, but
    intended to be subclassed in client code to implement specific part
    behaviors.
    */
    constructor(partname, content_type, blob = null, _package = null) {
        this._partname = partname;
        this._content_type = content_type;
        this._blob = blob;
        this._package = _package;
    }

    after_unmarshal() {
        /*
        Entry point for post-unmarshaling processing, for example to parse
        the part XML. May be overridden by subclasses without forwarding call
        to super.
        */
        // don't place any code here, just catch call if not overridden by
        // subclass
    }

    before_marshal() {
        /*
        Entry point for pre-serialization processing, for example to finalize
        part naming if necessary. May be overridden by subclasses without
        forwarding call to super.
        */
        // don't place any code here, just catch call if not overridden by
        // subclass
    }

    get blob() {
        /*
        Contents of this _package part as a sequence of bytes. May be text or
        binary. Intended to be overridden by subclasses. Default behavior is
        to return load blob.
        */
        return this._blob;
    }

    get content_type() {
        /*
        Content type of this part.
        */
        return this._content_type;
    }

    drop_rel(rId) {
        /*
        Remove the relationship identified by *rId* if its reference count
        is less than 2. Relationships with a reference count of 0 are
        implicit relationships.
        */
        if (this._rel_ref_count(rId) < 2) {
            this.rels.delete(rId);
        }
    }

    static load(partname, content_type, blob, _package) {
        return new this(partname, content_type, blob, _package);
    }

    load_rel(reltype, target, rId, is_external = false) {
        /*
        Return newly added |_Relationship| instance of *reltype* between this
        part and *target* with key *rId*. Target mode is set to
        ``RTM.EXTERNAL`` if *is_external* is |True|. Intended for use during
        load from a serialized package, where the rId is well-known. Other
        methods exist for adding a new relationship to a part when
        manipulating a part.
        */
        return this.rels.add_relationship(reltype, target, rId, is_external);
    }

    //get _package() {
        /*
        |OpcPackage| instance this part belongs to.
        */
    //    return this._package;
    //}

    get partname() {
        /*
        |PackURI| instance holding partname of this part, e.g.
        '/ppt/slides/slide1.xml'
        */
        return this._partname;
    }

    set partname(partname) {
        if (!(partname instanceof PackURI)) {
            let msg = `partname must be instance of PackURI, got '${getType(partname)}'`;
            throw new TypeError(msg);
        }
        this._partname = partname;
    }

    part_related_by(reltype) {
        /*
        Return part to which this part has a relationship of *reltype*.
        Raises |KeyError| if no such relationship is found and |ValueError|
        if more than one such relationship is found. Provides ability to
        resolve implicitly related part, such as Slide -> SlideLayout.
        */
        return this.rels.part_with_reltype(reltype);
    }

    relate_to(target, reltype, is_external = false) {
        /*
        Return rId key of relationship of *reltype* to *target*, from an
        existing relationship if there is one, otherwise a newly created one.
        */
        let rel;
        if (is_external) {
            return this.rels.get_or_add_ext_rel(reltype, target);
        } else {
            rel = this.rels.get_or_add(reltype, target);
            return rel.rId;
        }
    }

    get related_parts() {
        /*
        Dictionary mapping related parts by rId, so child objects can resolve
        explicit relationships present in the part XML, e.g. sldIdLst to a
        specific |Slide| instance.
        */
        return this.rels.related_parts;
    }

    get rels() {
        /*
        |Relationships| instance holding the relationships for this part.
        */
        if(!this._rels) this._rels = new Relationships(this._partname.baseURI);
        return this._rels;
    }

    target_ref(rId) {
        /*
        Return URL contained in target ref of relationship identified by
        *rId*.
        */
        let rel;
        rel = this.rels.get(rId);
        return rel.target_ref;
    }

    _rel_ref_count(rId) {
        /*
        Return the count of references in this part's XML to the relationship
        identified by *rId*.
        */
        let rIds;
        rIds = this.element.xpath("//@r:id");
        //let a = [];
        let l = 0;
        for (let _rId of rIds) {
            if (_rId.value === rId) {
                l++;//a.push(_rId);
            }
        }
        return l;
        //return a.length;
    }
}


class XmlPart extends Part {
    /*
    Base class for package parts containing an XML payload, which is most of
    them. Provides additional methods to the |Part| base class that take care
    of parsing and reserializing the XML payload and managing relationships
    to other parts.
    */
    constructor(partname, content_type, blob_or_str, _package) {
        super(partname, content_type, null, _package);
        this._element = null;
        this.blob_or_str = blob_or_str;
    }
    get blob() {
        return serialize_part_xml(this.element);
    }
    get element() {
        /*
        The root XML element of this XML part.
        */
        if(this._element) return this._element;
        let xml;
        if(is_string(this.blob_or_str)) {
           xml = this.blob_or_str;
        } else {
            xml = this.blob_or_str.toString();
        }
        this._element = parse_xml(xml);
        return this._element;
    }
    static load(partname, content_type, blob_or_str, _package) {
        return new this(partname, content_type, blob_or_str, _package);
    }
    get part() {
        /*
        Part of the parent protocol, "children" of the document will not know
        the part that contains them so must ask their parent object. That
        chain of delegation ends here for child objects.
        */
        return this;
    }
}

module.exports = { XmlPart, Part};

