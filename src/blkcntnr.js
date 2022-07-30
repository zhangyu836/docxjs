/*Block item container, used by body, cell, header, etc.

Block level items are things like paragraph and table, although there are a few other
specialized ones like structured document tags.
*/

let {CT_Tbl} = require('./oxml/table');
let {Parented} = require('./shared');
let {Paragraph} = require('./text/paragraph');
class BlockItemContainer extends Parented {
    /*Base class for proxy objects that can contain block items.

    These containers include _Body, _Cell, header, footer, footnote, endnote, comment,
    and text box objects. Provides the shared functionality to add a block item like
    a paragraph or table.
    */
    constructor(element, parent) {
        super(parent);
        this._element = element;
    }
    add_paragraph(text = "", style = null) {
        /*
        Return a paragraph newly added to the end of the content in this
        container, having *text* in a single run if present, and having
        paragraph style *style*. If *style* is |None|, no paragraph style is
        applied, which has the same effect as applying the 'Normal' style.
        */
        let paragraph;
        paragraph = this._add_paragraph();
        if (text) {
            paragraph.add_run(text);
        }
        if (style !== null) {
            paragraph.style = style;
        }
        return paragraph;
    }
    add_table(rows, cols, width) {
        /*
        Return a table of *width* having *rows* rows and *cols* columns,
        newly appended to the content in this container. *width* is evenly
        distributed between the table columns.
        */
        let {Table} = require('./table');
        let tbl;
        tbl = CT_Tbl.new_tbl(rows, cols, width);
        this._element._insert_tbl(tbl);
        return new Table(tbl, this);
    }
    get paragraphs() {
        /*
        A list containing the paragraphs in this container, in document
        order. Read-only.
        */
        let a = [];
        for(let p of this._element.p_lst)
            a.push(new Paragraph(p, this));
        return a;
    }
    get tables() {
        /*
        A list containing the tables in this container, in document order.
        Read-only.
        */
        let {Table} = require('./table');
        let a = [];
        for(let tbl of this._element.tbl_lst)
            a.push(new Table(tbl, this));
        return a;
    }
    _add_paragraph() {
        /*
        Return a paragraph newly added to the end of the content in this
        container.
        */
        return new Paragraph(this._element.add_p(), this);
    }
}

module.exports = {BlockItemContainer};
