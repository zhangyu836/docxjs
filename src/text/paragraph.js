/*
Paragraph-related proxy types.
*/

let {WD_STYLE_TYPE} = require('../enum/style');
let {RT} = require('../opc/constants');
let {ParagraphFormat} = require('./parfmt');
let {Run} = require('./run');
let {Hyperlink} = require('./hyperlink');
let {Parented} = require('../shared');

class Paragraph extends Parented {
    /*
    Proxy object wrapping ``<w:p>`` element.
    */
    constructor(p, parent) {
        super(parent);
        this._p = this._element = p;
    }
    add_hyperlink(target, text=null, style=null){
        let _hyperlink = this._p.add_hyperlink();
        _hyperlink.rId = this.part.relate_to(target, RT.HYPERLINK, true);
        let hyperlink = new Hyperlink(_hyperlink, this);
        if (text) {
            hyperlink.add_run(text, style);
        }
        return hyperlink;
    }
    add_run(text = null, style = null) {
        /*
        Append a run to this paragraph containing *text* and having character
        style identified by style ID *style*. *text* can contain tab
        (``\\t``) characters, which are converted to the appropriate XML form
        for a tab. *text* can also include newline (``\\n``) or carriage
        return (``\\r``) characters, each of which is converted to a line
        break.
        */
        let r, run;
        r = this._p.add_r();
        run = new Run(r, this);
        if (text) {
            run.text = text;
        }
        if (style) {
            run.style = style;
        }
        return run;
    }
    get alignment() {
        /*
        A member of the :ref:`WdParagraphAlignment` enumeration specifying
        the justification setting for this paragraph. A value of |None|
        indicates the paragraph has no directly-applied alignment value and
        will inherit its alignment value from its style hierarchy. Assigning
        |None| to this property removes any directly-applied alignment value.
        */
        return this._p.alignment;
    }
    set alignment(value) {
        this._p.alignment = value;
    }
    clear() {
        /*
        Return this same paragraph after removing all its content.
        Paragraph-level formatting, such as style, is preserved.
        */
        this._p.clear_content();
        return this;
    }
    get content() {
        /*
        Sequence of |Run| and |Hyperlink| instances.
        */
        let a = [];
        for(let c of this._p.slice(0)){
            if(c.tagName==="w:r")
                a.push(new Run(c, this));
            else if(c.tagName==="w:hyperlink"){
                a.push(new Hyperlink(c, this));
            }
        }
        return a;
    }
    contentIter() {
        let children = this._p.findallIter();
        let parent = this;
        function *iter () {
            for(let child of children) {
                if (child.tagName==="w:r") {
                    yield new Run(child, parent);
                } else if (child.tagName==="w:hyperlink") {
                    yield new Hyperlink(child, parent);
                }
            }
        }
        return iter();
    }
    insert_paragraph_before(text = null, style = null) {
        /*
        Return a newly created paragraph, inserted directly before this
        paragraph. If *text* is supplied, the new paragraph contains that
        text in a single run. If *style* is provided, that style is assigned
        to the new paragraph.
        */
        let paragraph;
        paragraph = this._insert_paragraph_before();
        if (text) {
            paragraph.add_run(text);
        }
        if (style !== null) {
            paragraph.style = style;
        }
        return paragraph;
    }
    get paragraph_format() {
        /*
        The |ParagraphFormat| object providing access to the formatting
        properties for this paragraph, such as line spacing and indentation.
        */
        return new ParagraphFormat(this._element);
    }
    get runs() {
        /*
        Sequence of |Run| instances corresponding to the <w:r> elements in
        this paragraph.
        */
        let a = [];
        for(let r of this._p.r_lst){
            a.push(new Run(r, this));
        }
        return a;
    }
    get section() {
        if(this._p.sectPr){
            let {Section} = require('../section');
            return new Section(this._p.sectPr, this._part);
        }
        return null;
    }
    get style() {
        /*
        Read/Write. |_ParagraphStyle| object representing the style assigned
        to this paragraph. If no explicit style is assigned to this
        paragraph, its value is the default paragraph style for the document.
        A paragraph style name can be assigned in lieu of a paragraph style
        object. Assigning |None| removes any applied style, making its
        effective value the default paragraph style for the document.
        */
        let style_id;
        style_id = this._p.style;
        return this.part.get_style(style_id, WD_STYLE_TYPE.PARAGRAPH);
    }
    set style(style_or_name) {
        let style_id;
        style_id = this.part.get_style_id(style_or_name, WD_STYLE_TYPE.PARAGRAPH);
        this._p.style = style_id;
    }
    get text() {
        /*
        String formed by concatenating the text of each run in the paragraph.
        Tabs and line breaks in the XML are mapped to ``\\t`` and ``\\n``
        characters respectively.

        Assigning text to this property causes all existing paragraph content
        to be replaced with a single run containing the assigned text.
        A ``\\t`` character in the text is mapped to a ``<w:tab/>`` element
        and each ``\\n`` or ``\\r`` character is mapped to a line break.
        Paragraph-level formatting, such as style, is preserved. All
        run-level formatting, such as bold or italic, is removed.
        */
        let text;
        text = "";
        for (let child of this.content) {
            text += child.text;
        }
        return text;
    }
    set text(text) {
        this.clear();
        this.add_run(text);
    }
    _insert_paragraph_before() {
        /*
        Return a newly created paragraph, inserted directly before this
        paragraph.
        */
        let p;
        p = this._p.add_p_before();
        return new Paragraph(p, this._parent);
    }
}

module.exports = {Paragraph};
