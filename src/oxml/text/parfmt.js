/*
Custom element classes related to paragraph properties (CT_PPr).
*/
let {WD_ALIGN_PARAGRAPH, WD_LINE_SPACING,
    WD_TAB_ALIGNMENT, WD_TAB_LEADER} = require('../../enum/text');
let {Length} = require('../../shared');
let {ST_SignedTwipsMeasure, ST_TwipsMeasure, ST_String,
    XsdInt, ST_HexColor} = require('../simpletypes');
let {BaseOxmlElement, OneOrMore, OptionalAttribute,
    RequiredAttribute, ZeroOrOne} = require('../xmlchemy');


class CT_Ind extends BaseOxmlElement {
    /*
    ``<w:ind>`` element, specifying paragraph indentation.
    */
    left = new OptionalAttribute('w:left', ST_SignedTwipsMeasure);
    right = new OptionalAttribute('w:right', ST_SignedTwipsMeasure);
    firstLine = new OptionalAttribute('w:firstLine', ST_TwipsMeasure);
    hanging = new OptionalAttribute('w:hanging', ST_TwipsMeasure);
}

class CT_Jc extends BaseOxmlElement {
    /*
    ``<w:jc>`` element, specifying paragraph justification.
    */
    val = new RequiredAttribute('w:val', WD_ALIGN_PARAGRAPH);
}
class CT_Borders extends BaseOxmlElement {
    top = new ZeroOrOne('w:top');
    bottom = new ZeroOrOne('w:bottom');
    left = new ZeroOrOne('w:left');
    right = new ZeroOrOne('w:right');
    insideH = new ZeroOrOne('w:insideH');
    insideV = new ZeroOrOne('w:insideV');
}
class CT_Border extends BaseOxmlElement {
    val = new OptionalAttribute('w:val', ST_String);
    //sz = new OptionalAttribute('w:sz', ST_HpsMeasure);
    //space = new OptionalAttribute("w:space", ST_String);
    sz = new OptionalAttribute('w:sz', XsdInt); // in 1/8 of a point
    space = new OptionalAttribute("w:space", XsdInt);
    color = new OptionalAttribute('w:color', ST_HexColor);
    //themeColor = new OptionalAttribute('w:themeColor', MSO_THEME_COLOR);
}
let _tag_seq = [
    'w:pStyle', 'w:keepNext', 'w:keepLines', 'w:pageBreakBefore',
        'w:framePr', 'w:widowControl', 'w:numPr', 'w:suppressLineNumbers',
        'w:pBdr', 'w:shd', 'w:tabs', 'w:suppressAutoHyphens', 'w:kinsoku',
        'w:wordWrap', 'w:overflowPunct', 'w:topLinePunct', 'w:autoSpaceDE',
        'w:autoSpaceDN', 'w:bidi', 'w:adjustRightInd', 'w:snapToGrid',
        'w:spacing', 'w:ind', 'w:contextualSpacing', 'w:mirrorIndents',
        'w:suppressOverlap', 'w:jc', 'w:textDirection', 'w:textAlignment',
        'w:textboxTightWrap', 'w:outlineLvl', 'w:divId', 'w:cnfStyle',
        'w:rPr', 'w:sectPr', 'w:pPrChange'
]
class CT_PPr extends BaseOxmlElement {
    /*
    ``<w:pPr>`` element, containing the properties for a paragraph.
    */

    pStyle = new ZeroOrOne('w:pStyle', _tag_seq.slice(1));
    keepNext = new ZeroOrOne('w:keepNext', _tag_seq.slice(2));
    keepLines = new ZeroOrOne('w:keepLines', _tag_seq.slice(3));
    pageBreakBefore = new ZeroOrOne('w:pageBreakBefore', _tag_seq.slice(4));
    widowControl = new ZeroOrOne('w:widowControl', _tag_seq.slice(6));
    numPr = new ZeroOrOne('w:numPr', _tag_seq.slice(7));
    pBdr = new ZeroOrOne('w:pBdr', _tag_seq.slice(9));
    shd = new ZeroOrOne('w:shd', _tag_seq.slice(10));
    tabs = new ZeroOrOne('w:tabs', _tag_seq.slice(11));
    spacing = new ZeroOrOne('w:spacing', _tag_seq.slice(22));
    ind = new ZeroOrOne('w:ind', _tag_seq.slice(23));
    jc = new ZeroOrOne('w:jc', _tag_seq.slice(27));
    textAlignment = new ZeroOrOne('w:textAlignment', _tag_seq.slice(29));
    rPr = new ZeroOrOne('w:rPr', _tag_seq.slice(34));
    sectPr = new ZeroOrOne('w:sectPr', _tag_seq.slice(35));
    //del _tag_seq
    get first_line_indent() {
        /*
        A |Length| value calculated from the values of `w:ind/@w:firstLine`
        and `w:ind/@w:hanging`. Returns |None| if the `w:ind` child is not
        present.
        */
        let firstLine, hanging, ind;
        ind = this.ind;
        if (ind === null) {
            return null;
        }
        hanging = ind.hanging;
        if ((hanging !== null)) {
            return new Length(- hanging);
        }
        firstLine = ind.firstLine;
        if (firstLine === null) {
            return null;
        }
        return firstLine;
    }
    set first_line_indent(value) {
        let ind;
        if ((this.ind === null) && (value === null)) {
            return;
        }
        ind = this.get_or_add_ind();
        ind.firstLine = ind.hanging = null;
        if (value === null) {

        } else {
            if ((value < 0)) {
                ind.hanging = (- value);
            } else {
                ind.firstLine = value;
            }
        }
    }
    get ind_left() {
        /*
        The value of `w:ind/@w:left` or |None| if not present.
        */
        let ind;
        ind = this.ind;
        if (ind === null) {
            return null;
        }
        return ind.left;
    }
    set ind_left(value) {
        let ind;
        if ((value === null) && (this.ind === null)) {
            return;
        }
        ind = this.get_or_add_ind();
        ind.left = value;
    }
    get ind_right() {
        /*
        The value of `w:ind/@w:right` or |None| if not present.
        */
        let ind;
        ind = this.ind;
        if (ind === null) {
            return null;
        }
        return ind.right;
    }
    set ind_right(value) {
        let ind;
        if ((value === null) && (this.ind === null)) {
            return;
        }
        ind = this.get_or_add_ind();
        ind.right = value;
    }
    get jc_val() {
        /*
        The value of the ``<w:jc>`` child element or |None| if not present.
        */
        let jc;
        jc = this.jc;
        if (jc === null) {
            return null;
        }
        return jc.val;
    }
    set jc_val(value) {
        if (value === null) {
            this._remove_jc();
            return;
        }
        this.get_or_add_jc().val = value;
    }
    get keepLines_val() {
        /*
        The value of `keepLines/@val` or |None| if not present.
        */
        let keepLines;
        keepLines = this.keepLines;
        if (keepLines === null) {
            return null;
        }
        return keepLines.val;
    }
    set keepLines_val(value) {
        if (value === null) {
            this._remove_keepLines();
        } else {
            this.get_or_add_keepLines().val = value;
        }
    }
    get keepNext_val() {
        /*
        The value of `keepNext/@val` or |None| if not present.
        */
        let keepNext;
        keepNext = this.keepNext;
        if (keepNext === null) {
            return null;
        }
        return keepNext.val;
    }
    set keepNext_val(value) {
        if (value === null) {
            this._remove_keepNext();
        } else {
            this.get_or_add_keepNext().val = value;
        }
    }
    get pageBreakBefore_val() {
        /*
        The value of `pageBreakBefore/@val` or |None| if not present.
        */
        let pageBreakBefore;
        pageBreakBefore = this.pageBreakBefore;
        if (pageBreakBefore === null) {
            return null;
        }
        return pageBreakBefore.val;
    }
    set pageBreakBefore_val(value) {
        if (value === null) {
            this._remove_pageBreakBefore();
        } else {
            this.get_or_add_pageBreakBefore().val = value;
        }
    }
    get spacing_after() {
        /*
        The value of `w:spacing/@w:after` or |None| if not present.
        */
        let spacing;
        spacing = this.spacing;
        if (spacing === null) {
            return null;
        }
        return spacing.after;
    }
    set spacing_after(value) {
        if ((value === null) && (this.spacing === null)) {
            return;
        }
        this.get_or_add_spacing().after = value;
    }
    get spacing_before() {
        /*
        The value of `w:spacing/@w:before` or |None| if not present.
        */
        let spacing;
        spacing = this.spacing;
        if (spacing === null) {
            return null;
        }
        return spacing.before;
    }
    set spacing_before(value) {
        if (((value === null) && (this.spacing === null))) {
            return;
        }
        this.get_or_add_spacing().before = value;
    }
    get spacing_line() {
        /*
        The value of `w:spacing/@w:line` or |None| if not present.
        */
        let spacing;
        spacing = this.spacing;
        if (spacing === null) {
            return null;
        }
        return spacing.line;
    }
    set spacing_line(value) {
        if ((value === null) && (this.spacing === null)) {
            return;
        }
        this.get_or_add_spacing().line = value;
    }
    get spacing_lineRule() {
        /*
        The value of `w:spacing/@w:lineRule` as a member of the
        :ref:`WdLineSpacing` enumeration. Only the `MULTIPLE`, `EXACTLY`, and
        `AT_LEAST` members are used. It is the responsibility of the client
        to calculate the use of `SINGLE`, `DOUBLE`, and `MULTIPLE` based on
        the value of `w:spacing/@w:line` if that behavior is desired.
        */
        let lineRule, spacing;
        spacing = this.spacing;
        if (spacing === null) {
            return null;
        }
        lineRule = spacing.lineRule;
        if ((lineRule === null) && (spacing.line !== null)) {
            return WD_LINE_SPACING.MULTIPLE;
        }
        return lineRule;
    }
    set spacing_lineRule(value) {
        if ((value === null) && (this.spacing === null)) {
            return;
        }
        this.get_or_add_spacing().lineRule = value;
    }
    get style() {
        /*
        String contained in <w:pStyle> child, or None if that element is not
        present.
        */
        let pStyle;
        pStyle = this.pStyle;
        if (pStyle === null) {
            return null;
        }
        return pStyle.val;
    }
    set style(style) {
        /*
        Set val attribute of <w:pStyle> child element to *style*, adding a
        new element if necessary. If *style* is |None|, remove the <w:pStyle>
        element if present.
        */
        let pStyle;
        if (style === null) {
            this._remove_pStyle();
            return;
        }
        pStyle = this.get_or_add_pStyle();
        pStyle.val = style;
    }
    get widowControl_val() {
        /*
        The value of `widowControl/@val` or |None| if not present.
        */
        let widowControl;
        widowControl = this.widowControl;
        if (widowControl === null) {
            return null;
        }
        return widowControl.val;
    }
    set widowControl_val(value) {
        if (value === null) {
            this._remove_widowControl();
        } else {
            this.get_or_add_widowControl().val = value;
        }
    }
}
class CT_Spacing extends BaseOxmlElement {
    /*
    ``<w:spacing>`` element, specifying paragraph spacing attributes such as
    space before and line spacing.
    */
    after = new OptionalAttribute('w:after', ST_TwipsMeasure);
    before = new OptionalAttribute('w:before', ST_TwipsMeasure);
    line = new OptionalAttribute('w:line', ST_SignedTwipsMeasure);
    lineRule = new OptionalAttribute('w:lineRule', WD_LINE_SPACING);
}

class CT_TabStop extends BaseOxmlElement {
    /*
    ``<w:tab>`` element, representing an individual tab stop.
    */
    val = new RequiredAttribute('w:val', WD_TAB_ALIGNMENT);
    leader = new OptionalAttribute('w:leader', WD_TAB_LEADER, WD_TAB_LEADER.SPACES);
    pos = new RequiredAttribute('w:pos', ST_SignedTwipsMeasure);
}

class CT_TabStops extends BaseOxmlElement {
    /*
    ``<w:tabs>`` element, container for a sorted sequence of tab stops.
    */
    tab = new OneOrMore('w:tab');

    insert_tab_in_order(pos, align, leader) {
        /*
        Insert a newly created `w:tab` child element in *pos* order.
        */
        let new_tab;
        new_tab = this._new_tab();
        [new_tab.pos, new_tab.val, new_tab.leader] = [pos, align, leader];
        let tab_lst = this.tab_lst;
        for (let tab, index = 0; index < tab_lst.length; index += 1) {
            tab = tab_lst[index];
            if (new_tab.pos < tab.pos) {
                tab.addprevious(new_tab);
                return new_tab;
            }
        }
        this.append(new_tab);
        return new_tab;
    }
}

module.exports = {CT_Ind, CT_Jc, CT_PPr, CT_Spacing, CT_TabStop, CT_TabStops,
    CT_Borders, CT_Border};
