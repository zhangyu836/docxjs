/*
Core properties part, corresponds to ``/docProps/core.xml`` part in package.
*/

let {CT} = require('../constants');
let {CoreProperties} = require('../coreprops');
let {CT_CoreProperties} = require('../../oxml/coreprops');
let {PackURI} = require('../packuri');
let {XmlPart} = require('../part');
class CorePropertiesPart extends XmlPart {
    /*
    Corresponds to part named ``/docProps/core.xml``, containing the core
    document properties for this document package.
    */

    static _default(_package) {
        /*
        Return a new |CorePropertiesPart| object initialized with default
        values for its base properties.
        */
        let core_properties, core_properties_part;
        core_properties_part = this._new(_package);
        core_properties = core_properties_part.core_properties;
        core_properties.title = "Word Document";
        core_properties.last_modified_by = "docxjs";
        core_properties.revision = 1;
        core_properties.modified = new Date();
        return core_properties_part;
    }
    get core_properties() {
        /*
        A |CoreProperties| object providing read/write access to the core
        properties contained in this core properties part.
        */
        if(!this._core_properties) this._core_properties = new CoreProperties(this.element);
        return this._core_properties;
    }
    static _new(_package) {
        let content_type, coreProperties, partname;
        partname = new PackURI("/docProps/core.xml");
        content_type = CT.OPC_CORE_PROPERTIES;
        coreProperties = CT_CoreProperties._new();
        return new CorePropertiesPart(partname, content_type, coreProperties, _package);
    }
}

module.exports = {CorePropertiesPart};
