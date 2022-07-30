/*
Font-related proxy objects.
*/
let {ColorFormat} = require('../dml/color');
let {ElementProxy} = require('../shared');


class Font extends ElementProxy {
    /*
    Proxy object wrapping the parent of a ``<w:rPr>`` element and providing
    access to character properties such as font name, font size, bold, and
    subscript.
    */
    get all_caps() {
        /*
        Read/write. Causes text in this font to appear in capital letters.
        */
        return this._get_bool_prop("caps");
    }
    set all_caps(value) {
        this._set_bool_prop("caps", value);
    }
    get bold() {
        /*
        Read/write. Causes text in this font to appear in bold.
        */
        return this._get_bool_prop("b");
    }
    set bold(value) {
        this._set_bool_prop("b", value);
    }
    get color() {
        /*
        A |ColorFormat| object providing a way to get and set the text color
        for this font.
        */
        return new ColorFormat(this._element);
    }
    get complex_script() {
        /*
        Read/write tri-state value. When |True|, causes the characters in the
        run to be treated as complex script regardless of their Unicode
        values.
        */
        return this._get_bool_prop("cs");
    }
    set complex_script(value) {
        this._set_bool_prop("cs", value);
    }
    get cs_bold() {
        /*
        Read/write tri-state value. When |True|, causes the complex script
        characters in the run to be displayed in bold typeface.
        */
        return this._get_bool_prop("bCs");
    }
    set cs_bold(value) {
        this._set_bool_prop("bCs", value);
    }
    get cs_italic() {
        /*
        Read/write tri-state value. When |True|, causes the complex script
        characters in the run to be displayed in italic typeface.
        */
        return this._get_bool_prop("iCs");
    }
    set cs_italic(value) {
        this._set_bool_prop("iCs", value);
    }
    get double_strike() {
        /*
        Read/write tri-state value. When |True|, causes the text in the run
        to appear with double strikethrough.
        */
        return this._get_bool_prop("dstrike");
    }
    set double_strike(value) {
        this._set_bool_prop("dstrike", value);
    }
    get emboss() {
        /*
        Read/write tri-state value. When |True|, causes the text in the run
        to appear as if raised off the page in relief.
        */
        return this._get_bool_prop("emboss");
    }
    set emboss(value) {
        this._set_bool_prop("emboss", value);
    }
    get hidden() {
        /*
        Read/write tri-state value. When |True|, causes the text in the run
        to be hidden from display, unless applications settings force hidden
        text to be shown.
        */
        return this._get_bool_prop("vanish");
    }
    set hidden(value) {
        this._set_bool_prop("vanish", value);
    }
    get highlight_color() {
        /*
        A member of :ref:`WdColorIndex` indicating the color of highlighting
        applied, or `None` if no highlighting is applied.
        */
        let rPr;
        rPr = this._element.rPr;
        if (rPr === null) {
            return null;
        }
        return rPr.highlight_val;
    }
    set highlight_color(value) {
        let rPr;
        rPr = this._element.get_or_add_rPr();
        rPr.highlight_val = value;
    }
    get italic() {
        /*
        Read/write tri-state value. When |True|, causes the text of the run
        to appear in italics. |None| indicates the effective value is
        inherited from the style hierarchy.
        */
        return this._get_bool_prop("i");
    }
    set italic(value) {
        this._set_bool_prop("i", value);
    }
    get imprint() {
        /*
        Read/write tri-state value. When |True|, causes the text in the run
        to appear as if pressed into the page.
        */
        return this._get_bool_prop("imprint");
    }
    set imprint(value) {
        this._set_bool_prop("imprint", value);
    }
    get math() {
        /*
        Read/write tri-state value. When |True|, specifies this run contains
        WML that should be handled as though it was Office Open XML Math.
        */
        return this._get_bool_prop("oMath");
    }
    set math(value) {
        this._set_bool_prop("oMath", value);
    }
    get name() {
        /*
        Get or set the typeface name for this |Font| instance, causing the
        text it controls to appear in the named font, if a matching font is
        found. |None| indicates the typeface is inherited from the style
        hierarchy.
        */
        let rPr;
        rPr = this._element.rPr;
        if (rPr === null) {
            return null;
        }
        return rPr.rFonts_ascii;
    }
    set name(value) {
        let rPr;
        rPr = this._element.get_or_add_rPr();
        rPr.rFonts_ascii = value;
        rPr.rFonts_hAnsi = value;
    }
    get no_proof() {
        /*
        Read/write tri-state value. When |True|, specifies that the contents
        of this run should not report any errors when the document is scanned
        for spelling and grammar.
        */
        return this._get_bool_prop("noProof");
    }
    set no_proof(value) {
        this._set_bool_prop("noProof", value);
    }
    get outline() {
        /*
        Read/write tri-state value. When |True| causes the characters in the
        run to appear as if they have an outline, by drawing a one pixel wide
        border around the inside and outside borders of each character glyph.
        */
        return this._get_bool_prop("outline");
    }
    set outline(value) {
        this._set_bool_prop("outline", value);
    }
    get rtl() {
        /*
        Read/write tri-state value. When |True| causes the text in the run
        to have right-to-left characteristics.
        */
        return this._get_bool_prop("rtl");
    }
    set rtl(value) {
        this._set_bool_prop("rtl", value);
    }
    get shadow() {
        /*
        Read/write tri-state value. When |True| causes the text in the run
        to appear as if each character has a shadow.
        */
        return this._get_bool_prop("shadow");
    }
    set shadow(value) {
        this._set_bool_prop("shadow", value);
    }
    get size() {
        /*
        Read/write |Length| value or |None|, indicating the font height in
        English Metric Units (EMU). |None| indicates the font size should be
        inherited from the style hierarchy. |Length| is a subclass of |int|
        having properties for convenient conversion into points or other
        length units. The :class:`docx.shared.Pt` class allows convenient
        specification of point values::

        >> font.size = Pt(24)
        >> font.size
        304800
        >> font.size.pt
        24.0
        */
        let rPr;
        rPr = this._element.rPr;
        if (rPr === null) {
            return null;
        }
        return rPr.sz_val;
    }
    set size(emu) {
        let rPr;
        rPr = this._element.get_or_add_rPr();
        rPr.sz_val = emu;
    }
    get small_caps() {
        /*
        Read/write tri-state value. When |True| causes the lowercase
        characters in the run to appear as capital letters two points smaller
        than the font size specified for the run.
        */
        return this._get_bool_prop("smallCaps");
    }
    set small_caps(value) {
        this._set_bool_prop("smallCaps", value);
    }
    get snap_to_grid() {
        /*
        Read/write tri-state value. When |True| causes the run to use the
        document grid characters per line settings defined in the docGrid
        element when laying out the characters in this run.
        */
        return this._get_bool_prop("snapToGrid");
    }
    set snap_to_grid(value) {
        this._set_bool_prop("snapToGrid", value);
    }
    get spec_vanish() {
        /*
        Read/write tri-state value. When |True|, specifies that the given run
        shall always behave as if it is hidden, even when hidden text is
        being displayed in the current document. The property has a very
        narrow, specialized use related to the table of contents. Consult the
        spec (§17.3.2.36) for more details.
        */
        return this._get_bool_prop("specVanish");
    }
    set spec_vanish(value) {
        this._set_bool_prop("specVanish", value);
    }
    get strike() {
        /*
        Read/write tri-state value. When |True| causes the text in the run
        to appear with a single horizontal line through the center of the
        line.
        */
        return this._get_bool_prop("strike");
    }
    set strike(value) {
        this._set_bool_prop("strike", value);
    }
    get subscript() {
        /*
        Boolean indicating whether the characters in this |Font| appear as
        subscript. |None| indicates the subscript/subscript value is
        inherited from the style hierarchy.
        */
        let rPr;
        rPr = this._element.rPr;
        if (rPr === null) {
            return null;
        }
        return rPr.subscript;
    }
    set subscript(value) {
        let rPr;
        rPr = this._element.get_or_add_rPr();
        rPr.subscript = value;
    }
    get superscript() {
        /*
        Boolean indicating whether the characters in this |Font| appear as
        superscript. |None| indicates the subscript/superscript value is
        inherited from the style hierarchy.
        */
        let rPr;
        rPr = this._element.rPr;
        if (rPr === null) {
            return null;
        }
        return rPr.superscript;
    }
    set superscript(value) {
        let rPr;
        rPr = this._element.get_or_add_rPr();
        rPr.superscript = value;
    }
    get underline() {
        /*
        The underline style for this |Font|, one of |None|, |True|, |False|,
        or a value from :ref:`WdUnderline`. |None| indicates the font
        inherits its underline value from the style hierarchy. |False|
        indicates no underline. |True| indicates single underline. The values
        from :ref:`WdUnderline` are used to specify other outline styles such
        as double, wavy, and dotted.
        */
        let rPr;
        rPr = this._element.rPr;
        if (rPr === null) {
            return null;
        }
        return rPr.u_val;
    }
    set underline(value) {
        let rPr;
        rPr = this._element.get_or_add_rPr();
        rPr.u_val = value;
    }
    get web_hidden() {
        /*
        Read/write tri-state value. When |True|, specifies that the contents
        of this run shall be hidden when the document is displayed in web
        page view.
        */
        return this._get_bool_prop("webHidden");
    }
    set web_hidden(value) {
        this._set_bool_prop("webHidden", value);
    }
    _get_bool_prop(name) {
        /*
        Return the value of boolean child of `w:rPr` having *name*.
        */
        let rPr;
        rPr = this._element.rPr;
        if (rPr === null) {
            return null;
        }
        return rPr._get_bool_val(name);
    }
    _set_bool_prop(name, value) {
        /*
        Assign *value* to the boolean child *name* of `w:rPr`.
        */
        let rPr;
        rPr = this._element.get_or_add_rPr();
        rPr._set_bool_val(name, value);
    }
}
module.exports = {Font};
