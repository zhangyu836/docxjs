/* Custom element classes for tables */

let {parse_xml} = require('./xmlhandler');
let {WD_CELL_VERTICAL_ALIGNMENT, WD_ROW_HEIGHT_RULE,
    WD_TABLE_DIRECTION} = require('../enum/table');
let {nsdecls} = require('./ns');
let {Emu, Twips} = require('../shared');
let {ST_OnOff, ST_Merge, ST_TblLayoutType, ST_TblWidth,
    ST_TwipsMeasure, XsdInt, ST_String} = require('./simpletypes');
let {BaseOxmlElement, OneAndOnlyOne, OneOrMore, OptionalAttribute,
    RequiredAttribute, ZeroOrMore, ZeroOrOne} = require('./xmlchemy');
let {InvalidSpanError, ValueError} = require('../exceptions');

class CT_Height extends BaseOxmlElement {
    /*
    Used for ``<w:trHeight>`` to specify a row height and row height rule.
    */
    val = new OptionalAttribute('w:val', ST_TwipsMeasure);
    hRule = new OptionalAttribute('w:hRule', WD_ROW_HEIGHT_RULE);
}

class CT_Row extends BaseOxmlElement {
    /*
    ``<w:tr>`` element
    */
    tblPrEx = new ZeroOrOne('w:tblPrEx');  // custom inserter below
    trPr = new ZeroOrOne('w:trPr');        // custom inserter below
    tc = new ZeroOrMore('w:tc');

    tc_at_grid_col(idx) {
        /*
        The ``<w:tc>`` element appearing at grid column *idx*. Raises
        |ValueError| if no ``w:tc`` element begins at that grid column.
        */
        let grid_col = 0;
        for( let tc of this.tc_lst){
            if( grid_col === idx){
                return tc;
            }
            grid_col += tc.grid_span;
            if (grid_col > idx) {
                throw new ValueError(`no cell on grid column ${idx}`);
            }
        }
        throw new ValueError("index out of bounds");
    }
    get tr_idx() {
        /*
        The index of this ``<w:tr>`` element within its parent ``<w:tbl>``
        element.
        */
        return this.getparent().tr_lst_index(this);
    }
    get trHeight_hRule() {
        /*
        Return the value of `w:trPr/w:trHeight@w:hRule`, or |None| if not
        present.
        */
        let trPr;
        trPr = this.trPr;
        if (trPr === null) {
            return null;
        }
        return trPr.trHeight_hRule;
    }
    set trHeight_hRule(value) {
        let trPr;
        trPr = this.get_or_add_trPr();
        trPr.trHeight_hRule = value;
    }
    get trHeight_val() {
        /*
        Return the value of `w:trPr/w:trHeight@w:val`, or |None| if not
        present.
        */
        let trPr;
        trPr = this.trPr;
        if (trPr === null) {
            return null;
        }
        return trPr.trHeight_val;
    }
    set trHeight_val(value) {
        let trPr;
        trPr = this.get_or_add_trPr();
        trPr.trHeight_val = value;
    }
    _insert_tblPrEx(tblPrEx) {
        this.insert(0, tblPrEx);
    }
    _insert_trPr(trPr) {
        let tblPrEx;
        tblPrEx = this.tblPrEx;
        if (tblPrEx !== null) {
            tblPrEx.addnext(trPr);
        } else {
            this.insert(0, trPr);
        }
    }
    _new_tc() {
        return CT_Tc._new();
    }
}

class CT_Bidi extends BaseOxmlElement {
    /*
    */
    //val = new OptionalAttribute('w:val', WD_TABLE_DIRECTION, WD_TABLE_DIRECTION.RTL);
    val = new OptionalAttribute('w:val', ST_OnOff, WD_TABLE_DIRECTION.RTL);//
}

class CT_Tbl extends BaseOxmlElement {
    /*
    ``<w:tbl>`` element
    */
    tblPr = new OneAndOnlyOne('w:tblPr');
    tblGrid = new OneAndOnlyOne('w:tblGrid');
    tr = new ZeroOrMore('w:tr');
    get bidiVisual_val() {
        /*
        Value of `w:tblPr/w:bidiVisual/@w:val` or |None| if not present.
        Controls whether table cells are displayed right-to-left or
        left-to-right.
        */
        let bidiVisual;
        bidiVisual = this.tblPr.bidiVisual;
        if (bidiVisual === null) {
            return null;
        }
        return bidiVisual.val;
    }
    set bidiVisual_val(value) {
        let tblPr;
        tblPr = this.tblPr;
        if (value === null) {
            tblPr._remove_bidiVisual();
        } else {
            tblPr.get_or_add_bidiVisual().val = value;
        }
    }
    get col_count() {
        /*
        The number of grid columns in this table.
        */
        return this.tblGrid.gridCol_lst.length;
    }
    iter_tcs() {
        /*
        Generate each of the `w:tc` elements in this table, left to right and
        top to bottom. Each cell in the first row is generated, followed by
        each cell in the second row, etc.
        */
        let _this = this;
        return {
            [Symbol.iterator]: function* iter() {
                for (let tr of _this.tr_lst) {
                    for (let tc of tr.tc_lst) {
                        yield tc
                    }
                }
            }
        }
    }
    static new_tbl(rows, cols, width) {
        /*
        Return a new `w:tbl` element having *rows* rows and *cols* columns
        with *width* distributed evenly between the columns.
        */
        return parse_xml(this._tbl_xml(rows, cols, width));
    }
    get tblStyle_val() {
        /*
        Value of `w:tblPr/w:tblStyle/@w:val` (a table style id) or |None| if
        not present.
        */
        let tblStyle;
        tblStyle = this.tblPr.tblStyle;
        if (tblStyle === null) {
            return null;
        }
        return tblStyle.val;
    }
    set tblStyle_val(styleId) {
        /*
        Set the value of `w:tblPr/w:tblStyle/@w:val` (a table style id) to
        *styleId*. If *styleId* is None, remove the `w:tblStyle` element.
        */
        let tblPr;
        tblPr = this.tblPr;
        tblPr._remove_tblStyle();
        if (styleId === null) {
            return;
        }
        tblPr._add_tblStyle().val = styleId;
    }
    static _tbl_xml(rows, cols, width) {
        let col_width;
        col_width = cols > 0 ? new Emu(width / cols) : new Emu(0);
        return `<w:tbl ${nsdecls('w')}>\n` +
            '  <w:tblPr>\n' +
            '    <w:tblW w:type="auto" w:w="0"/>\n' +
            '    <w:tblLook w:firstColumn="1" w:firstRow="1"\n' +
            '               w:lastColumn="0" w:lastRow="0" w:noHBand="0"\n' +
            '               w:noVBand="1" w:val="04A0"/>\n' +
            '  </w:tblPr>\n' +
            CT_Tbl._tblGrid_xml(cols, col_width) + // tblGrid
            CT_Tbl._trs_xml(rows, cols, col_width) + // trs
            '</w:tbl>\n'
	}
    static _tblGrid_xml(col_count, col_width) {
        let xml;
        xml = "  <w:tblGrid>\n";
        for (let i = 0; i < col_count; i += 1) {
            xml += `    <w:gridCol w:w="${col_width.twips}"/>\n`;
        }
        xml += "  </w:tblGrid>\n";
        return xml;
    }
    static _trs_xml(row_count, col_count, col_width) {
        let xml;
        xml = "";
        for (let i = 0; (i < row_count); i += 1) {
            xml += `  <w:tr>\n${this._tcs_xml(col_count, col_width)}  </w:tr>\n`;
        }
        return xml;
    }
    static _tcs_xml(col_count, col_width) {
        let xml;
        xml = "";
        for (let i = 0; (i < col_count); i += 1) {
            xml += '    <w:tc>\n' +
                '      <w:tcPr>\n' +
                `        <w:tcW w:type="dxa" w:w="${col_width.twips}"/>\n` +
                '      </w:tcPr>\n' +
                '      <w:p/>\n' +
                '    </w:tc>\n'
        }
        return xml;
    }
}
class CT_TblGrid extends BaseOxmlElement {
    /*
    ``<w:tblGrid>`` element, child of ``<w:tbl>``, holds ``<w:gridCol>``
    elements that define column count, width, etc.
    */
    gridCol = new ZeroOrMore('w:gridCol', ['w:tblGridChange']);
}

class CT_TblGridCol extends BaseOxmlElement {
    /*
    ``<w:gridCol>`` element, child of ``<w:tblGrid>``, defines a table
    column.
    */
    w = new OptionalAttribute('w:w', ST_TwipsMeasure);
    get gridCol_idx() {
        /*
        The index of this ``<w:gridCol>`` element within its parent
        ``<w:tblGrid>`` element.
        */
        return this.getparent().gridCol_lst_index(this);
    }
}
class CT_TblLayoutType extends BaseOxmlElement {
    /*
    ``<w:tblLayout>`` element, specifying whether column widths are fixed or
    can be automatically adjusted based on content.
    */
    type = new OptionalAttribute('w:type', ST_TblLayoutType);
}
let _tag_seq = [
    'w:tblStyle', 'w:tblpPr', 'w:tblOverlap', 'w:bidiVisual',
        'w:tblStyleRowBandSize', 'w:tblStyleColBandSize', 'w:tblW', 'w:jc',
        'w:tblCellSpacing', 'w:tblInd', 'w:tblBorders', 'w:shd',
        'w:tblLayout', 'w:tblCellMar', 'w:tblLook', 'w:tblCaption',
        'w:tblDescription', 'w:tblPrChange'
]
class CT_TblPr extends BaseOxmlElement {
    /*
    ``<w:tblPr>`` element, child of ``<w:tbl>``, holds child elements that
    define table properties such as style and borders.
    */
    tblStyle = new ZeroOrOne('w:tblStyle', _tag_seq.slice(1));
    bidiVisual = new ZeroOrOne('w:bidiVisual', _tag_seq.slice(4));
    tblStyleRowBandSize = new ZeroOrOne('w:tblStyleRowBandSize', _tag_seq.slice(5));
    tblStyleColBandSize = new ZeroOrOne('w:tblStyleColBandSize', _tag_seq.slice(6));
    tblW = new ZeroOrOne('w:tblW', _tag_seq.slice(7));
    jc = new ZeroOrOne('w:jc', _tag_seq.slice(8));
    tblCellSpacing = new ZeroOrOne('w:tblCellSpacing', _tag_seq.slice(9));
    tblInd = new ZeroOrOne('w:tblInd', _tag_seq.slice(10));
    tblBorders = new ZeroOrOne('w:tblBorders', _tag_seq.slice(11));
    shd = new ZeroOrOne('w:shd', _tag_seq.slice(12));
    tblLayout = new ZeroOrOne('w:tblLayout', _tag_seq.slice(13));
    tblCellMar = new ZeroOrOne('w:tblCellMar', _tag_seq.slice(14));
    get alignment() {
        /*
        Member of :ref:`WdRowAlignment` enumeration or |None|, based on the
        contents of the `w:val` attribute of `./w:jc`. |None| if no `w:jc`
        element is present.
        */
        let jc;
        jc = this.jc;
        if (jc === null) {
            return null;
        }
        return jc.val;
    }
    set alignment(value) {
        let jc;
        this._remove_jc();
        if (value === null) {
            return;
        }
        jc = this.get_or_add_jc();
        jc.val = value;
    }
    get autofit() {
        /*
        Return |False| if there is a ``<w:tblLayout>`` child with ``w:type``
        attribute set to ``'fixed'``. Otherwise return |True|.
        */
        let tblLayout;
        tblLayout = this.tblLayout;
        if (tblLayout === null) {
            return true;
        }
        return tblLayout.type !== "fixed";
    }
    set autofit(value) {
        let tblLayout;
        tblLayout = this.get_or_add_tblLayout();
        tblLayout.type = value ? "autofit" : "fixed";
    }
    get style() {
        /*
        Return the value of the ``val`` attribute of the ``<w:tblStyle>``
        child or |None| if not present.
        */
        let tblStyle;
        tblStyle = this.tblStyle;
        if (tblStyle === null) {
            return null;
        }
        return tblStyle.val;
    }
    set style(value) {
        this._remove_tblStyle();
        if (value === null) {
            return;
        }
        this._add_tblStyle({"val": value});
    }
}
class CT_TblWidth extends BaseOxmlElement {
    /*
    Used for ``<w:tblW>`` and ``<w:tcW>`` elements and many others, to
    specify a table-related width.
    # the type for `w` attr is actually ST_MeasurementOrPercent, but using
    # XsdInt for now because only dxa (twips) values are being used. It's not
    # entirely clear what the semantics are for other values like -01.4mm
    */
    w = new RequiredAttribute('w:w', XsdInt);
    type = new RequiredAttribute('w:type', ST_TblWidth);
    get width() {
        /*
        Return the EMU length value represented by the combined ``w:w`` and
        ``w:type`` attributes.
        */
        if (this.type !== "dxa") {
            return null;
        }
        return new Twips(this.w);
    }
    set width(value) {
        this.type = "dxa";
        this.w = new Emu(value).twips;
    }
}

class CT_Tc extends BaseOxmlElement {
    /* `w:tc` table cell element */
    tcPr = new ZeroOrOne('w:tcPr');  // bunches of successors, overriding insert
    p = new OneOrMore('w:p');
    tbl = new OneOrMore('w:tbl');

    get bottom() {
        /*
        The row index that marks the bottom extent of the vertical span of
        this cell. This is one greater than the index of the bottom-most row
        of the span, similar to how a slice of the cell's rows would be
        specified.
        */
        let tc_below;
        if (this.vMerge !== null) {
            tc_below = this._tc_below;
            if ((tc_below !== null) && (tc_below.vMerge === ST_Merge.CONTINUE)) {
                return tc_below.bottom;
            }
        }
        return this._tr_idx + 1;
    }
    clear_content() {
        /*
        Remove all content child elements, preserving the ``<w:tcPr>``
        element if present. Note that this leaves the ``<w:tc>`` element in
        an invalid state because it doesn't contain at least one block-level
        element. It's up to the caller to add a ``<w:p>``child element as the
        last content element.
        */
        //let new_children, tcPr;
        //new_children = [];
        //tcPr = this.tcPr;
        //if (tcPr !== null) {
        //    new_children.push(tcPr);
        //}
        //this.slice(0) = new_children;
        let tagNames = ["w:p", "w:tbl", "w:sdt"];
        this.remove_all(tagNames);
    }
    get grid_span() {
        /*
        The integer number of columns this cell spans. Determined by
        ./w:tcPr/w:gridSpan/@val, it defaults to 1.
        */
        let tcPr;
        tcPr = this.tcPr;
        if (tcPr === null) {
            return 1;
        }
        return tcPr.grid_span;
    }
    set grid_span(value) {
        let tcPr;
        tcPr = this.get_or_add_tcPr();
        tcPr.grid_span = value;
    }
    iter_block_items() {
        /*
        Generate a reference to each of the block-level content elements in
        this cell, in the order they appear.
        */
        let block_item_tags;
        block_item_tags = ["w:p", "w:tbl", "w:sdt"];
        let _this = this;
        return {
            [Symbol.iterator]: function* iter() {
                for (let child of _this.slice(0)){
                    if (block_item_tags.includes(child.tagName)){
                        yield child
                    }
                }
            }
        }
    }
    get left() {
        /*
        The grid column index at which this ``<w:tc>`` element appears.
        */
        return this._grid_col;
    }
    merge(other_tc) {
        /*
        Return the top-left ``<w:tc>`` element of a new span formed by
        merging the rectangular region defined by using this tc element and
        *other_tc* as diagonal corners.
        */
        let height, left, top, top_tc, width;
        [top, left, height, width] = this._span_dimensions(other_tc);
        top_tc = this._tbl.tr_lst[top].tc_at_grid_col(left);
        top_tc._grow_to(width, height);
        return top_tc;
    }
    static _new() {
        /*
        Return a new ``<w:tc>`` element, containing an empty paragraph as the
        required EG_BlockLevelElt.
        */
        return parse_xml(
            `<w:tc ${nsdecls("w")}>\n` +
            '  <w:p/>\n' +
            '</w:tc>')
    }
    get right() {
        /*
        The grid column index that marks the right-side extent of the
        horizontal span of this cell. This is one greater than the index of
        the right-most column of the span, similar to how a slice of the
        cell's columns would be specified.
        */
        return this._grid_col + this.grid_span;
    }
    get top() {
        /*
        The top-most row index in the vertical span of this cell.
        */
        if ((this.vMerge === null) || (this.vMerge === ST_Merge.RESTART)) {
            return this._tr_idx;
        }
        return this._tc_above.top;
    }
    get vMerge() {
        /*
        The value of the ./w:tcPr/w:vMerge/@val attribute, or |None| if the
        w:vMerge element is not present.
        */
        let tcPr;
        tcPr = this.tcPr;
        if (tcPr === null) {
            return null;
        }
        return tcPr.vMerge_val;
    }
    set vMerge(value) {
        let tcPr;
        tcPr = this.get_or_add_tcPr();
        tcPr.vMerge_val = value;
    }
    get width() {
        /*
        Return the EMU length value represented in the ``./w:tcPr/w:tcW``
        child element or |None| if not present.
        */
        let tcPr;
        tcPr = this.tcPr;
        if (tcPr === null) {
            return null;
        }
        return tcPr.width;
    }
    set width(value) {
        let tcPr;
        tcPr = this.get_or_add_tcPr();
        tcPr.width = value;
    }
    _add_width_of(other_tc) {
        /*
        Add the width of *other_tc* to this cell. Does nothing if either this
        tc or *other_tc* does not have a specified width.
        */
        if (this.width && other_tc.width) {
            this.width += other_tc.width;
        }
    }
    get _grid_col() {
        /*
        The grid column at which this cell begins.
        */
        let idx, preceding_tcs, tr;
        tr = this._tr;
        idx = tr.tc_lst_index(this);
        preceding_tcs = tr.tc_lst.slice(0, idx);
        let sum = 0;
        for(let tc of preceding_tcs){
            sum += tc.grid_span;
        }
        return sum;
    }
    _grow_to(width, height, top_tc = null) {
        /*
        Grow this cell to *width* grid columns and *height* rows by expanding
        horizontal spans and creating continuation cells to form vertical
        spans.
        */
        function vMerge_val (top_tc) {
            if (top_tc !== this) {
                return ST_Merge.CONTINUE;
            }
            if (height === 1) {
                return null;
            }
            return ST_Merge.RESTART;
        };
        top_tc = top_tc === null ? this : top_tc;
        this._span_to_width(width, top_tc, vMerge_val.call(this, top_tc));
        if (height > 1) {
            this._tc_below._grow_to(width, (height - 1), top_tc);
        }
    }
    _insert_tcPr(tcPr) {
        /*
        ``tcPr`` has a bunch of successors, but it comes first if it appears,
        so just overriding and using insert(0, ...) rather than spelling out
        successors.
        */
        this.insert(0, tcPr);
        return tcPr;
    }
    get _is_empty() {
        /*
        True if this cell contains only a single empty ``<w:p>`` element.
        */
        let block_items, p;
        block_items = [...this.iter_block_items()];
        if (block_items.length > 1) {
            return false;
        }
        if (block_items.length === 0) return true;
        p = block_items[0];
        return p.r_lst.length === 0;

    }
    _move_content_to(other_tc) {
        /*
        Append the content of this cell to *other_tc*, leaving this cell with
        a single empty ``<w:p>`` element.
        */
        if (other_tc === this) {
            return;
        }
        if (this._is_empty) {
            return;
        }
        other_tc._remove_trailing_empty_p();
        //# appending moves each element from self to other_tc
        for(let block_element of this.iter_block_items()) {
            other_tc.append(block_element)
        }
        // add back the required minimum single empty <w:p> element
        this.append(this._new_p());
    }
    _new_tbl() {
        return CT_Tbl._new();
    }
    get _next_tc() {
        /*
        The `w:tc` element immediately following this one in this row, or
        |None| if this is the last `w:tc` element in the row.
        */
        let following_tcs;
        //following_tcs = this.xpath("./following-sibling::w:tc");// not work
        let tr = this._tr;
        let idx = tr.tc_lst_index(this);
        following_tcs = tr.tc_lst.slice(idx+1);
        return following_tcs.length>0 ? following_tcs[0] : null;
    }
    _remove() {
        /*
        Remove this `w:tc` element = require( the XML tree.
        */
        this.getparent().remove(this);
    }
    _remove_trailing_empty_p() {
        /*
        Remove the last content element = require( this cell if it is an empty
        ``<w:p>`` element.
        */
        let block_items, last_content_elm, p;
        block_items = [...this.iter_block_items()];
        last_content_elm = block_items.slice(-1)[0];
        if (last_content_elm.tagName !== "w:p") {
            return;
        }
        p = last_content_elm;
        if (p.r_lst.length > 0) {
            return;
        }
        this.remove(p);
    }
    _span_dimensions(other_tc) {
        /*
        Return a (top, left, height, width) 4-tuple specifying the extents of
        the merged cell formed by using this tc and *other_tc* as opposite
        corner extents.
        */
        let bottom, left, right, top;
        function raise_on_inverted_L (a, b) {
            if ((a.top === b.top) && (a.bottom !== b.bottom)) {
                throw new InvalidSpanError("requested span not rectangular");
            }
            if ((a.left === b.left) && (a.right !== b.right)) {
                throw new InvalidSpanError("requested span not rectangular");
            }
        };
        function raise_on_tee_shaped (a, b) {
            let left_most, other, top_most;
            [top_most, other] = a.top < b.top ? [a, b] : [b, a];
            if ((top_most.top < other.top) && (top_most.bottom > other.bottom)) {
                throw new InvalidSpanError("requested span not rectangular");
            }
            [left_most, other] = a.left < b.left ? [a, b] : [b, a];
            if ((left_most.left < other.left) && (left_most.right > other.right)) {
                throw new InvalidSpanError("requested span not rectangular");
            }
        };
        raise_on_inverted_L(this, other_tc);
        raise_on_tee_shaped(this, other_tc);
        top = Math.min(this.top, other_tc.top);
        left = Math.min(this.left, other_tc.left);
        bottom = Math.max(this.bottom, other_tc.bottom);
        right = Math.max(this.right, other_tc.right);
        return [top, left, bottom - top, right - left];
    }
    _span_to_width(grid_width, top_tc, vMerge) {
        /*
        Incorporate and then remove `w:tc` elements to the right of this one
        until this cell spans *grid_width*. Raises |ValueError| if
        *grid_width* cannot be exactly achieved, such as when a merged cell
        would drive the span width greater than *grid_width* or if not enough
        grid columns are available to make this cell that wide. All content
        from incorporated cells is appended to *top_tc*. The val attribute of
        the vMerge element on the single remaining cell is set to *vMerge*.
        If *vMerge* is |None|, the vMerge element is removed if present.
        */
        this._move_content_to(top_tc);
        while (this.grid_span < grid_width) {
            this._swallow_next_tc(grid_width, top_tc);
        }
        this.vMerge = vMerge;
    }
    _swallow_next_tc(grid_width, top_tc) {
        /*
        Extend the horizontal span of this `w:tc` element to incorporate the
        following `w:tc` element in the row and then delete that following
        `w:tc` element. Any content in the following `w:tc` element is
        appended to the content of *top_tc*. The width of the following
        `w:tc` element is added to this one, if present. Raises
        |InvalidSpanError| if the width of the resulting cell is greater than
        *grid_width* or if there is no next `<w:tc>` element in the row.
        */
        let next_tc;
        function raise_on_invalid_swallow (next_tc)  {
            if (next_tc === null) {
                throw new InvalidSpanError("not enough grid columns");
            }
            if ((this.grid_span + next_tc.grid_span) > grid_width) {
                throw new InvalidSpanError("span is not rectangular");
            }
        };
        next_tc = this._next_tc;
        raise_on_invalid_swallow.call(this, next_tc);
        next_tc._move_content_to(top_tc);
        this._add_width_of(next_tc);
        this.grid_span += next_tc.grid_span;
        next_tc._remove();
    }
    get _tbl() {
        /*
        The tbl element this tc element appears in.
        */
        return this.getparent().getparent();
        //return this.xpath("./ancestor::w:tbl[position()=1]")[0]; //not work
    }
    get _tc_above() {
        /*
        The `w:tc` element immediately above this one in its grid column.
        */
        return this._tr_above.tc_at_grid_col(this._grid_col);
    }
    get _tc_below() {
        /*
        The tc element immediately below this one in its grid column.
        */
        let tr_below;
        tr_below = this._tr_below;
        if (tr_below === null) {
            return null;
        }
        return tr_below.tc_at_grid_col(this._grid_col);
    }
    get _tr() {
        /*
        The tr element this tc element appears in.
        */
        return this.getparent();
        //return this.xpath("./ancestor::w:tr[position()=1]")[0];// not work
    }
    get _tr_above() {
        /*
        The tr element prior in sequence to the tr this cell appears in.
        Raises |ValueError| if called on a cell in the top-most row.
        */
        let tr_idx, tr_lst;
        tr_idx = this._tbl.tr_lst_index(this._tr);
        if (tr_idx === 0) {
            throw new ValueError("no tr above topmost tr");
        }
        tr_lst = this._tbl.tr_lst;
        return tr_lst[tr_idx - 1];
    }
    get _tr_below() {
        /*
        The tr element next in sequence after the tr this cell appears in, or
        |None| if this cell appears in the last row.
        */
        let tr_idx, tr_lst;
        tr_lst = this._tbl.tr_lst;
        tr_idx = this._tbl.tr_lst_index(this._tr);
        let tc = tr_lst[tr_idx + 1];
        if (tc === undefined) return null;
        return tc;
    }
    get _tr_idx() {
        /*
        The row index of the tr element this tc element appears in.
        */
        return this._tbl.tr_lst_index(this._tr);
    }
}
let _tag_seq2 = [
    'w:cnfStyle', 'w:tcW', 'w:gridSpan', 'w:hMerge', 'w:vMerge',
        'w:tcBorders', 'w:shd', 'w:noWrap', 'w:tcMar', 'w:textDirection',
        'w:tcFitText', 'w:vAlign', 'w:hideMark', 'w:headers', 'w:cellIns',
        'w:cellDel', 'w:cellMerge', 'w:tcPrChange'
]
class CT_TcPr extends BaseOxmlElement {
    /*
    ``<w:tcPr>`` element, defining table cell properties
    */
    tcW = new ZeroOrOne('w:tcW', _tag_seq2.slice(2));
    gridSpan = new ZeroOrOne('w:gridSpan', _tag_seq2.slice(3));
    vMerge = new ZeroOrOne('w:vMerge', _tag_seq2.slice(5));
    tcBorders = new ZeroOrOne('w:tcBorders', _tag_seq2.slice(6));
    shd = new ZeroOrOne('w:shd', _tag_seq2.slice(7));
    tcMar = new ZeroOrOne('w:tcMar', _tag_seq2.slice(9));
    vAlign = new ZeroOrOne('w:vAlign', _tag_seq2.slice(12));
    get grid_span() {
        /*
        The integer number of columns this cell spans. Determined by
        ./w:gridSpan/@val, it defaults to 1.
        */
        let gridSpan;
        gridSpan = this.gridSpan;
        if (gridSpan === null) {
            return 1;
        }
        return gridSpan.val;
    }
    set grid_span(value) {
        this._remove_gridSpan();
        if (value > 1) {
            this.get_or_add_gridSpan().val = value;
        }
    }
    get vAlign_val() {
        /*Value of `w:val` attribute on  `w:vAlign` child.

        Value is |None| if `w:vAlign` child is not present. The `w:val`
        attribute on `w:vAlign` is required.
        */
        let vAlign;
        vAlign = this.vAlign;
        if (vAlign === null) {
            return null;
        }
        return vAlign.val;
    }
    set vAlign_val(value) {
        if (value === null) {
            this._remove_vAlign();
            return;
        }
        this.get_or_add_vAlign().val = value;
    }
    get vMerge_val() {
        /*
        The value of the ./w:vMerge/@val attribute, or |None| if the
        w:vMerge element is not present.
        */
        let vMerge;
        vMerge = this.vMerge;
        if (vMerge === null) {
            return null;
        }
        return vMerge.val;
    }
    set vMerge_val(value) {
        this._remove_vMerge();
        if (value !== null) {
            this._add_vMerge().val = value;
        }
    }
    get width() {
        /*
        Return the EMU length value represented in the ``<w:tcW>`` child
        element or |None| if not present or its type is not 'dxa'.
        */
        let tcW;
        tcW = this.tcW;
        if (tcW === null) {
            return null;
        }
        return tcW.width;
    }
    set width(value) {
        let tcW;
        tcW = this.get_or_add_tcW();
        tcW.width = value;
    }
}
let _tag_seq3 = [
        'w:cnfStyle', 'w:divId', 'w:gridBefore', 'w:gridAfter', 'w:wBefore',
        'w:wAfter', 'w:cantSplit', 'w:trHeight', 'w:tblHeader',
        'w:tblCellSpacing', 'w:jc', 'w:hidden', 'w:ins', 'w:del',
        'w:trPrChange'
]
class CT_TrPr extends BaseOxmlElement {
    /*
    ``<w:trPr>`` element, defining table row properties
    del _tag_seq
    */
    trHeight = new ZeroOrOne('w:trHeight', _tag_seq3.slice(8));
    get trHeight_hRule() {
        /*
        Return the value of `w:trHeight@w:hRule`, or |None| if not present.
        */
        let trHeight;
        trHeight = this.trHeight;
        if (trHeight === null) {
            return null;
        }
        return trHeight.hRule;
    }
    set trHeight_hRule(value) {
        let trHeight;
        if ((value === null) && (this.trHeight === null)) {
            return;
        }
        trHeight = this.get_or_add_trHeight();
        trHeight.hRule = value;
    }
    get trHeight_val() {
        /*
        Return the value of `w:trHeight@w:val`, or |None| if not present.
        */
        let trHeight;
        trHeight = this.trHeight;
        if (trHeight === null) {
            return null;
        }
        return trHeight.val;
    }
    set trHeight_val(value) {
        let trHeight;
        if ((value === null) && (this.trHeight === null)) {
            return;
        }
        trHeight = this.get_or_add_trHeight();
        trHeight.val = value;
    }
}
class CT_VerticalJc extends BaseOxmlElement {
    /* `w:vAlign` element, specifying vertical alignment of cell. */
    val = new RequiredAttribute('w:val', WD_CELL_VERTICAL_ALIGNMENT);
}

class CT_VMerge extends BaseOxmlElement {
    /*
    ``<w:vMerge>`` element, specifying vertical merging behavior of a cell.
    */
    val = new OptionalAttribute('w:val', ST_Merge, ST_Merge.CONTINUE);
}

class CT_TblStylePr extends BaseOxmlElement {
    pPr = new ZeroOrOne('w:pPr');
    rPr = new ZeroOrOne('w:rPr');
    tblPr = new ZeroOrOne('w:tblPr');
    trPr = new ZeroOrOne('w:trPr');
    tcPr = new ZeroOrOne('w:tcPr');
    type = new RequiredAttribute('w:type', ST_String);
}

module.exports = {CT_Height, CT_Row, CT_Tbl, CT_TblGrid, CT_TblGridCol, CT_TblLayoutType,
    CT_TblPr, CT_TblWidth, CT_Tc, CT_TcPr, CT_TrPr, CT_VMerge, CT_VerticalJc, CT_Bidi};
