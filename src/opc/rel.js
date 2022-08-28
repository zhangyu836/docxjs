
/*
Relationship-related objects.
*/
let {CT_Relationships} = require('./oxml');
let {ValueError, KeyError} = require('../exceptions')

class Relationships extends Map {
    /*
    Collection object for |_Relationship| instances, having list semantics.
    */
    constructor(baseURI) {
        super();
        this._baseURI = baseURI;
        this._target_parts_by_rId = {};
    }
    add_relationship(reltype, target, rId, is_external = false) {
        /*
        Return a newly added |_Relationship| instance.
        */
        let rel;
        rel = new _Relationship(rId, reltype, target, this._baseURI, is_external);
        this.set(rId, rel);
        if (! is_external) {
            this._target_parts_by_rId[rId] = target;
        }
        return rel;
    }
    get_or_add(reltype, target_part) {
        /*
        Return relationship of *reltype* to *target_part*, newly added if not
        already present in collection.
        */
        let rId, rel;
        rel = this._get_matching(reltype, target_part);
        if (rel === null) {
            rId = this._next_rId;
            rel = this.add_relationship(reltype, target_part, rId);
        }
        return rel;
    }
    get_or_add_ext_rel(reltype, target_ref) {
        /*
        Return rId of external relationship of *reltype* to *target_ref*,
        newly added if not already present in collection.
        */
        let rId, rel;
        rel = this._get_matching(reltype, target_ref, true);
        if (rel === null) {
            rId = this._next_rId;
            rel = this.add_relationship(reltype, target_ref, rId, true);
        }
        return rel.rId;
    }
    part_with_reltype(reltype) {
        /*
        Return target part of rel with matching *reltype*, raising |KeyError|
        if not found and |ValueError| if more than one matching relationship
        is found.
        */
        let rel;
        rel = this._get_rel_of_type(reltype);
        return rel.target_part;
    }
    get related_parts() {
        /*
        map mapping rIds to target parts for all the internal relationships
        in the collection.
        */
        return this._target_parts_by_rId;
    }
    get xml() {
        /*
        Serialize this relationship collection into XML suitable for storage
        as a .rels file in an OPC package.
        */
        let rels_elm;
        rels_elm = CT_Relationships._new();
        for(let rel of this.values()) {
            rels_elm.add_rel(
                rel.rId, rel.reltype, rel.target_ref, rel.is_external
            )
        }
        return rels_elm.xml;
    }
    _get_matching(reltype, target, is_external = false) {
        /*
        Return relationship of matching *reltype*, *target*, and
        *is_external* from collection, or None if not found.
        */
        function matches (rel, reltype, target, is_external) {
            let rel_target;
            if (rel.reltype !== reltype) {
                return false;
            }
            if (rel.is_external !== is_external) {
                return false;
            }
            rel_target = rel.is_external ? rel.target_ref : rel.target_part;
            return rel_target === target;

        }
        for (let rel of this.values()) {
            if (matches(rel, reltype, target, is_external)) {
                return rel;
            }
        }
        return null;
    }
    _get_rel_of_type(reltype) {
        /*
        Return single relationship of type *reltype* from the collection.
        Raises |KeyError| if no matching relationship is found. Raises
        |ValueError| if more than one matching relationship is found.
        */
        let matching = [];
        let msg;
        for(let rel of this.values()){
            if( rel.reltype === reltype){
                matching.push(rel);
            }
        }
        if (matching.length === 0) {
            msg = `no relationship of type '${reltype}' in collection`;
            throw new KeyError(msg);
        }
        if (matching.length > 1) {
            msg = `multiple relationships of type '${reltype}' in collection`;
            throw new ValueError(msg);
        }
        return matching[0];
    }
    get _next_rId() {
        /*
        Next available rId in collection, starting from 'rId1' and making use
        of any gaps in numbering, e.g. 'rId2' for rIds ['rId1', 'rId3'].
        */
        let rId_candidate;
        for (let n = 1; n < this.size + 2; n += 1) {
            rId_candidate = `rId${n}`;
            if (!this.has(rId_candidate)) {
                return rId_candidate;
            }
        }
    }
}
class _Relationship  {
    /*
    Value object for relationship to part.
    */
    constructor(rId, reltype, target, baseURI, external = false) {
        this._rId = rId;
        this._reltype = reltype;
        this._target = target;
        this._baseURI = baseURI;
        this._is_external = Boolean(external);
    }
    get is_external() {
        return this._is_external;
    }
    get reltype() {
        return this._reltype;
    }
    get rId() {
        return this._rId;
    }
    get target_part() {
        if (this._is_external) {
            throw new ValueError("target_part property on _Relationship is" +
                " undefined when target mode is External");
        }
        return this._target;
    }
    get target_ref() {
        if (this._is_external) {
            return this._target;
        } else {
            return this._target.partname.relative_ref(this._baseURI);
        }
    }
}

module.exports = {Relationships, _Relationship};
