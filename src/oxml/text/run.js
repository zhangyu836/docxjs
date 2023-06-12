
/*
Custom element classes related to text runs (CT_R).
*/
let {ST_BrClear, ST_BrType} = require('../simpletypes');
let {BaseOxmlElement, OptionalAttribute, ZeroOrMore, ZeroOrOne} = require('../xmlchemy');

class CT_Br extends BaseOxmlElement {
    /*
    ``<w:br>`` element, indicating a line, page, or column break in a run.
    */
    type = new OptionalAttribute('w:type', ST_BrType);
    clear = new OptionalAttribute('w:clear', ST_BrClear);
}

class CT_R extends BaseOxmlElement {
    /*
    ``<w:r>`` element, containing the properties and text for a run.
    */
    rPr = new ZeroOrOne('w:rPr');
    t = new ZeroOrMore('w:t');
    br = new ZeroOrMore('w:br');
    cr = new ZeroOrMore('w:cr');
    tab = new ZeroOrMore('w:tab');
    drawing = new ZeroOrMore('w:drawing');

    _insert_rPr(rPr) {
        this.insert(0, rPr);
        return rPr;
    }
    add_t(text) {
        /*
        Return a newly added ``<w:t>`` element containing *text*.
        */
        let t = this._add_t();
        t.text = text;
        if (text.trim().length < text.length) {
            t.setAttribute("xml:space", "preserve");
        }
        return t;
    }
    add_drawing(inline_or_anchor) {
        /*
        Return a newly appended ``CT_Drawing`` (``<w:drawing>``) child
        element having *inline_or_anchor* as its child.
        */
        let drawing;
        drawing = this._add_drawing();
        drawing.append(inline_or_anchor);
        return drawing;
    }
    clear_content() {
        /*
        Remove all child elements except the ``<w:rPr>`` element if present.
        */
        let content_child_elms;
        content_child_elms = ((this.rPr !== null) ? this.slice(1) : this.slice(0));
        for (let child of content_child_elms) {
            this.remove(child);
        }
    }
    get style() {
        /*
        String contained in w:val attribute of <w:rStyle> grandchild, or
        |None| if that element is not present.
        */
        let rPr;
        rPr = this.rPr;
        if (rPr === null) {
            return null;
        }
        return rPr.style;
    }
    set style(style) {
        /*
        Set the character style of this <w:r> element to *style*. If *style*
        is None, remove the style element.
        */
        let rPr;
        rPr = this.get_or_add_rPr();
        rPr.style = style;
    }
    get text() {
        /*
        A string representing the textual content of this run, with content
        child elements like ``<w:tab/>`` translated to their Python
        equivalent.
        */
        let text = [];
        for (let child of this.slice()) {
            switch (child.tagName) {
                case "w:t":
                    let t_text = child.text;
                    if(t_text)
                        text.push(t_text);
                    break;
                case "w:tab":
                    text.push("\t");
                    break;
                case "w:br":
                case "w:cr":
                    text.push("\n");
                    break;
            }
        }
        return text.join();
    }
    set text(text) {
        this.clear_content();
        _RunContentAppender.append_to_run_from_text(this, text);
    }
}

class CT_Text extends BaseOxmlElement {
    /*
    ``<w:t>`` element, containing a sequence of characters within a run.
    */
}
class _RunContentAppender  {
    /*
    Service object that knows how to translate a Python string into run
    content elements appended to a specified ``<w:r>`` element. Contiguous
    sequences of regular characters are appended in a single ``<w:t>``
    element. Each tab character ('\t') causes a ``<w:tab/>`` element to be
    appended. Likewise a newline or carriage return character ('\n', '\r')
    causes a ``<w:cr>`` element to be appended.
    */
    constructor(r) {
        this._r = r;
        this._bfr = [];
    }
    static append_to_run_from_text(r, text) {
        /*
        Create a "one-shot" ``_RunContentAppender`` instance and use it to
        append the run content elements corresponding to *text* to the
        ``<w:r>`` element *r*.
        */
        let appender;
        appender = new this(r);
        appender.add_text(text);
    }
    add_text(text) {
        /*
        Append the run content elements corresponding to *text* to the
        ``<w:r>`` element of this instance.
        */
        for (let _char of text) {
            this.add_char(_char);
        }
        this.flush();
    }
    add_char(_char) {
        /*
        Process the next character of input through the translation finite
        state maching (FSM). There are two possible states, buffer pending
        and not pending, but those are hidden behind the ``.flush()`` method
        which must be called at the end of text to ensure any pending
        ``<w:t>`` element is written.
        */
        if (_char === "\t") {
            this.flush();
            this._r.add_tab();
        } else {
            if ("\r\n".includes(_char)) {
                this.flush();
                this._r.add_br();
            } else {
                this._bfr.push(_char);
            }
        }
    }
    flush() {
        let text;
        text = this._bfr.join('');
        if (text) {
            this._r.add_t(text);
        }
        this._bfr = [];
    }
}

module.exports = {CT_Br, CT_R, CT_Text};

