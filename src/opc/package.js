/* Objects that implement reading and writing OPC packages. */
let {RT} = require('./constants');
let {PACKAGE_URI, PackURI} = require('./packuri');
let {PartFactory} = require('./partfactory');
let {CorePropertiesPart} = require('./parts/coreprops');
let {PackageReader} = require('./pkgreader');
let {PackageWriter} = require('./pkgwriter');
let {Relationships} = require('./rel');
let {KeyError} = require('../exceptions')



class OpcPackage  {
    /*Main API class for |python-opc|.

    A new instance is constructed by calling the :meth:`open` class method with a path
    to a package file or file-like object containing one.
    */
    after_unmarshal() {
        /*
        Entry point for any post-unmarshaling processing. May be overridden
        by subclasses without forwarding call to super.
        */
        // don't place any code here, just catch call if not overridden by
        // subclass
    }
    get core_properties() {
        /*
        |CoreProperties| object providing read/write access to the Dublin
        Core properties for this document.
        */
        return this._core_properties_part.core_properties;
    }
    iter_rels() {
        /*
        Generate exactly one reference to each relationship in the package by
        performing a depth-first traversal of the rels graph.
        */
        function walk_rels(source, visited = null) {
            let new_source, part;
            if (visited === null) visited = [];
            return {
                [Symbol.iterator]: function* iter() {
                    for (let rel of source.rels.values()) {
                        yield rel;
                        if (rel.is_external) {
                            continue;
                        }
                        part = rel.target_part;
                        if (visited.includes(part)) {
                            continue;
                        }
                        visited.push(part);
                        new_source = part;
                        //for (let rel of walk_rels(new_source, visited))
                        //    yield rel;
                        yield* walk_rels(new_source, visited);
                    }
                }
            }
        }
        let _this = this;
        return {
            [Symbol.iterator]: function* iter() {
                //for (let rel of walk_rels(_this))
                //    yield rel
                yield* walk_rels(_this);
            }
        }
    }
    iter_parts() {
        /*
        Generate exactly one reference to each of the parts in the package by
        performing a depth-first traversal of the rels graph.
        */
        function walk_parts(source, visited = []) {
            return {
                [Symbol.iterator]: function* iter() {
                    for(let rel of source.rels.values()){
                        if (rel.is_external) {
                            continue;
                        }
                        let part = rel.target_part;
                        if(visited.includes(part)){
                            continue;
                        }
                        visited.push(part);
                        yield part;
                        let new_source = part;
                        //for (let part of walk_parts(new_source, visited))
                        //    yield part;
                        yield* walk_parts(new_source, visited);
                    }
                }
            }
        }
        let _this = this;
        return {
            [Symbol.iterator]: function* iter() {
                //for (let part of walk_parts(_this))
                //    yield part;
                yield* walk_parts(_this);
            }
        }
    }

    load_rel(reltype, target, rId, is_external = false) {
        /*
        Return newly added |_Relationship| instance of *reltype* between this
        part and *target* with key *rId*. Target mode is set to
        ``RTM.EXTERNAL`` if *is_external* is |True|. Intended for use during
        load from a serialized package, where the rId is well known. Other
        methods exist for adding a new relationship to the package during
        processing.
        */
        return this.rels.add_relationship(reltype, target, rId, is_external);
    }
    get main_document_part() {
        /*
        Return a reference to the main document part for this package.
        Examples include a document part for a WordprocessingML package, a
        presentation part for a PresentationML package, or a workbook part
        for a SpreadsheetML package.
        */
        return this.part_related_by(RT.OFFICE_DOCUMENT);
    }
    next_partname(template) {
        /*Return a |PackURI| instance representing partname matching *template*.

        The returned part-name has the next available numeric suffix to distinguish it
        from other parts of its type. *template* is a printf (%)-style template string
        containing a single replacement item, a '%d' to be used to insert the integer
        portion of the partname. Example: "/word/header%d.xml"
        */
        let partnames = [];
        for(let part of this.iter_parts()){
            partnames.push(part.partname);
        }
        let candidate_partname;
        for (let n = 1; n < partnames.length + 2; n += 1) {
            candidate_partname = template(n);
            if (!partnames.includes(candidate_partname)) {
                return new PackURI(candidate_partname);
            }
        }
    }
    static open(pkg_file) {
        /*
        Return an |OpcPackage| instance loaded with the contents of
        *pkg_file*.
        */
        let _package, pkg_reader;
        pkg_reader = PackageReader.from_file(pkg_file);
        _package = new this();
        Unmarshaller.unmarshal(pkg_reader, _package, PartFactory);
        return _package;
    }
    part_related_by(reltype) {
        /*
        Return part to which this package has a relationship of *reltype*.
        Raises |KeyError| if no such relationship is found and |ValueError|
        if more than one such relationship is found.
        */
        return this.rels.part_with_reltype(reltype);
    }
    get parts() {
        /*
        Return a list containing a reference to each of the parts in this
        package.
        */
        let parts = [];
        for ( let part of this.iter_parts()){
            parts.push(part)
        }
        return parts;

    }
    relate_to(part, reltype) {
        /*
        Return rId key of relationship to *part*, from the existing
        relationship if there is one, otherwise a newly created one.
        */
        let rel;
        rel = this.rels.get_or_add(reltype, part);
        return rel.rId;
    }
    get rels() {
        /*
        Return a reference to the |Relationships| instance holding the
        collection of relationships for this package.
        */
        if(!this._rels) this._rels = new Relationships(PACKAGE_URI.baseURI);
        return this._rels;
    }
    save(pkg_file) {
        /*
        Save this package to *pkg_file*, where *file* can be either a path to
        a file (a string) or a file-like object.
        */
        for (let part of this.parts)
            part.before_marshal();
        return PackageWriter.write(pkg_file, this.rels, this.parts);
    }
    get _core_properties_part() {
        /*
        |CorePropertiesPart| object related to this package. Creates
        a default core properties part if one is not present (not common).
        */
        let core_properties_part;
        try {
            return this.part_related_by(RT.CORE_PROPERTIES);
        } catch(e) {
            if (e instanceof KeyError) {
                core_properties_part = CorePropertiesPart._default(this);
                this.relate_to(core_properties_part, RT.CORE_PROPERTIES);
                return core_properties_part;
            } else {
                throw e;
            }
        }
    }
}
class Unmarshaller  {
    /*
    Hosts static methods for unmarshalling a package from a |PackageReader|.
    */
    static unmarshal(pkg_reader, _package, part_factory) {
        /*
        Construct graph of parts and realized relationships based on the
        contents of *pkg_reader*, delegating construction of each part to
        *part_factory*. Package relationships are added to *pkg*.
        */
        let parts;
        parts = Unmarshaller._unmarshal_parts(
            pkg_reader, _package, part_factory
        );
        Unmarshaller._unmarshal_relationships(pkg_reader, _package, parts);
        for (let part of Object.values(parts)) {
            part.after_unmarshal();
        }
        _package.after_unmarshal();
    }
    static _unmarshal_parts(pkg_reader, _package, part_factory) {
        /*
        Return a dictionary of |Part| instances unmarshalled from
        *pkg_reader*, keyed by partname. Side-effect is that each part in
        *pkg_reader* is constructed using *part_factory*.
        */
        let parts = {}
        for(let [partname, content_type, reltype, blob] of pkg_reader.iter_sparts()){
            parts[partname] = part_factory(
                partname, content_type, reltype, blob, _package
            )
        }
        return parts
    }
    static _unmarshal_relationships(pkg_reader, _package, parts) {
        /*
        Add a relationship to the source object corresponding to each of the
        relationships in *pkg_reader* with its target_part set to the actual
        target part in *parts*.
        */
        for(let [source_uri, srel] of pkg_reader.iter_srels()) {
            let source = source_uri.valueOf() === '/' ? _package : parts[source_uri];
            let target = srel.is_external ? srel.target_ref :
                parts[srel.target_partname];
            source.load_rel(srel.reltype, target, srel.rId, srel.is_external);
        }
    }
}

module.exports = {OpcPackage};
