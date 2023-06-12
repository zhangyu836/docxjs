/* Header and footer part objects */
let path = require('path');
//let fs = require('fs');
let {header, footer} = require('../templates/defaults');
let {CT} = require('../opc/constants');
//let {parse_xml} = require('../oxml/xmlhandler');
let {BaseStoryPart} = require('./story');
class FooterPart extends BaseStoryPart {
    /* Definition of a section footer. */
    static _new(_package) {
        /* Return newly created footer part. */
        let content_type, element, partname;
        partname = _package.next_partname(
            (n)=>{return `/word/footer${n}.xml`}
            );
        content_type = CT.WML_FOOTER;
        //element = parse_xml(this._default_footer_xml());
        element = this._default_footer_xml();
        return new this(partname, content_type, element, _package);
    }
    static _default_footer_xml() {
        /* Return bytes containing XML for a default footer part. */
        //let _path = path.join(__dirname, "..", "templates", "default-footer.xml");
        //let xml_bytes = fs.readFileSync(_path, 'utf-8');
        //return xml_bytes;
        return footer;
    }
}
class HeaderPart extends BaseStoryPart {
    /* Definition of a section header. */
    static _new(_package) {
        /* Return newly created header part. */
        let content_type, element, partname;
        partname = _package.next_partname(
            (n)=>{return `/word/header${n}.xml`}
            );
        content_type = CT.WML_HEADER;
        //element = parse_xml(this._default_header_xml());
        element = this._default_header_xml();
        return new this(partname, content_type, element, _package);
    }
    static _default_header_xml() {
        /* Return bytes containing XML for a default header part. */
        //let _path = path.join(__dirname, "..", "templates", "default-header.xml");
        //let xml_bytes = fs.readFileSync(_path, 'utf-8');
        //return xml_bytes;
        return header;
    }
}

module.exports = {FooterPart, HeaderPart};
