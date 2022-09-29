/*
Run-related proxy objects for python-docx, Run in particular.
*/

let {WD_STYLE_TYPE} = require('../enum/style');
let {WD_BREAK} = require('../enum/text');
let {Font} = require('./font');
let {InlineShape} = require('../shape');
let {Parented} = require('../shared');
class Run extends Parented {
    /*
    Proxy object wrapping ``<w:r>`` element. Several of the properties on Run
    take a tri-state value, |True|, |False|, or |None|. |True| and |False|
    correspond to on and off respectively. |None| indicates the property is
    not specified directly on the run and its effective value is taken from
    the style hierarchy.
    */
    constructor(r, parent) {
        super(parent);
        this._r = this._element = this.element = r;
    }
    add_break(break_type = WD_BREAK.LINE) {
        /*
        Add a break element of *break_type* to this run. *break_type* can
        take the values `WD_BREAK.LINE`, `WD_BREAK.PAGE`, and
        `WD_BREAK.COLUMN` where `WD_BREAK` is imported from `docx.enum.text`.
        *break_type* defaults to `WD_BREAK.LINE`.
        */
        let br, clear, type_;
        [type_, clear] = {[WD_BREAK.LINE]: [null, null],
            [WD_BREAK.PAGE]: ["page", null],
            [WD_BREAK.COLUMN]: ["column", null],
            [WD_BREAK.LINE_CLEAR_LEFT]: ["textWrapping", "left"],
            [WD_BREAK.LINE_CLEAR_RIGHT]: ["textWrapping", "right"],
            [WD_BREAK.LINE_CLEAR_ALL]: ["textWrapping", "all"]}[break_type];
        br = this._r.add_br();
        if (type_ !== null) {
            br.type = type_;
        }
        if (clear !== null) {
            br.clear = clear;
        }
    }
    add_picture(image_path_or_stream, width = null, height = null) {
        /*
        Return an |InlineShape| instance containing the image identified by
        *image_path_or_stream*, added to the end of this run.
        *image_path_or_stream* can be a path (a string) or a file-like object
        containing a binary image. If neither width nor height is specified,
        the picture appears at its native size. If only one is specified, it
        is used to compute a scaling factor that is then applied to the
        unspecified dimension, preserving the aspect ratio of the image. The
        native size of the picture is calculated using the dots-per-inch
        (dpi) value specified in the image file, defaulting to 72 dpi if no
        value is specified, as is often the case.
        */
        let inline;
        inline = this.part.new_pic_inline(image_path_or_stream, width, height);
        this._r.add_drawing(inline);
        return new InlineShape(inline, this);
    }
    add_tab() {
        /*
        Add a ``<w:tab/>`` element at the end of the run, which Word
        interprets as a tab character.
        */
        this._r._add_tab();
    }
    add_text(text) {
        /*
        Returns a newly appended |_Text| object (corresponding to a new
        ``<w:t>`` child element) to the run, containing *text*. Compare with
        the possibly more friendly approach of assigning text to the
        :attr:`Run.text` property.
        */
        let t;
        t = this._r.add_t(text);
        return new _Text(t);
    }
    get bold() {
        /*
        Read/write. Causes the text of the run to appear in bold.
        */
        return this.font.bold;
    }
    set bold(value) {
        this.font.bold = value;
    }
    clear() {
        /*
        Return reference to this run after removing all its content. All run
        formatting is preserved.
        */
        this._r.clear_content();
        return this;
    }
    get font() {
        /*
        The |Font| object providing access to the character formatting
        properties for this run, such as font name and size.
        */
        return new Font(this._element);
    }
    get italic() {
        /*
        Read/write tri-state value. When |True|, causes the text of the run
        to appear in italics.
        */
        return this.font.italic;
    }
    set italic(value) {
        this.font.italic = value;
    }
    get style() {
        /*
        Read/write. A |_CharacterStyle| object representing the character
        style applied to this run. The default character style for the
        document (often `Default Character Font`) is returned if the run has
        no directly-applied character style. Setting this property to |None|
        removes any directly-applied character style.
        */
        let style_id;
        style_id = this._r.style;
        return this.part.get_style(style_id, WD_STYLE_TYPE.CHARACTER);
    }
    set style(style_or_name) {
        let style_id;
        style_id = this.part.get_style_id(style_or_name, WD_STYLE_TYPE.CHARACTER);
        this._r.style = style_id;
    }
    get text() {
        /*
        String formed by concatenating the text equivalent of each run
        content child element into a Python string. Each ``<w:t>`` element
        adds the text characters it contains. A ``<w:tab/>`` element adds
        a ``\\t`` character. A ``<w:cr/>`` or ``<w:br>`` element each add
        a ``\\n`` character. Note that a ``<w:br>`` element can indicate
        a page break or column break as well as a line break. All ``<w:br>``
        elements translate to a single ``\\n`` character regardless of their
        type. All other content child elements, such as ``<w:drawing>``, are
        ignored.

        Assigning text to this property has the reverse effect, translating
        each ``\\t`` character to a ``<w:tab/>`` element and each ``\\n`` or
        ``\\r`` character to a ``<w:cr/>`` element. Any existing run content
        is replaced. Run formatting is preserved.
        */
        return this._r.text;
    }
    set text(text) {
        this._r.text = text;
    }
    get underline() {
        /*
        The underline style for this |Run|, one of |None|, |True|, |False|,
        or a value from :ref:`WdUnderline`. A value of |None| indicates the
        run has no directly-applied underline value and so will inherit the
        underline value of its containing paragraph. Assigning |None| to this
        property removes any directly-applied underline value. A value of
        |False| indicates a directly-applied setting of no underline,
        overriding any inherited value. A value of |True| indicates single
        underline. The values from :ref:`WdUnderline` are used to specify
        other outline styles such as double, wavy, and dotted.
        */
        return this.font.underline;
    }
    set underline(value) {
        this.font.underline = value;
    }
}
class _Text  {
    /*
    Proxy object wrapping ``<w:t>`` element.
    */
    constructor(t_elm) {
        this._t = t_elm;
    }
}

module.exports = {Run};
