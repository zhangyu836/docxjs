
/*
Custom element classes that correspond to the document part, e.g.
<w:document>.
*/
let {BaseOxmlElement, ZeroOrMore, ZeroOrOne} = require('./xmlchemy');
class CT_Document extends BaseOxmlElement {
    /*
    ``<w:document>`` element, the root element of a document.xml file.
    */
    body = new ZeroOrOne('w:body');

    get sectPr_lst() {
        /*
        Return a list containing a reference to each ``<w:sectPr>`` element
        in the document, in the order encountered.
        */
        return this.xpath(".//w:sectPr");
    }
}

class CT_Body extends BaseOxmlElement {
    /*
    ``<w:body>``, the container element for the main document story in
    ``document.xml``.
    */
    p = new ZeroOrMore('w:p', ['w:sectPr']);
    tbl = new ZeroOrMore('w:tbl',['w:sectPr']);
    sectPr = new ZeroOrOne('w:sectPr' );

    add_section_break() {
        /*Return `w:sectPr` element for new section added at end of document.

        The last `w:sectPr` becomes the second-to-last, with the new `w:sectPr` being an
        exact clone of the previous one, except that all header and footer references
        are removed (and are therefore now "inherited" from the prior section).

        A copy of the previously-last `w:sectPr` will now appear in a new `w:p` at the
        end of the document. The returned `w:sectPr` is the sentinel `w:sectPr` for the
        document (and as implemented, *is* the prior sentinel `w:sectPr` with headers
        and footers removed).
        */
        // ---get the sectPr at file-end, which controls last section (sections[-1])---
        let sentinel_sectPr = this.get_or_add_sectPr();
        // ---add exact copy to new `w:p` element; that is now second-to last section---
        this.add_p().set_sectPr(sentinel_sectPr.clone());
        // ---remove any header or footer references from "new" last section---
        let hdrftr_refs = sentinel_sectPr.xpath("w:headerReference|w:footerReference");
        for (let hdrftr_ref of hdrftr_refs) {
            sentinel_sectPr.remove(hdrftr_ref);
        }
        return sentinel_sectPr;
    }
    clear_content() {
        /*
        Remove all content child elements from this <w:body> element. Leave
        the <w:sectPr> element if it is present.
        */
        let content_elms;
        if (this.sectPr !== null) {
            content_elms = this.slice(0, -1);
        } else {
            content_elms = this.slice(0);
        }
        for (let content_elm of content_elms) {
            this.remove(content_elm);
        }
    }
}

module.exports = {CT_Document, CT_Body};


