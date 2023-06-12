/*
|SettingsPart| and closely related objects
*/
let path = require('path');
//let fs = require('fs');
let {settings} = require('../templates/defaults');
let {CT} = require('../opc/constants');
let {PackURI} = require('../opc/packuri');
let {XmlPart} = require('../opc/part');
//let {parse_xml} = require('../oxml/xmlhandler');
let {Settings} = require('../settings');
class SettingsPart extends XmlPart {
    /*
    Document-level settings part of a WordprocessingML (WML) package.
    */
    static _default(_package) {
        /*
        Return a newly created settings part, containing a default
        `w:settings` element tree.
        */
        let content_type, element, partname;
        partname = new PackURI("/word/settings.xml");
        content_type = CT.WML_SETTINGS;
        //element = parse_xml(this._default_settings_xml());
        element = this._default_settings_xml();
        return new this(partname, content_type, element, _package);
    }
    get settings() {
        /*
        A |Settings| proxy object for the `w:settings` element in this part,
        containing the document-level settings for this document.
        */
        return new Settings(this.element);
    }
    static _default_settings_xml() {
        /*
        Return a bytestream containing XML for a default settings part.
        */
        //let _path = path.join(__dirname, "..", "templates", "default-settings.xml");
        //let xml_bytes = fs.readFileSync(_path, 'utf-8');
        //return xml_bytes;
        return settings;
    }
}

module.exports = {SettingsPart};
