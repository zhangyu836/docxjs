
/* |Document| and closely related objects */
let {BlockItemContainer} = require('./blkcntnr');
let {WD_SECTION} = require('./enum/section');
let {WD_BREAK} = require('./enum/text');
let {Section, Sections} = require('./section');
let {ElementProxy, Emu} = require('./shared');
let {ValueError} = require('./exceptions')

class Document extends ElementProxy {
    /*WordprocessingML (WML) document.

    Not intended to be constructed directly. Use :func:`docx.Document` to open or create
    a document.
    */
    constructor(element, part) {
        super(element);
        this._part = part;
        this.__body = null;
    }
    add_heading(text = "", level = 1) {
        /*Return a heading paragraph newly added to the end of the document.

        The heading paragraph will contain *text* and have its paragraph style
        determined by *level*. If *level* is 0, the style is set to `Title`. If *level*
        is 1 (or omitted), `Heading 1` is used. Otherwise the style is set to `Heading
        {level}`. Raises |ValueError| if *level* is outside the range 0-9.
        */
        let style;
        if (! ((0 <= level) && (level <= 9))) {
            throw new ValueError(`level must be in range 0-9, got ${level}`);
        }
        style = level === 0 ? "Title" : `Heading ${level}`;
        return this.add_paragraph(text, style);
    }
    add_page_break() {
        /* Return newly |Paragraph| object containing only a page break. */
        let paragraph;
        paragraph = this.add_paragraph();
        paragraph.add_run().add_break(WD_BREAK.PAGE);
        return paragraph;
    }
    add_paragraph(text = "", style = null) {
        /*
        Return a paragraph newly added to the end of the document, populated
        with *text* and having paragraph style *style*. *text* can contain
        tab (``\\t``) characters, which are converted to the appropriate XML
        form for a tab. *text* can also include newline (``\\n``) or carriage
        return (``\\r``) characters, each of which is converted to a line
        break.
        */
        return this._body.add_paragraph(text, style);
    }
    add_picture(image_path_or_stream, width = null, height = null) {
        /*
        Return a new picture shape added in its own paragraph at the end of
        the document. The picture contains the image at
        *image_path_or_stream*, scaled based on *width* and *height*. If
        neither width nor height is specified, the picture appears at its
        native size. If only one is specified, it is used to compute
        a scaling factor that is then applied to the unspecified dimension,
        preserving the aspect ratio of the image. The native size of the
        picture is calculated using the dots-per-inch (dpi) value specified
        in the image file, defaulting to 72 dpi if no value is specified, as
        is often the case.
        */
        let run;
        run = this.add_paragraph().add_run();
        return run.add_picture(image_path_or_stream, width, height);
    }
    add_section(start_type = WD_SECTION.NEW_PAGE) {
        /*
        Return a |Section| object representing a new section added at the end
        of the document. The optional *start_type* argument must be a member
        of the :ref:`WdSectionStart` enumeration, and defaults to
        ``WD_SECTION.NEW_PAGE`` if not provided.
        */
        let new_sectPr;
        new_sectPr = this._element.body.add_section_break();
        new_sectPr.start_type = start_type;
        return new Section(new_sectPr, this._part);
    }
    add_table(rows, cols, style = null) {
        /*
        Add a table having row and column counts of *rows* and *cols*
        respectively and table style of *style*. *style* may be a paragraph
        style object or a paragraph style name. If *style* is |None|, the
        table inherits the default table style of the document.
        */
        let table;
        table = this._body.add_table(rows, cols, this._block_width);
        table.style = style;
        return table;
    }
    get core_properties() {
        /*
        A |CoreProperties| object providing read/write access to the core
        properties of this document.
        */
        return this._part.core_properties;
    }
    get inline_shapes() {
        /*
        An |InlineShapes| object providing access to the inline shapes in
        this document. An inline shape is a graphical object, such as
        a picture, contained in a run of text and behaving like a character
        glyph, being flowed like other text in a paragraph.
        */
        return this._part.inline_shapes;
    }
    get paragraphs() {
        /*
        A list of |Paragraph| instances corresponding to the paragraphs in
        the document, in document order. Note that paragraphs within revision
        marks such as ``<w:ins>`` or ``<w:del>`` do not appear in this list.
        */
        return this._body.paragraphs;
    }
    get part() {
        /*
        The |DocumentPart| object of this document.
        */
        return this._part;
    }
    save(path_or_stream) {
        /*
        Save this document to *path_or_stream*, which can be either a path to
        a filesystem location (a string) or a file-like object.
        */
        return this._part.save(path_or_stream);
    }
    get section() {
        if(this._body.sectPr){
            return new Section(this._body.sectPr, this._part);
        }
        return null;
    }
    get sections() {
        /* |Sections| object providing access to each section in this document. */
        return new Sections(this._element, this._part);
    }
    get settings() {
        /*
        A |Settings| object providing access to the document-level settings
        for this document.
        */
        return this._part.settings;
    }
    get styles() {
        /*
        A |Styles| object providing access to the styles in this document.
        */
        return this._part.styles;
    }
    get theme() {
        /*
        A |Theme| object providing access to the theme in this document.
        */
        return this._part.theme;
    }
    get tables() {
        /*
        A list of |Table| instances corresponding to the tables in the
        document, in document order. Note that only tables appearing at the
        top level of the document appear in this list; a table nested inside
        a table cell does not appear. A table within revision marks such as
        ``<w:ins>`` or ``<w:del>`` will also not appear in the list.
        */
        return this._body.tables;
    }
    get text() {
        return this._body.text;
    }
    get _block_width() {
        /*
        Return a |Length| object specifying the width of available "writing"
        space between the margins of the last section of this document.
        */
        let section;
        section = this.sections.slice(-1)[0];
        return new Emu(section.page_width - section.left_margin - section.right_margin);
    }
    get content(){
        return this._body.content;
    }
    get _body() {
        /*
        The |_Body| instance containing the content for this document.
        */
        if (this.__body === null) {
            this.__body = new _Body(this._element.body, this);
        }
        return this.__body;
    }
}

class _Body extends BlockItemContainer {
    /*
    Proxy for ``<w:body>`` element in this document, having primarily a
    container role.
    */
    constructor(body_elm, parent) {
        super(body_elm, parent);
        this._body = body_elm;
    }
    /*clear_content() {

        Return this |_Body| instance after clearing it of all content.
        Section properties for the main document story, if present, are
        preserved.

        this._body.clear_content();
        return this;
    }*/
    get sectPr() {
        return this._body.sectPr;
    }
}

module.exports = {Document, _Body}
