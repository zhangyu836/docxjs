
/*
Objects shared by modules in the docx.oxml subpackage.
*/
let {OxmlElement} = require('./xmlchemy');
let {ST_DecimalNumber, ST_OnOff, ST_String} = require('./simpletypes');
let {BaseOxmlElement, OptionalAttribute, RequiredAttribute} = require('./xmlchemy');


class CT_DecimalNumber extends BaseOxmlElement {
    /*
    Used for ``<w:numId>``, ``<w:ilvl>``, ``<w:abstractNumId>`` and several
    others, containing a text representation of a decimal number (e.g. 42) in
    its ``val`` attribute.
    */
    val = new RequiredAttribute('w:val', ST_DecimalNumber)
    static _new(nsptagname, val) {
        /*
        Return a new ``CT_DecimalNumber`` element having tagname *nsptagname*
        and ``val`` attribute set to *val*.
        */
        return OxmlElement(nsptagname, {"val": String(val)});
    }
}

class CT_OnOff extends BaseOxmlElement {
    /*
    Used for ``<w:b>``, ``<w:i>`` elements and others, containing a bool-ish
    string in its ``val`` attribute, xsd:boolean plus 'on' and 'off'.
    */
    val = new OptionalAttribute('w:val', ST_OnOff, true);
}

class CT_String extends BaseOxmlElement {
    /*
    Used for ``<w:pStyle>`` and ``<w:tblStyle>`` elements and others,
    containing a style name in its ``val`` attribute.
    */
    val = new RequiredAttribute('w:val', ST_String);
    static _new(nsptagname, val) {
        /*
        Return a new ``CT_String`` element with tagname *nsptagname* and
        ``val`` attribute set to *val*.
        */
        let elm;
        elm = OxmlElement(nsptagname);
        elm.val = val;
        return elm;
    }
}

module.exports = {CT_DecimalNumber, CT_String, CT_OnOff};
