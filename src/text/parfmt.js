
/*
Paragraph-related proxy types.
*/
let {WD_LINE_SPACING} = require('../enum/text');
let {ElementProxy, Emu, Length, Pt, Twips} = require('../shared');
let {TabStops} = require('./tabstops');
let {Font} = require('./font');


class ParagraphFormat extends ElementProxy {
    /*
    Provides access to paragraph formatting such as justification,
    indentation, line spacing, space before and after, and widow/orphan
    control.
    */
    get alignment() {
        /*
        A member of the :ref:`WdParagraphAlignment` enumeration specifying
        the justification setting for this paragraph. A value of |None|
        indicates paragraph alignment is inherited from the style hierarchy.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.jc_val;
    }
    set alignment(value) {
        let pPr;
        pPr = this._element.get_or_add_pPr();
        pPr.jc_val = value;
    }
    get first_line_indent() {
        /*
        |Length| value specifying the relative difference in indentation for
        the first line of the paragraph. A positive value causes the first
        line to be indented. A negative value produces a hanging indent.
        |None| indicates first line indentation is inherited from the style
        hierarchy.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.first_line_indent;
    }
    set first_line_indent(value) {
        let pPr;
        pPr = this._element.get_or_add_pPr();
        pPr.first_line_indent = value;
    }
    get keep_together() {
        /*
        |True| if the paragraph should be kept "in one piece" and not broken
        across a page boundary when the document is rendered. |None|
        indicates its effective value is inherited from the style hierarchy.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.keepLines_val;
    }
    set keep_together(value) {
        this._element.get_or_add_pPr().keepLines_val = value;
    }
    get keep_with_next() {
        /*
        |True| if the paragraph should be kept on the same page as the
        subsequent paragraph when the document is rendered. For example, this
        property could be used to keep a section heading on the same page as
        its first paragraph. |None| indicates its effective value is
        inherited from the style hierarchy.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.keepNext_val;
    }
    set keep_with_next(value) {
        this._element.get_or_add_pPr().keepNext_val = value;
    }
    get left_indent() {
        /*
        |Length| value specifying the space between the left margin and the
        left side of the paragraph. |None| indicates the left indent value is
        inherited from the style hierarchy. Use an |Inches| value object as
        a convenient way to apply indentation in units of inches.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.ind_left;
    }
    set left_indent(value) {
        let pPr;
        pPr = this._element.get_or_add_pPr();
        pPr.ind_left = value;
    }
    get line_spacing() {
        /*
        |float| or |Length| value specifying the space between baselines in
        successive lines of the paragraph. A value of |None| indicates line
        spacing is inherited from the style hierarchy. A float value, e.g.
        ``2.0`` or ``1.75``, indicates spacing is applied in multiples of
        line heights. A |Length| value such as ``Pt(12)`` indicates spacing
        is a fixed height. The |Pt| value class is a convenient way to apply
        line spacing in units of points. Assigning |None| resets line spacing
        to inherit from the style hierarchy.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return this._line_spacing(pPr.spacing_line, pPr.spacing_lineRule);
    }
    set line_spacing(value) {
        let pPr;
        pPr = this._element.get_or_add_pPr();
        if (value === null) {
            pPr.spacing_line = null;
            pPr.spacing_lineRule = null;
        } else {
            if ((value instanceof Length)) {
                pPr.spacing_line = value;
                if ((pPr.spacing_lineRule !== WD_LINE_SPACING.AT_LEAST)) {
                    pPr.spacing_lineRule = WD_LINE_SPACING.EXACTLY;
                }
            } else {
                pPr.spacing_line = new Emu(value * new Twips(240));
                pPr.spacing_lineRule = WD_LINE_SPACING.MULTIPLE;
            }
        }
    }
    get line_spacing_rule() {
        /*
        A member of the :ref:`WdLineSpacing` enumeration indicating how the
        value of :attr:`line_spacing` should be interpreted. Assigning any of
        the :ref:`WdLineSpacing` members :attr:`SINGLE`, :attr:`DOUBLE`, or
        :attr:`ONE_POINT_FIVE` will cause the value of :attr:`line_spacing`
        to be updated to produce the corresponding line spacing.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return this._line_spacing_rule(pPr.spacing_line, pPr.spacing_lineRule);
    }
    set line_spacing_rule(value) {
        let pPr;
        pPr = this._element.get_or_add_pPr();
        if (value === WD_LINE_SPACING.SINGLE) {
            pPr.spacing_line = new Twips(240);
            pPr.spacing_lineRule = WD_LINE_SPACING.MULTIPLE;
        } else {
            if (value === WD_LINE_SPACING.ONE_POINT_FIVE) {
                pPr.spacing_line = new Twips(360);
                pPr.spacing_lineRule = WD_LINE_SPACING.MULTIPLE;
            } else {
                if (value === WD_LINE_SPACING.DOUBLE) {
                    pPr.spacing_line = new Twips(480);
                    pPr.spacing_lineRule = WD_LINE_SPACING.MULTIPLE;
                } else {
                    pPr.spacing_lineRule = value;
                }
            }
        }
    }
    get page_break_before() {
        /*
        |True| if the paragraph should appear at the top of the page
        following the prior paragraph. |None| indicates its effective value
        is inherited from the style hierarchy.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.pageBreakBefore_val;
    }
    set page_break_before(value) {
        this._element.get_or_add_pPr().pageBreakBefore_val = value;
    }
    get right_indent() {
        /*
        |Length| value specifying the space between the right margin and the
        right side of the paragraph. |None| indicates the right indent value
        is inherited from the style hierarchy. Use a |Cm| value object as
        a convenient way to apply indentation in units of centimeters.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.ind_right;
    }
    set right_indent(value) {
        let pPr;
        pPr = this._element.get_or_add_pPr();
        pPr.ind_right = value;
    }
    get space_after() {
        /*
        |Length| value specifying the spacing to appear between this
        paragraph and the subsequent paragraph. |None| indicates this value
        is inherited from the style hierarchy. |Length| objects provide
        convenience properties, such as :attr:`~.Length.pt` and
        :attr:`~.Length.inches`, that allow easy conversion to various length
        units.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.spacing_after;
    }
    set space_after(value) {
        this._element.get_or_add_pPr().spacing_after = value;
    }
    get space_before() {
        /*
        |Length| value specifying the spacing to appear between this
        paragraph and the prior paragraph. |None| indicates this value is
        inherited from the style hierarchy. |Length| objects provide
        convenience properties, such as :attr:`~.Length.pt` and
        :attr:`~.Length.cm`, that allow easy conversion to various length
        units.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.spacing_before;
    }
    set space_before(value) {
        this._element.get_or_add_pPr().spacing_before = value;
    }
    get tab_stops() {
        /*
        |TabStops| object providing access to the tab stops defined for this
        paragraph format.
        */
        if(!this._tab_stops){
            let pPr;
            pPr = this._element.get_or_add_pPr();
            this._tab_stops = new TabStops(pPr);
        }
        return this._tab_stops;

    }
    get widow_control() {
        /*
        |True| if the first and last lines in the paragraph remain on the
        same page as the rest of the paragraph when Word repaginates the
        document. |None| indicates its effective value is inherited from the
        style hierarchy.
        */
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.widowControl_val;
    }
    set widow_control(value) {
        this._element.get_or_add_pPr().widowControl_val = value;
    }
    _line_spacing(spacing_line, spacing_lineRule) {
        /*
        Return the line spacing value calculated from the combination of
        *spacing_line* and *spacing_lineRule*. Returns a |float| number of
        lines when *spacing_lineRule* is ``WD_LINE_SPACING.MULTIPLE``,
        otherwise a |Length| object of absolute line height is returned.
        Returns |None| when *spacing_line* is |None|.
        */
        if (spacing_line === null) {
            return null;
        }
        if ((spacing_lineRule === WD_LINE_SPACING.MULTIPLE)) {
            return (spacing_line / new Pt(12));
        }
        return spacing_line;
    }
    _line_spacing_rule(line, lineRule) {
        /*
        Return the line spacing rule value calculated from the combination of
        *line* and *lineRule*. Returns special members of the
        :ref:`WdLineSpacing` enumeration when line spacing is single, double,
        or 1.5 lines.
        */
        if(!line || ! line.twips) return lineRule;
        if (lineRule === WD_LINE_SPACING.MULTIPLE) {
            if (line.twips === 240) {
                return WD_LINE_SPACING.SINGLE;
            }
            if (line.twips === 360) {
                return WD_LINE_SPACING.ONE_POINT_FIVE;
            }
            if (line.twips === 480) {
                return WD_LINE_SPACING.DOUBLE;
            }
        }
        return lineRule;
    }
    get font() {
        let pPr;
        pPr = this._element.pPr;
        if (pPr === null) {
            return null;
        }
        let rPr = pPr.rPr;
        if (rPr === null) {
            return null;
        }
        return new Font(pPr);
    }
}


module.exports = {ParagraphFormat}
