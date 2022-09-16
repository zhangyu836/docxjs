/* Section-related custom element classes */
let {WD_HEADER_FOOTER, WD_ORIENTATION, WD_SECTION_START} = require('../enum/section');
let {ST_SignedTwipsMeasure, ST_TwipsMeasure, XsdString,
    ST_OnOff, ST_DecimalNumber} = require('./simpletypes');
let {BaseOxmlElement, OptionalAttribute, RequiredAttribute,
    ZeroOrMore, ZeroOrOne} = require('./xmlchemy');


class CT_HdrFtr extends BaseOxmlElement {
    /* `w:hdr` and `w:ftr`, the root element for header and footer part respectively */

    p = new ZeroOrMore('w:p');
    tbl = new ZeroOrMore('w:tbl');
}



class CT_HdrFtrRef extends BaseOxmlElement {
    /* `w:headerReference` and `w:footerReference` elements */

    type = new RequiredAttribute('w:type', WD_HEADER_FOOTER);
    rId = new RequiredAttribute('r:id', XsdString);
}


class CT_PageMar extends BaseOxmlElement {
    /*
    ``<w:pgMar>`` element, defining page margins.
    */
    top = new OptionalAttribute('w:top', ST_SignedTwipsMeasure);
    right = new OptionalAttribute('w:right', ST_TwipsMeasure);
    bottom = new OptionalAttribute('w:bottom', ST_SignedTwipsMeasure);
    left = new OptionalAttribute('w:left', ST_TwipsMeasure);
    header = new OptionalAttribute('w:header', ST_TwipsMeasure);
    footer = new OptionalAttribute('w:footer', ST_TwipsMeasure);
    gutter = new OptionalAttribute('w:gutter', ST_TwipsMeasure);
}

class CT_PageSz extends BaseOxmlElement {
    /*
    ``<w:pgSz>`` element, defining page dimensions and orientation.
    */
    w = new OptionalAttribute('w:w', ST_TwipsMeasure);
    h = new OptionalAttribute('w:h', ST_TwipsMeasure);
    orient = new OptionalAttribute('w:orient', WD_ORIENTATION, WD_ORIENTATION.PORTRAIT);
}

class CT_Column extends BaseOxmlElement {
    w = new OptionalAttribute('w:w', ST_TwipsMeasure);
    space = new OptionalAttribute('w:space', ST_TwipsMeasure);
}

class CT_Columns extends BaseOxmlElement {
    equalWidth = new OptionalAttribute('w:equalWidth', ST_OnOff, true);
    num = new OptionalAttribute('w:num', ST_DecimalNumber);
    space = new OptionalAttribute('w:space', ST_TwipsMeasure);
    col = new ZeroOrMore('w:col');
}
let _tag_seq = [
    'w:footnotePr', 'w:endnotePr', 'w:type', 'w:pgSz', 'w:pgMar', 'w:paperSrc',
        'w:pgBorders', 'w:lnNumType', 'w:pgNumType', 'w:cols', 'w:formProt', 'w:vAlign',
        'w:noEndnote', 'w:titlePg', 'w:textDirection', 'w:bidi', 'w:rtlGutter',
        'w:docGrid', 'w:printerSettings', 'w:sectPrChange']

class CT_SectPr extends BaseOxmlElement {
    /* `w:sectPr` element, the container element for section properties */

    headerReference = new ZeroOrMore("w:headerReference", _tag_seq);
    footerReference = new ZeroOrMore("w:footerReference", _tag_seq);
    type = new ZeroOrOne("w:type", _tag_seq.slice(3));
    pgSz = new ZeroOrOne("w:pgSz", _tag_seq.slice(4));
    pgMar = new ZeroOrOne("w:pgMar", _tag_seq.slice(5));
    cols = new ZeroOrOne("w:cols", _tag_seq.slice(10));
    titlePg = new ZeroOrOne("w:titlePg", _tag_seq.slice(14));
    //del _tag_seq
    add_footerReference(type_, rId) {
        /*Return newly added CT_HdrFtrRef element of *type_* with *rId*.

        The element tag is `w:footerReference`.
        */
        let footerReference;
        footerReference = this._add_footerReference();
        footerReference.type = type_;
        footerReference.rId = rId;
        return footerReference;
    }
    add_headerReference(type_, rId) {
        /*Return newly added CT_HdrFtrRef element of *type_* with *rId*.

        The element tag is `w:headerReference`.
        */
        let headerReference;
        headerReference = this._add_headerReference();
        headerReference.type = type_;
        headerReference.rId = rId;
        return headerReference;
    }
    get bottom_margin() {
        /*
        The value of the ``w:bottom`` attribute in the ``<w:pgMar>`` child
        element, as a |Length| object, or |None| if either the element or the
        attribute is not present.
        */
        let pgMar;
        pgMar = this.pgMar;
        if (pgMar === null) {
            return null;
        }
        return pgMar.bottom;
    }
    set bottom_margin(value) {
        let pgMar;
        pgMar = this.get_or_add_pgMar();
        pgMar.bottom = value;
    }
    clone() {
        /*
        Return an exact duplicate of this ``<w:sectPr>`` element tree
        suitable for use in adding a section break. All rsid* attributes are
        removed from the root ``<w:sectPr>`` element.
        */
        let clone_sectPr;
        clone_sectPr = super.clone();
        clone_sectPr.clear_attrs();
        return clone_sectPr;
    }
    get footer() {
        /*
        The value of the ``w:footer`` attribute in the ``<w:pgMar>`` child
        element, as a |Length| object, or |None| if either the element or the
        attribute is not present.
        */
        let pgMar;
        pgMar = this.pgMar;
        if (pgMar === null) {
            return null;
        }
        return pgMar.footer;
    }
    set footer(value) {
        let pgMar;
        pgMar = this.get_or_add_pgMar();
        pgMar.footer = value;
    }
    get_footerReference(type_) {
        /* Return footerReference element of *type_* or None if not present. */
        let footerReferences, path;
        path = `./w:footerReference[@w:type='${WD_HEADER_FOOTER.to_xml(type_)}']`
        footerReferences = this.xpath(path);
        if (footerReferences.length===0) {
            return null;
        }
        return footerReferences[0];
    }
    get_headerReference(type_) {
        /* Return headerReference element of *type_* or None if not present. */
        let matching_headerReferences, path;
        path = `./w:headerReference[@w:type='${WD_HEADER_FOOTER.to_xml(type_)}']`
        matching_headerReferences = this.xpath(path);
        if (matching_headerReferences.length === 0) {
            return null;
        }
        return matching_headerReferences[0];
    }
    get gutter() {
        /*
        The value of the ``w:gutter`` attribute in the ``<w:pgMar>`` child
        element, as a |Length| object, or |None| if either the element or the
        attribute is not present.
        */
        let pgMar;
        pgMar = this.pgMar;
        if (pgMar === null) {
            return null;
        }
        return pgMar.gutter;
    }
    set gutter(value) {
        let pgMar;
        pgMar = this.get_or_add_pgMar();
        pgMar.gutter = value;
    }
    get header() {
        /*
        The value of the ``w:header`` attribute in the ``<w:pgMar>`` child
        element, as a |Length| object, or |None| if either the element or the
        attribute is not present.
        */
        let pgMar;
        pgMar = this.pgMar;
        if (pgMar === null) {
            return null;
        }
        return pgMar.header;
    }
    set header(value) {
        let pgMar;
        pgMar = this.get_or_add_pgMar();
        pgMar.header = value;
    }
    get left_margin() {
        /*
        The value of the ``w:left`` attribute in the ``<w:pgMar>`` child
        element, as a |Length| object, or |None| if either the element or the
        attribute is not present.
        */
        let pgMar;
        pgMar = this.pgMar;
        if (pgMar === null) {
            return null;
        }
        return pgMar.left;
    }
    set left_margin(value) {
        let pgMar;
        pgMar = this.get_or_add_pgMar();
        pgMar.left = value;
    }
    get orientation() {
        /*
        The member of the ``WD_ORIENTATION`` enumeration corresponding to the
        value of the ``orient`` attribute of the ``<w:pgSz>`` child element,
        or ``WD_ORIENTATION.PORTRAIT`` if not present.
        */
        let pgSz;
        pgSz = this.pgSz;
        if (pgSz === null) {
            return WD_ORIENTATION.PORTRAIT;
        }
        return pgSz.orient;
    }
    set orientation(value) {
        let pgSz;
        pgSz = this.get_or_add_pgSz();
        pgSz.orient = value;
    }
    get page_height() {
        /*
        Value in EMU of the ``h`` attribute of the ``<w:pgSz>`` child
        element, or |None| if not present.
        */
        let pgSz;
        pgSz = this.pgSz;
        if (pgSz === null) {
            return null;
        }
        return pgSz.h;
    }
    set page_height(value) {
        let pgSz;
        pgSz = this.get_or_add_pgSz();
        pgSz.h = value;
    }
    get page_width() {
        /*
        Value in EMU of the ``w`` attribute of the ``<w:pgSz>`` child
        element, or |None| if not present.
        */
        let pgSz;
        pgSz = this.pgSz;
        if (pgSz === null) {
            return null;
        }
        return pgSz.w;
    }
    set page_width(value) {
        let pgSz;
        pgSz = this.get_or_add_pgSz();
        pgSz.w = value;
    }
    get preceding_sectPr() {
        /* sectPr immediately preceding this one or None if this is the first. */
        let preceding_sectPrs;
        preceding_sectPrs = this.xpath("./preceding::w:sectPr[1]");
        return (preceding_sectPrs.length > 0) ? preceding_sectPrs[0] : null;
    }
    remove_footerReference(type_) {
        /* Return rId of w:footerReference child of *type_* after removing it. */
        let footerReference, rId;
        footerReference = this.get_footerReference(type_);
        rId = footerReference.rId;
        this.remove(footerReference);
        return rId;
    }
    remove_headerReference(type_) {
        /* Return rId of w:headerReference child of *type_* after removing it. */
        let headerReference, rId;
        headerReference = this.get_headerReference(type_);
        rId = headerReference.rId;
        this.remove(headerReference);
        return rId;
    }
    get right_margin() {
        /*
        The value of the ``w:right`` attribute in the ``<w:pgMar>`` child
        element, as a |Length| object, or |None| if either the element or the
        attribute is not present.
        */
        let pgMar;
        pgMar = this.pgMar;
        if (pgMar === null) {
            return null;
        }
        return pgMar.right;
    }
    set right_margin(value) {
        let pgMar;
        pgMar = this.get_or_add_pgMar();
        pgMar.right = value;
    }
    get start_type() {
        /*
        The member of the ``WD_SECTION_START`` enumeration corresponding to
        the value of the ``val`` attribute of the ``<w:type>`` child element,
        or ``WD_SECTION_START.NEW_PAGE`` if not present.
        */
        let type;
        type = this.type;
        if ((type === null) || (type.val === null)) {
            return WD_SECTION_START.NEW_PAGE;
        }
        return type.val;
    }
    set start_type(value) {
        let type;
        if ((value === null) || (value === WD_SECTION_START.NEW_PAGE)) {
            this._remove_type();
            return;
        }
        type = this.get_or_add_type();
        type.val = value;
    }
    get titlePg_val() {
        /* Value of `w:titlePg/@val` or |None| if not present */
        let titlePg;
        titlePg = this.titlePg;
        if (titlePg === null) {
            return false;
        }
        return titlePg.val;
    }
    set titlePg_val(value) {
        if ([null, false].includes(value)) {
            this._remove_titlePg();
        } else {
            this.get_or_add_titlePg().val = value;
        }
    }
    get top_margin() {
        /*
        The value of the ``w:top`` attribute in the ``<w:pgMar>`` child
        element, as a |Length| object, or |None| if either the element or the
        attribute is not present.
        */
        let pgMar;
        pgMar = this.pgMar;
        if (pgMar === null) {
            return null;
        }
        return pgMar.top;
    }
    set top_margin(value) {
        let pgMar;
        pgMar = this.get_or_add_pgMar();
        pgMar.top = value;
    }
}

class CT_SectType extends BaseOxmlElement {
    /*
    ``<w:sectType>`` element, defining the section start type.
    */
    val = new OptionalAttribute('w:val', WD_SECTION_START);
}


module.exports = {CT_HdrFtr, CT_HdrFtrRef, CT_PageMar, CT_PageSz,
    CT_SectPr, CT_SectType, CT_Column, CT_Columns};
