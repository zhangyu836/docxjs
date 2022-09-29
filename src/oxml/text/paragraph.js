/*
Custom element classes related to paragraphs (CT_P).
*/
let {BaseOxmlElement, OxmlElement, ZeroOrMore, ZeroOrOne} = require('../xmlchemy');


class CT_P extends BaseOxmlElement {
    /*
    ``<w:p>`` element, containing the properties and text for a paragraph.
    */
    pPr = new ZeroOrOne("w:pPr");
    r = new ZeroOrMore("w:r");
    hyperlink = new ZeroOrMore("w:hyperlink");

    _insert_pPr(pPr) {
        this.insert(0, pPr);
        return pPr;
    }
    add_p_before() {
        /*
        Return a new ``<w:p>`` element inserted directly prior to this one.
        */
        let new_p;
        new_p = OxmlElement("w:p");
        this.addprevious(new_p);
        return new_p;
    }
    get alignment() {
        /*
        The value of the ``<w:jc>`` grandchild element or |None| if not
        present.
        */
        let pPr;
        pPr = this.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.jc_val;
    }
    set alignment(value) {
        let pPr;
        pPr = this.get_or_add_pPr();
        pPr.jc_val = value;
    }
    clear_content() {
        /*
        Remove all child elements, except the ``<w:pPr>`` element if present.
        */
        for (let child of this.slice(0)) {
            if (child.tagName === "w:pPr") {
                continue;
            }
            this.remove(child);
        }
    }
    get sectPr() {
        let pPr;
        pPr = this.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.sectPr;
    }
    set_sectPr(sectPr) {
        /*
        Unconditionally replace or add *sectPr* as a grandchild in the
        correct sequence.
        */
        let pPr;
        pPr = this.get_or_add_pPr();
        pPr._remove_sectPr();
        pPr._insert_sectPr(sectPr);
    }
    get style() {
        /*
        String contained in w:val attribute of ./w:pPr/w:pStyle grandchild,
        or |None| if not present.
        */
        let pPr;
        pPr = this.pPr;
        if (pPr === null) {
            return null;
        }
        return pPr.style;
    }
    set style(style) {
        let pPr;
        pPr = this.get_or_add_pPr();
        pPr.style = style;
    }
}


module.exports = {CT_P};
