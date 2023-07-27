/*
Provides StylesPart and related objects
*/

//let path = require('path');
//let fs = require('fs');
let {styles} = require('../templates/defaults');
let {CT} = require('../opc/constants');
let {PackURI} = require('../opc/packuri');
let {XmlPart} = require('../opc/part');
//let {parse_xml} = require('../oxml/xmlhandler');
let {Styles} = require('../styles/styles');
class StylesPart extends XmlPart {
    /*
    Proxy for the styles.xml part containing style definitions for a document
    or glossary.
    */
    static _default(_package) {
        /*
        Return a newly created styles part, containing a default set of
        elements.
        */
        let content_type, element, partname;
        partname = new PackURI("/word/styles.xml");
        content_type = CT.WML_STYLES;
        //element = parse_xml(this._default_styles_xml());
        element = this._default_styles_xml();
        return new this(partname, content_type, element, _package);
    }
    get styles() {
        /*
        The |_Styles| instance containing the styles (<w:style> element
        proxies) for this styles part.
        */
        return new Styles(this.element);
    }
    static _default_styles_xml() {
        /*
        Return a bytestream containing XML for a default styles part.
        */
        //let _path = path.join(__dirname, "..", "templates", "default-styles.xml");
        //let xml_bytes = fs.readFileSync(_path, 'utf-8');
        //return xml_bytes;
        return styles;
    }
}

module.exports = {StylesPart};
