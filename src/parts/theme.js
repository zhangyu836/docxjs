/*
Provides ThemePart and related objects
*/

//let path = require('path');
//let fs = require('fs');
let {theme} = require('../templates/defaults');
let {CT} = require('../opc/constants');
let {PackURI} = require('../opc/packuri');
let {XmlPart} = require('../opc/part');
let {Theme} = require('../theme');
class ThemePart extends XmlPart {
    /*
    Proxy for the theme.xml part containing theme definitions for a document
    or glossary.
    */
    static _default(_package) {
        /*
        Return a newly created theme part, containing a default set of
        elements.
        */
        let content_type, element, partname;
        partname = new PackURI("/word/theme/theme1.xml");
        content_type = CT.WML_THEME;
        element = this._default_theme_xml();
        return new this(partname, content_type, element, _package);
    }
    get theme() {
        /*
        The |_Theme| instance containing the theme (<w:theme> element
        proxies) for this theme part.
        */
        return new Theme(this.element);
    }
    static _default_theme_xml() {
        /*
        Return a string containing XML for a default theme part.
        */
        return theme;
    }
}

module.exports = {ThemePart};
