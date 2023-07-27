/*
Custom element classes related to run properties (font).
*/
let {parse_xml} = require('../xmlhandler');
let {MSO_THEME_COLOR} = require('../../enum/dml');
let {WD_COLOR, WD_UNDERLINE} = require('../../enum/text');
let {nsdecls} = require('../ns');
let {ST_HexColor, ST_HpsMeasure, ST_String, ST_VerticalAlignRun} = require('../simpletypes');
let {BaseOxmlElement, OptionalAttribute, RequiredAttribute, ZeroOrOne} = require('../xmlchemy');


class CT_Color extends BaseOxmlElement {
    /*
    `w:color` element, specifying the color of a font and perhaps other
    objects.
    */
    val = new RequiredAttribute('w:val', ST_HexColor);
    themeColor = new OptionalAttribute('w:themeColor', MSO_THEME_COLOR);
}

class CT_Fonts extends BaseOxmlElement {
    /*
    ``<w:rFonts>`` element, specifying typeface name for the various language
    types.
    */
    ascii = new OptionalAttribute('w:ascii', ST_String);
    hAnsi = new OptionalAttribute('w:hAnsi', ST_String);
    eastAsia = new OptionalAttribute('w:eastAsia', ST_String);
    cs = new OptionalAttribute('w:cs', ST_String);
    asciiTheme = new OptionalAttribute('w:asciiTheme', ST_String);
    hAnsiTheme = new OptionalAttribute('w:hAnsiTheme', ST_String);
    eastAsiaTheme = new OptionalAttribute('w:eastAsiaTheme', ST_String);
    csTheme = new OptionalAttribute('w:csTheme', ST_String);
    hint = new OptionalAttribute('w:hint', ST_String);
}

class CT_Highlight extends BaseOxmlElement {
    /*
    `w:highlight` element, specifying font highlighting/background color.
    */
    val = new RequiredAttribute('w:val', WD_COLOR);
    get color() {
        return WD_COLOR.to_xml(this.val);
    }
}

class CT_HpsMeasure extends BaseOxmlElement {
    /*
    Used for ``<w:sz>`` element and others, specifying font size in
    half-points.
    */
    val = new RequiredAttribute('w:val', ST_HpsMeasure);
}
let _tag_seq = [
    'w:rStyle', 'w:rFonts', 'w:b', 'w:bCs', 'w:i', 'w:iCs', 'w:caps',
    'w:smallCaps', 'w:strike', 'w:dstrike', 'w:outline', 'w:shadow',
    'w:emboss', 'w:imprint', 'w:noProof', 'w:snapToGrid', 'w:vanish',
    'w:webHidden', 'w:color', 'w:spacing', 'w:w', 'w:kern', 'w:position',
    'w:sz', 'w:szCs', 'w:highlight', 'w:u', 'w:effect', 'w:bdr', 'w:shd',
    'w:fitText', 'w:vertAlign', 'w:rtl', 'w:cs', 'w:em', 'w:lang',
    'w:eastAsianLayout', 'w:specVanish', 'w:oMath'
]
class CT_RPr extends BaseOxmlElement {
    /*
    ``<w:rPr>`` element, containing the properties for a run.
     */

    rStyle = new ZeroOrOne('w:rStyle', _tag_seq.slice(1));
    rFonts = new ZeroOrOne('w:rFonts', _tag_seq.slice(2));
    b = new ZeroOrOne('w:b', _tag_seq.slice(3));
    bCs = new ZeroOrOne('w:bCs', _tag_seq.slice(4));
    i = new ZeroOrOne('w:i', _tag_seq.slice(5));
    iCs = new ZeroOrOne('w:iCs', _tag_seq.slice(6));
    caps = new ZeroOrOne('w:caps', _tag_seq.slice(7));
    smallCaps = new ZeroOrOne('w:smallCaps', _tag_seq.slice(8));
    strike = new ZeroOrOne('w:strike', _tag_seq.slice(9));
    dstrike = new ZeroOrOne('w:dstrike', _tag_seq.slice(10));
    outline = new ZeroOrOne('w:outline', _tag_seq.slice(11));
    shadow = new ZeroOrOne('w:shadow', _tag_seq.slice(12));
    emboss = new ZeroOrOne('w:emboss', _tag_seq.slice(13));
    imprint = new ZeroOrOne('w:imprint', _tag_seq.slice(14));
    noProof = new ZeroOrOne('w:noProof', _tag_seq.slice(15));
    snapToGrid = new ZeroOrOne('w:snapToGrid', _tag_seq.slice(16));
    vanish = new ZeroOrOne('w:vanish', _tag_seq.slice(17));
    webHidden = new ZeroOrOne('w:webHidden', _tag_seq.slice(18));
    color = new ZeroOrOne('w:color', _tag_seq.slice(19));
    sz = new ZeroOrOne('w:sz', _tag_seq.slice(24));
    highlight = new ZeroOrOne('w:highlight', _tag_seq.slice(26));
    u = new ZeroOrOne('w:u', _tag_seq.slice(27));
    bdr = new ZeroOrOne('w:bdr', _tag_seq.slice(29));
    vertAlign = new ZeroOrOne('w:vertAlign', _tag_seq.slice(32));
    rtl = new ZeroOrOne('w:rtl', _tag_seq.slice(33));
    cs = new ZeroOrOne('w:cs', _tag_seq.slice(34));
    lang = new ZeroOrOne('w:lang', _tag_seq.slice(36));
    specVanish = new ZeroOrOne('w:specVanish', _tag_seq.slice(38));
    oMath = new ZeroOrOne('w:oMath', _tag_seq.slice(39));
    //delete _tag_seq

    _new_color(self) {
        /*
        Override metaclass method to set `w:color/@val` to RGB black on
        create.
        */
        return parse_xml(`<w:color ${nsdecls("w")} w:val="000000"/>`);
    }
    get highlight_val() {
        /*
        Value of `w:highlight/@val` attribute, specifying a font's highlight
        color, or `None` if the text is not highlighted.
        */
        let highlight;
        highlight = this.highlight;
        if (highlight === null) {
            return null;
        }
        return highlight.val;
    }
    set highlight_val(value) {
        let highlight;
        if (value === null) {
            this._remove_highlight();
            return;
        }
        highlight = this.get_or_add_highlight();
        highlight.val = value;
    }
    get rFonts_ascii() {
        /*
        The value of `w:rFonts/@w:ascii` or |None| if not present. Represents
        the assigned typeface name. The rFonts element also specifies other
        special-case typeface names; this method handles the case where just
        the common name is required.
        */
        let rFonts;
        rFonts = this.rFonts;
        if (rFonts === null) {
            return null;
        }
        return rFonts.ascii;
    }
    set rFonts_ascii(value) {
        let rFonts;
        if (value === null) {
            this._remove_rFonts();
            return;
        }
        rFonts = this.get_or_add_rFonts();
        rFonts.ascii = value;
    }
    get rFonts_hAnsi() {
        /*
        The value of `w:rFonts/@w:hAnsi` or |None| if not present.
        */
        let rFonts;
        rFonts = this.rFonts;
        if (rFonts === null) {
            return null;
        }
        return rFonts.hAnsi;
    }
    set rFonts_hAnsi(value) {
        let rFonts;
        if ((value === null) && (this.rFonts === null)) {
            return;
        }
        rFonts = this.get_or_add_rFonts();
        rFonts.hAnsi = value;
    }
    get style() {
        /*
        String contained in <w:rStyle> child, or None if that element is not
        present.
        */
        let rStyle;
        rStyle = this.rStyle;
        if (rStyle === null) {
            return null;
        }
        return rStyle.val;
    }
    set style(style) {
        /*
        Set val attribute of <w:rStyle> child element to *style*, adding a
        new element if necessary. If *style* is |None|, remove the <w:rStyle>
        element if present.
        */
        if (style === null) {
            this._remove_rStyle();
        } else {
            if (this.rStyle === null) {
                this._add_rStyle({"val": style});
            } else {
                this.rStyle.val = style;
            }
        }
    }
    get subscript() {
        /*
        |True| if `w:vertAlign/@w:val` is 'subscript'. |False| if
        `w:vertAlign/@w:val` contains any other value. |None| if
        `w:vertAlign` is not present.
        */
        let vertAlign;
        vertAlign = this.vertAlign;
        if (vertAlign === null) {
            return null;
        }
        return (vertAlign.val === ST_VerticalAlignRun.SUBSCRIPT);

    }
    set subscript(value) {
        if (value === null) {
            this._remove_vertAlign();
        } else {
            if ((Boolean(value) === true)) {
                this.get_or_add_vertAlign().val = ST_VerticalAlignRun.SUBSCRIPT;
            } else {
                if (this.vertAlign === null) {

                } else {
                    if ((this.vertAlign.val === ST_VerticalAlignRun.SUBSCRIPT)) {
                        this._remove_vertAlign();
                    }
                }
            }
        }
    }
    get superscript() {
        /*
        |True| if `w:vertAlign/@w:val` is 'superscript'. |False| if
        `w:vertAlign/@w:val` contains any other value. |None| if
        `w:vertAlign` is not present.
        */
        let vertAlign;
        vertAlign = this.vertAlign;
        if (vertAlign === null) {
            return null;
        }
        return (vertAlign.val === ST_VerticalAlignRun.SUPERSCRIPT);

    }
    set superscript(value) {
        if (value === null) {
            this._remove_vertAlign();
        } else {
            if (Boolean(value) === true) {
                this.get_or_add_vertAlign().val = ST_VerticalAlignRun.SUPERSCRIPT;
            } else {
                if (this.vertAlign === null) {

                } else {
                    if ((this.vertAlign.val === ST_VerticalAlignRun.SUPERSCRIPT)) {
                        this._remove_vertAlign();
                    }
                }
            }
        }
    }
    get sz_val() {
        /*
        The value of `w:sz/@w:val` or |None| if not present.
        */
        let sz;
        sz = this.sz;
        if (sz === null) {
            return null;
        }
        return sz.val;
    }
    set sz_val(value) {
        let sz;
        if (value === null) {
            this._remove_sz();
            return;
        }
        sz = this.get_or_add_sz();
        sz.val = value;
    }
    get u_val() {
        /*
        Value of `w:u/@val`, or None if not present.
        */
        let u;
        u = this.u;
        if (u === null) {
            return null;
        }
        return u.val;
    }
    set u_val(value) {
        this._remove_u();
        if (value !== null) {
            this._add_u().val = value;
        }
    }
    _get_bool_val(name) {
        /*
        Return the value of the boolean child element having *name*, e.g.
        'b', 'i', and 'smallCaps'.
        */
        let element;
        element = this[name];
        if (element === null) {
            return null;
        }
        return element.val;
    }
    _set_bool_val(name, value) {
        let element;
        if (value === null) {
            this[`_remove_${name}`]();
            return;
        }
        element = this[`get_or_add_${name}`]();
        element.val = value;
    }
}

class CT_Underline extends BaseOxmlElement {
    /*
    ``<w:u>`` element, specifying the underlining style for a run.
    */
    get val() {
        /*
        The underline type corresponding to the ``w:val`` attribute value.
        */
        let underline, val;
        val = this.getAttribute("w:val");
        underline = WD_UNDERLINE.from_xml(val);
        if (underline === WD_UNDERLINE.SINGLE) {
            return true;
        }
        if (underline === WD_UNDERLINE.NONE) {
            return false;
        }
        return underline;
    }
    set val(value) {
        let val;
        if (value === true) {
            value = WD_UNDERLINE.SINGLE;
        } else {
            if (value === false) {
                value = WD_UNDERLINE.NONE;
            }
        }
        val = WD_UNDERLINE.to_xml(value);
        this.setAttribute("w:val", val);
    }
}
class CT_VerticalAlignRun extends BaseOxmlElement {
    /*
    ``<w:vertAlign>`` element, specifying subscript or superscript.
    */
    val = new RequiredAttribute('w:val', ST_VerticalAlignRun);
}


module.exports = {CT_Color, CT_Fonts, CT_Highlight, CT_HpsMeasure, CT_RPr,
    CT_Underline,CT_VerticalAlignRun}
