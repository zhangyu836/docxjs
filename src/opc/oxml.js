/*
Temporary stand-in for main oxml module that came across with the
PackageReader transplant. Probably much will get replaced with objects from
the pptx.oxml.core and then this module will either get deleted or only hold
the package related custom element classes.
*/
let {NS, RTM, CT} = require('./constants');
let {register_element_cls} = require('../oxml/xmlelemlookup')
let {parse_xml, serializeToString} = require('../oxml/xmlhandler');
let {BaseOxmlElement} = require('../oxml/xmlchemy')

let nsmap = {
    'ct': NS.OPC_CONTENT_TYPES,
    'pr': NS.OPC_RELATIONSHIPS,
    'r':  NS.OFC_RELATIONSHIPS,
}


function serialize_part_xml(part_elm) {
    /*
    Serialize *part_elm* etree element to XML suitable for storage as an XML
    part. That is to say, no insignificant whitespace added for readability,
    and an appropriate XML declaration added with UTF-8 encoding specified.
    */
    let xml;
    let standalone = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>\n";
    if(part_elm.xmlElement) {
        xml = serializeToString(part_elm.xmlElement);
    } else {
        xml = serializeToString(part_elm);
    }
    return standalone + xml;

}
//function serialize_for_reading(element) {
    /*
    Serialize *element* to human-readable XML suitable for tests. No XML
    declaration.
    */
    //return serializeToString(element);

//}

class CT_Default extends BaseOxmlElement {
    /*
    ``<Default>`` element, specifying the default content type to be applied
    to a part with the specified extension.
    */
    get content_type() {
        /*
        String held in the ``ContentType`` attribute of this ``<Default>``
        element.
        */
        return this.getAttribute("ContentType");
    }
    get extension() {
        /*
        String held in the ``Extension`` attribute of this ``<Default>``
        element.
        */
        return this.getAttribute("Extension");
    }
    static _new(ext, content_type) {
        /*
        Return a new ``<Default>`` element with attributes set to parameter
        values.
        */
        let _default, xml;
        xml = `<Default xmlns="${nsmap["ct"]}"/>`;
        _default = parse_xml(xml);
        _default.setAttribute("Extension", ext);
        _default.setAttribute("ContentType", content_type);
        return _default;
    }
}
class CT_Override extends BaseOxmlElement {
    /*
    ``<Override>`` element, specifying the content type to be applied for a
    part with the specified partname.
    */
    get content_type() {
        /*
        String held in the ``ContentType`` attribute of this ``<Override>``
        element.
        */
        return this.getAttribute("ContentType");
    }
    static _new(partname, content_type) {
        /*
        Return a new ``<Override>`` element with attributes set to parameter
        values.
        */
        let override, xml;
        xml = `<Override xmlns="${nsmap["ct"]}"/>`;
        override = parse_xml(xml);
        override.setAttribute("PartName", partname);
        override.setAttribute("ContentType", content_type);
        return override;
    }
    get partname() {
        /*
        String held in the ``PartName`` attribute of this ``<Override>``
        element.
        */
        return this.getAttribute("PartName");
    }
}
class CT_Relationship extends BaseOxmlElement {
    /*
    ``<Relationship>`` element, representing a single relationship from a
    source to a target part.
    */
    static _new(rId, reltype, target, target_mode = RTM.INTERNAL) {
        /*
        Return a new ``<Relationship>`` element.
        */
        let relationship, xml;
        xml = `<Relationship xmlns="${nsmap["pr"]}"/>`;
        relationship = parse_xml(xml);
        relationship.setAttribute("Id", rId);
        relationship.setAttribute("Type", reltype);
        relationship.setAttribute("Target", target);
        if (target_mode === RTM.EXTERNAL) {
            relationship.setAttribute("TargetMode", RTM.EXTERNAL);
        }
        return relationship;
    }
    get rId() {
        /*
        String held in the ``Id`` attribute of this ``<Relationship>``
        element.
        */
        return this.getAttribute("Id");
    }
    get reltype() {
        /*
        String held in the ``Type`` attribute of this ``<Relationship>``
        element.
        */
        return this.getAttribute("Type");
    }
    get target_ref() {
        /*
        String held in the ``Target`` attribute of this ``<Relationship>``
        element.
        */
        return this.getAttribute("Target");
    }
    get target_mode() {
        /*
        String held in the ``TargetMode`` attribute of this
        ``<Relationship>`` element, either ``Internal`` or ``External``.
        Defaults to ``Internal``.
        */
        return this.getAttribute("TargetMode") || RTM.INTERNAL;
    }
}
class CT_Relationships extends BaseOxmlElement {
    /*
    ``<Relationships>`` element, the root element in a .rels file.
    */

    add_rel(rId, reltype, target, is_external = false) {
        /*
        Add a child ``<Relationship>`` element with attributes set according
        to parameter values.
        */
        let relationship, target_mode;
        target_mode = (is_external ? RTM.EXTERNAL : RTM.INTERNAL);
        relationship = CT_Relationship._new(rId, reltype, target, target_mode);
        this.append(relationship);
    }
    static _new() {
        /*
        Return a new ``<Relationships>`` element.
        */
        let relationships, xml;
        xml = `<Relationships xmlns="${nsmap["pr"]}"/>`;
        relationships = parse_xml(xml);
        return relationships;
    }
    get Relationship_lst() {
        /*
        Return a list containing all the ``<Relationship>`` child elements.
        */
        return this.findall("Relationship");
    }
    get xml() {
        /*
        Return XML string for this element, suitable for saving in a .rels
        stream, not pretty printed and with an XML declaration at the top.
        */
        return serialize_part_xml(this);
        //return serialize_part_xml(this.xmlElement);
    }

}
class CT_Types extends BaseOxmlElement {
    /*
    ``<Types>`` element, the container element for Default and Override
    elements in [Content_Types].xml.
    */
    add_default(ext, content_type) {
        /*
        Add a child ``<Default>`` element with attributes set to parameter
        values.
        */
        let _default;
        _default = CT_Default._new(ext, content_type);
        this.append(_default);
    }
    add_override(partname, content_type) {
        /*
        Add a child ``<Override>`` element with attributes set to parameter
        values.
        */
        let override;
        if (content_type===CT.WML_TEMPLATE_MAIN) content_type = CT.WML_DOCUMENT_MAIN;
        override = CT_Override._new(partname, content_type);
        this.append(override);
    }
    get defaults() {
        return this.findall("Default");
    }
    static _new() {
        /*
        Return a new ``<Types>`` element.
        */
        let types, xml;
        xml = `<Types xmlns="${nsmap["ct"]}"/>`;
        types = parse_xml(xml);
        return types;
    }
    get overrides() {
        return this.findall("Override");
    }
}

register_element_cls("Default", CT_Default);
register_element_cls("Override", CT_Override);
register_element_cls("Types", CT_Types);
register_element_cls("Relationship", CT_Relationship);
register_element_cls("Relationships", CT_Relationships);


module.exports = {CT_Default, CT_Override, CT_Relationship, CT_Relationships,
    CT_Types, nsmap, serialize_part_xml};
