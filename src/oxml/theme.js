/*
Custom element classes related to the theme part
*/
let {WD_STYLE_TYPE} = require('../enum/style');
let {ST_DecimalNumber, ST_OnOff, ST_String} = require('./simpletypes');
let {BaseOxmlElement, OptionalAttribute, RequiredAttribute,
    ZeroOrMore, ZeroOrOne} = require('./xmlchemy');

class CT_Theme extends BaseOxmlElement {
    /*
    ``<a:theme>`` element, the root element of a theme part, i.e.
    */
    themeElements = new ZeroOrOne('a:themeElements');
    //objectDefaults = new ZeroOrOne('a:objectDefaults');
    //extraClrSchemeLst = new ZeroOrMore('a:extraClrSchemeLst');
}

class CT_ThemeElements extends BaseOxmlElement {
    /*
    `a:themeElements` element.
    */
    //clrScheme = new ZeroOrOne('a:clrScheme');
    fontScheme = new ZeroOrOne('a:fontScheme');
    //fmtScheme = new ZeroOrOne('a:fmtScheme');
}

class CT_FontScheme extends BaseOxmlElement {
    /*
    `a:fontScheme` element.
    */
    majorFont = new ZeroOrOne('a:majorFont');
    minorFont = new ZeroOrOne('a:minorFont');
}

class CT_MajorMinorFont extends BaseOxmlElement {
    /*
    `a:majorFont` or `a:minorFont` element.
    */
    latin = new ZeroOrOne('a:latin');
    ea = new ZeroOrOne('a:ea');
    cs = new ZeroOrOne('a:cs');
    font = new ZeroOrMore('a:font');
}

class CT_Font extends BaseOxmlElement {
    script = new OptionalAttribute('script', ST_String, '');
    typeface = new OptionalAttribute('typeface', ST_String, '');
}

module.exports = {CT_Theme, CT_ThemeElements, CT_FontScheme, CT_MajorMinorFont, CT_Font} ;


