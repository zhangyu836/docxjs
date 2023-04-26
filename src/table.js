
/*
The |Table| object and related proxy classes.
*/
let {BlockItemContainer} = require('./blkcntnr');
let {WD_STYLE_TYPE} = require('./enum/style');
let {ST_Merge} = require('./oxml/simpletypes');
let {Inches, Parented, getIndexedAccess} = require('./shared');
let {IndexError} = require('./exceptions')

class Table extends Parented {
    /*
    Proxy class for a WordprocessingML ``<w:tbl>`` element.
    */
    constructor(tbl, parent) {
        super(parent);
        this._element = this._tbl = tbl;
    }
    add_column(width) {
        /*
        Return a |_Column| object of *width*, newly added rightmost to the
        table.
        */
        let  gridCol, tblGrid, tc;
        tblGrid = this._tbl.tblGrid;
        gridCol = tblGrid.add_gridCol();
        gridCol.w = width;
        for (let  tr of this._tbl.tr_lst) {
            tc = tr.add_tc();
            tc.width = width;
        }
        return new _Column(gridCol, this);
    }
    add_row() {
        /*
        Return a |_Row| instance, newly added bottom-most to the table.
        */
        let  tbl, tc, tr;
        tbl = this._tbl;
        tr = tbl.add_tr();
        for (let  gridCol of tbl.tblGrid.gridCol_lst) {
            tc = tr.add_tc();
            tc.width = gridCol.w;
        }
        return new _Row(tr, this);
    }
    get alignment() {
        /*
        Read/write. A member of :ref:`WdRowAlignment` or None, specifying the
        positioning of this table between the page margins. |None| if no
        setting is specified, causing the effective value to be inherited
        from the style hierarchy.
        */
        return this._tblPr.alignment;
    }
    set alignment(value) {
        this._tblPr.alignment = value;
    }
    get autofit() {
        /*
        |True| if column widths can be automatically adjusted to improve the
        fit of cell contents. |False| if table layout is fixed. Column widths
        are adjusted in either case if total column width exceeds page width.
        Read/write boolean.
        */
        return this._tblPr.autofit;
    }
    set autofit(value) {
        this._tblPr.autofit = value;
    }
    cell(row_idx, col_idx) {
        /*
        Return |_Cell| instance correponding to table cell at *row_idx*,
        *col_idx* intersection, where (0, 0) is the top, left-most cell.
        */
        let  cell_idx;
        cell_idx = col_idx + (row_idx * this._column_count);
        return this._cells[cell_idx];
    }
    column_cells(column_idx) {
        /*
        Sequence of cells in the column at *column_idx* in this table.
        */
        let  cells;
        cells = this._cells;
        let  a = [];
        for (let idx = column_idx; idx < cells.length; idx += this._column_count) {
            a.push(cells[idx]);
        }
        return a;
    }
    get columns() {
        /*
        |_Columns| instance representing the sequence of columns in this
        table.
        */
        if(!this._columns)
            this._columns = new _Columns(this._tbl, this);
        return this._columns;
    }
    row_cells(row_idx) {
        /*
        Sequence of cells in the row at *row_idx* in this table.
        */
        let  column_count, end, start;
        column_count = this._column_count;
        start = row_idx * column_count;
        end = start + column_count;
        return this._cells.slice(start, end);
    }
    get rows() {
        /*
        |_Rows| instance containing the sequence of rows in this table.
        */
        if(!this._rows)
            this._rows = new _Rows(this._tbl, this);
        return this._rows;
    }
    get style() {
        /*
        Read/write. A |_TableStyle| object representing the style applied to
        this table. The default table style for the document (often `Normal
        Table`) is returned if the table has no directly-applied style.
        Assigning |None| to this property removes any directly-applied table
        style causing it to inherit the default table style of the document.
        Note that the style name of a table style differs slightly from that
        displayed in the user interface; a hyphen, if it appears, must be
        removed. For example, `Light Shading - Accent 1` becomes `Light
        Shading Accent 1`.
        */
        let  style_id;
        style_id = this._tbl.tblStyle_val;
        return this.part.get_style(style_id, WD_STYLE_TYPE.TABLE);
    }
    set style(style_or_name) {
        let  style_id;
        style_id = this.part.get_style_id(style_or_name, WD_STYLE_TYPE.TABLE);
        this._tbl.tblStyle_val = style_id;
    }
    get table() {
        /*
        Provide child objects with reference to the |Table| object they
        belong to, without them having to know their direct parent is
        a |Table| object. This is the terminus of a series of `parent._table`
        calls from an arbitrary child through its ancestors.
        */
        return this;
    }
    get table_direction() {
        /*
        A member of :ref:`WdTableDirection` indicating the direction in which
        the table cells are ordered, e.g. `WD_TABLE_DIRECTION.LTR`. |None|
        indicates the value is inherited from the style hierarchy.
        */
        return this._element.bidiVisual_val;
    }
    set table_direction(value) {
        this._element.bidiVisual_val = value;
    }
    get text() {
        let a = [];
        for(let cell of this._cells) {
            if(cell.merged) continue;
            a.push(cell.text);
        }
        return a.join('\n');
    }
    get _cells() {
        /*
        A sequence of |_Cell| objects, one for each cell of the layout grid.
        If the table contains a span, one or more |_Cell| object references
        are repeated.
        */
        let cells, col_count;
        col_count = this._column_count;
        cells = [];
        for (let  tc of this._tbl.iter_tcs()) {
            for (let grid_span_idx = 0; grid_span_idx < tc.grid_span; grid_span_idx += 1) {
                if (tc.vMerge === ST_Merge.CONTINUE) {
                    let master = cells.slice(-col_count)[0];
                    if(master.merged) {
                        master = master.master;
                    }
                    let merged = new MergedCell(master, 'v');
                    cells.push(merged);
                } else {
                    if (grid_span_idx > 0) {
                        let master = cells.slice(-1)[0];
                        if(master.merged) {
                            master = master.master;
                        }
                        let merged = new MergedCell(master, 'h');
                        cells.push(merged);
                    } else {
                        let master = new _Cell(tc, this);
                        cells.push(master);
                    }
                }
            }
        }
        return cells;
    }
    get _column_count() {
        /*
        The number of grid columns in this table.
        */
        let col_count;
        try {
            col_count = this._tbl.col_count;
        } catch (e) {
            col_count = 0;
            let tr = this._tbl.tr_lst[0];
            for (let tc of tr.tc_lst) {
                col_count += tc.grid_span;
            }
        }
        return col_count;
    }
    get _tblPr() {
        return this._tbl.tblPr;
    }
}
class MergedCell{
    constructor(master, merged) {
        this.master = master;
        this.merged = merged;
    }
}

class _Cell extends BlockItemContainer {
    /* Table cell */
    constructor(tc, parent) {
        super(tc, parent);
        this._tc = this._element = tc;
    }
    add_table(rows, cols) {
        /*
        Return a table newly added to this cell after any existing cell
        content, having *rows* rows and *cols* columns. An empty paragraph is
        added after the table because Word requires a paragraph element as
        the last element in every cell.
        */
        let  table, width;
        width = this.width !== null ? this.width : new Inches(1);
        table = super.add_table(rows, cols, width);
        this.add_paragraph();
        return table;
    }
    get col_span() {
        return this._tc.grid_span
    }
    merge(other_cell) {
        /*
        Return a merged cell created by spanning the rectangular region
        having this cell and *other_cell* as diagonal corners. Raises
        |InvalidSpanError| if the cells do not define a rectangular region.
        */
        let  merged_tc, tc, tc_2;
        [tc, tc_2] = [this._tc, other_cell._tc];
        merged_tc = tc.merge(tc_2);
        return new _Cell(merged_tc, this._parent);
    }
    get row_span() {
        return this._tc.bottom - this._tc._tr_idx;
    }
    get vertical_alignment() {
        /*Member of :ref:`WdCellVerticalAlignment` or None.

        A value of |None| indicates vertical alignment for this cell is
        inherited. Assigning |None| causes any explicitly defined vertical
        alignment to be removed, restoring inheritance.
        */
        let  tcPr;
        tcPr = this._element.tcPr;
        if (tcPr === null) {
            return null;
        }
        return tcPr.vAlign_val;
    }
    set vertical_alignment(value) {
        let  tcPr;
        tcPr = this._element.get_or_add_tcPr();
        tcPr.vAlign_val = value;
    }
    get width() {
        /*
        The width of this cell in EMU, or |None| if no explicit width is set.
        */
        return this._tc.width;
    }
    set width(value) {
        this._tc.width = value;
    }
}
class _Column extends Parented {
    /*
    Table column
    */
    constructor(gridCol, parent) {
        super(parent);
        this._gridCol = gridCol;
    }
    get cells() {
        /*
        Sequence of |_Cell| instances corresponding to cells in this column.
        */
        return this.table.column_cells(this._index);
    }
    get table() {
        /*
        Reference to the |Table| object this column belongs to.
        */
        return this._parent.table;
    }
    get width() {
        /*
        The width of this column in EMU, or |None| if no explicit width is
        set.
        */
        return this._gridCol.w;
    }
    set width(value) {
        this._gridCol.w = value;
    }
    get _index() {
        /*
        Index of this column in its table, starting from zero.
        */
        return this._gridCol.gridCol_idx;
    }
}
class _Columns extends Parented {
    /*
    Sequence of |_Column| instances corresponding to the columns in a table.
    Supports ``len()``, iteration and indexed access.
    */
    constructor(tbl, parent) {
        super(parent);
        this._tbl = tbl;
        this[Symbol.iterator] = this.iter;
        return getIndexedAccess(this);
    }
    getitem(idx) {
        /*
        Provide indexed access, e.g. 'columns[0]'
        */
        let  gridCol, msg;
        gridCol = this._gridCol_lst[idx];
        if(!gridCol) {
            msg = `column index [${idx}] is out of range`;
            throw new IndexError(msg);
        }
        return new _Column(gridCol, this);
    }
    column(idx) {
        return this.getitem(idx);
    }
    *iter() {
        for (let  gridCol of this._gridCol_lst) {
            yield new _Column(gridCol, this);
        }
    }
    get length() {
        return this._gridCol_lst.length;
    }
    get table() {
        /*
        Reference to the |Table| object this column collection belongs to.
        */
        return this._parent.table;
    }
    get _gridCol_lst() {
        /*
        Sequence containing ``<w:gridCol>`` elements for this table, each
        representing a table column.
        */
        let  tblGrid;
        tblGrid = this._tbl.tblGrid;
        return tblGrid.gridCol_lst;
    }
}
class _Row extends Parented {
    /*
    Table row
    */
    constructor(tr, parent) {
        super(parent);
        this._tr = this._element = tr;
    }
    get cells() {
        /*
        Sequence of |_Cell| instances corresponding to cells in this row.
        */
        return this.table.row_cells(this._index);
    }
    get height() {
        /*
        Return a |Length| object representing the height of this cell, or
        |None| if no explicit height is set.
        */
        return this._tr.trHeight_val;
    }
    set height(value) {
        this._tr.trHeight_val = value;
    }
    get height_rule() {
        /*
        Return the height rule of this cell as a member of the
        :ref:`WdRowHeightRule` enumeration, or |None| if no explicit
        height_rule is set.
        */
        return this._tr.trHeight_hRule;
    }
    set height_rule(value) {
        this._tr.trHeight_hRule = value;
    }
    get table() {
        /*
        Reference to the |Table| object this row belongs to.
        */
        return this._parent.table;
    }
    get _index() {
        /*
        Index of this row in its table, starting from zero.
        */
        return this._tr.tr_idx;
    }
}
class _Rows extends Parented {
    /*
    Sequence of |_Row| objects corresponding to the rows in a table.
    Supports ``len()``, iteration, indexed access, and slicing.
    */
    constructor(tbl, parent) {
        super(parent);
        this._tbl = tbl;
        this[Symbol.iterator] = this.iter;
        return getIndexedAccess(this);
    }
    getitem(idx) {
        /*
        Provide indexed access, (e.g. 'rows[0]')
        */
        return new _Row(this._tbl.tr_lst[idx], this);
    }
    row(idx) {
        return this.getitem(idx);
    }
    *iter() {
        for(let  tr of this._tbl.tr_lst) {
            yield new _Row(tr, this)
        }
    }
    slice(start, end) {
        return [...this].slice(start, end);
    }
    get length() {
        return this._tbl.tr_lst.length;
    }
    get table() {
        /*
        Reference to the |Table| object this row collection belongs to.
        */
        return this._parent.table;
    }
}

module.exports = {Table, _Cell, _Column, _Columns, _Row, _Rows};
