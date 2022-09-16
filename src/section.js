
/* The |Section| object and related proxy classes */
let {BlockItemContainer} = require('./blkcntnr');
let {WD_HEADER_FOOTER} = require('./enum/section');
let {NotImplementedError} = require('./exceptions');
let {getIndexedAccess} = require('./shared');



class Sections  {
    /*Sequence of |Section| objects corresponding to the sections in the document.

    Supports ``len()``, iteration, and indexed access.
    */
    constructor(document_elm, document_part) {
        this._document_elm = document_elm;
        this._document_part = document_part;
        this[Symbol.iterator] = this.iter;
        return getIndexedAccess(this);
    }
    getitem(idx) {
        let sectPr = this._document_elm.sectPr_lst[idx];
        if (sectPr)
            return new Section(sectPr, this._document_part);
        return null;
    }
    slice(start, end) {
        return [...this].slice(start, end);
    }
    *iter() {
        for(let sectPr of this._document_elm.sectPr_lst){
            yield new Section(sectPr, this._document_part)
        }
    }
    get length() {
        return this._document_elm.sectPr_lst.length;
    }
}
class Section  {
    /*Document section, providing access to section and page setup settings.

    Also provides access to headers and footers.
    */
    constructor(sectPr, document_part) {
        this._sectPr = sectPr;
        this._document_part = document_part;
    }
    get bottom_margin() {
        /*
        |Length| object representing the bottom margin for all pages in this
        section in English Metric Units.
        */
        return this._sectPr.bottom_margin;
    }
    set bottom_margin(value) {
        this._sectPr.bottom_margin = value;
    }
    get different_first_page_header_footer() {
        /*True if this section displays a distinct first-page header and footer.

        Read/write. The definition of the first-page header and footer are accessed
        using :attr:`.first_page_header` and :attr:`.first_page_footer` respectively.
        */
        return this._sectPr.titlePg_val;
    }
    set different_first_page_header_footer(value) {
        this._sectPr.titlePg_val = value;
    }
    get even_page_footer() {
        /*|_Footer| object defining footer content for even pages.

        The content of this footer definition is ignored unless the document setting
        :attr:`~.Settings.odd_and_even_pages_header_footer` is set True.
        */
        return new _Footer(this._sectPr, this._document_part, WD_HEADER_FOOTER.EVEN_PAGE);
    }
    get even_page_header() {
        /*|_Header| object defining header content for even pages.

        The content of this header definition is ignored unless the document setting
        :attr:`~.Settings.odd_and_even_pages_header_footer` is set True.
        */
        return new _Header(this._sectPr, this._document_part, WD_HEADER_FOOTER.EVEN_PAGE);
    }
    get first_page_footer() {
        /*|_Footer| object defining footer content for the first page of this section.

        The content of this footer definition is ignored unless the property
        :attr:`.different_first_page_header_footer` is set True.
        */
        return new _Footer(this._sectPr, this._document_part, WD_HEADER_FOOTER.FIRST_PAGE);
    }
    get first_page_header() {
        /*|_Header| object defining header content for the first page of this section.

        The content of this header definition is ignored unless the property
        :attr:`.different_first_page_header_footer` is set True.
        */
        return new _Header(this._sectPr, this._document_part, WD_HEADER_FOOTER.FIRST_PAGE);
    }
    get footer() {
        /*|_Footer| object representing _default page footer for this section.

        The default footer is used for odd-numbered pages when separate odd/even footers
        are enabled. It is used for both odd and even-numbered pages otherwise.
        */
        if(!this._footer)
            this._footer = new _Footer(this._sectPr, this._document_part, WD_HEADER_FOOTER.PRIMARY);
        return this._footer;
    }
    get footer_distance() {
        /*
        |Length| object representing the distance from the bottom edge of the
        page to the bottom edge of the footer. |None| if no setting is present
        in the XML.
        */
        return this._sectPr.footer;
    }
    set footer_distance(value) {
        this._sectPr.footer = value;
    }
    get gutter() {
        /*
        |Length| object representing the page gutter size in English Metric
        Units for all pages in this section. The page gutter is extra spacing
        added to the *inner* margin to ensure even margins after page
        binding.
        */
        return this._sectPr.gutter;
    }
    set gutter(value) {
        this._sectPr.gutter = value;
    }
    get header() {
        /*|_Header| object representing _default page header for this section.

        The default header is used for odd-numbered pages when separate odd/even headers
        are enabled. It is used for both odd and even-numbered pages otherwise.
        */
        if(!this._header)
            this._header = new _Header(this._sectPr, this._document_part, WD_HEADER_FOOTER.PRIMARY);
        return this._header;
    }
    get header_distance() {
        /*
        |Length| object representing the distance from the top edge of the
        page to the top edge of the header. |None| if no setting is present
        in the XML.
        */
        return this._sectPr.header;
    }
    set header_distance(value) {
        this._sectPr.header = value;
    }
    get left_margin() {
        /*
        |Length| object representing the left margin for all pages in this
        section in English Metric Units.
        */
        return this._sectPr.left_margin;
    }
    set left_margin(value) {
        this._sectPr.left_margin = value;
    }
    get orientation() {
        /*
        Member of the :ref:`WdOrientation` enumeration specifying the page
        orientation for this section, one of ``WD_ORIENT.PORTRAIT`` or
        ``WD_ORIENT.LANDSCAPE``.
        */
        return this._sectPr.orientation;
    }
    set orientation(value) {
        this._sectPr.orientation = value;
    }
    get page_height() {
        /*
        Total page height used for this section, inclusive of all edge spacing
        values such as margins. Page orientation is taken into account, so
        for example, its expected value would be ``Inches(8.5)`` for
        letter-sized paper when orientation is landscape.
        */
        return this._sectPr.page_height;
    }
    set page_height(value) {
        this._sectPr.page_height = value;
    }
    get page_width() {
        /*
        Total page width used for this section, inclusive of all edge spacing
        values such as margins. Page orientation is taken into account, so
        for example, its expected value would be ``Inches(11)`` for
        letter-sized paper when orientation is landscape.
        */
        return this._sectPr.page_width;
    }
    set page_width(value) {
        this._sectPr.page_width = value;
    }
    get right_margin() {
        /*
        |Length| object representing the right margin for all pages in this
        section in English Metric Units.
        */
        return this._sectPr.right_margin;
    }
    set right_margin(value) {
        this._sectPr.right_margin = value;
    }
    get start_type() {
        /*
        The member of the :ref:`WdSectionStart` enumeration corresponding to
        the initial break behavior of this section, e.g.
        ``WD_SECTION.ODD_PAGE`` if the section should begin on the next odd
        page.
        */
        return this._sectPr.start_type;
    }
    set start_type(value) {
        this._sectPr.start_type = value;
    }
    get top_margin() {
        /*
        |Length| object representing the top margin for all pages in this
        section in English Metric Units.
        */
        return this._sectPr.top_margin;
    }
    set top_margin(value) {
        this._sectPr.top_margin = value;
    }
}

class _BaseHeaderFooter extends BlockItemContainer {
    /* Base class for header and footer classes */
    constructor(sectPr, document_part, header_footer_index) {
        super();
        this._sectPr = sectPr;
        this._document_part = document_part;
        this._hdrftr_index = header_footer_index;
    }
    get is_linked_to_previous() {
        /*``True`` if this header/footer uses the definition from the prior section.

        ``False`` if this header/footer has an explicit definition.

        Assigning ``True`` to this property removes the header/footer definition for
        this section, causing it to "inherit" the corresponding definition of the prior
        section. Assigning ``False`` causes a new, empty definition to be added for this
        section, but only if no definition is already present.
        */
        //# ---absence of a header/footer part indicates "linked" behavior---
        return !this._has_definition;
    }
    set is_linked_to_previous(value) {
        let new_state;
        new_state = Boolean(value);
        //# ---do nothing when value is not being changed---
        if (new_state === this.is_linked_to_previous) {
            return;
        }
        if (new_state === true) {
            this._drop_definition();
        } else {
            this._add_definition();
        }
    }
    get part() {
        /*The |HeaderPart| or |FooterPart| for this header/footer.

        This overrides `BlockItemContainer.part` and is required to support image
        insertion and perhaps other content like hyperlinks.
        */
        //# ---should not appear in documentation;
        //# ---not an interface property, even though public
        return this._get_or_add_definition();
    }
    _add_definition() {
        /* Return newly-added header/footer part. */
        throw new NotImplementedError("must be implemented by each subclass");
    }
    get _definition() {
        /* |HeaderPart| or |FooterPart| object containing header/footer content. */
        throw new NotImplementedError("must be implemented by each subclass");
    }
    _drop_definition() {
        /* Remove header/footer part containing the definition of this header/footer. */
        throw new NotImplementedError("must be implemented by each subclass");
    }
    get _element() {
        /* `w:hdr` or `w:ftr` element, root of header/footer part. */
        return this._get_or_add_definition().element;
    }
    set _element(element) {
        //to avoid TypeError Cannot set property _element of #<_BaseHeaderFooter> which has only a getter
    }
    _get_or_add_definition() {
        /*Return HeaderPart or FooterPart object for this section.

        If this header/footer inherits its content, the part for the prior header/footer
        is returned; this process continue recursively until a definition is found. If
        the definition cannot be inherited (because the header/footer belongs to the
        first section), a new definition is added for that first section and then
        returned.
        */
        //# ---note this method is called recursively to access inherited definitions---
        //# ---case-1: definition is not inherited---
        if (this._has_definition) {
            return this._definition;
        }
        //# ---case-2: definition is inherited and belongs to second-or-later section---
        let prior_headerfooter = this._prior_headerfooter;
        if (prior_headerfooter) {
            return prior_headerfooter._get_or_add_definition();
        }
        return this._add_definition();
    }
    get _has_definition() {
        /* True if this header/footer has a related part containing its definition. */
        throw new NotImplementedError("must be implemented by each subclass");
    }
    get _prior_headerfooter() {
        /*|_Header| or |_Footer| proxy on prior sectPr element.

        Returns None if this is first section.
        */
        throw new NotImplementedError("must be implemented by each subclass");
    }
}
class _Footer extends _BaseHeaderFooter {
    /*Page footer, used for all three types (_default, even-page, and first-page).

    Note that, like a document or table cell, a footer must contain a minimum of one
    paragraph and a new or otherwise "empty" footer contains a single empty paragraph.
    This first paragraph can be accessed as `footer.paragraphs[0]` for purposes of
    adding content to it. Using :meth:`add_paragraph()` by itself to add content will
    leave an empty paragraph above the newly added one.
    */
    _add_definition() {
        /* Return newly-added footer part. */
        let footer_part, rId;
        [footer_part, rId] = this._document_part.add_footer_part();
        this._sectPr.add_footerReference(this._hdrftr_index, rId);
        return footer_part;
    }
    get _definition() {
        /* |FooterPart| object containing content of this footer. */
        let footerReference;
        footerReference = this._sectPr.get_footerReference(this._hdrftr_index);
        return this._document_part.footer_part(footerReference.rId);
    }
    _drop_definition() {
        /* Remove footer definition (footer part) associated with this section. */
        let rId;
        rId = this._sectPr.remove_footerReference(this._hdrftr_index);
        this._document_part.drop_rel(rId);
    }
    get _has_definition() {
        /* True if a footer is defined for this section. */
        let footerReference;
        footerReference = this._sectPr.get_footerReference(this._hdrftr_index);
        return footerReference !== null;
    }
    get _prior_headerfooter() {
        /* |_Footer| proxy on prior sectPr element or None if this is first section. */
        let preceding_sectPr;
        preceding_sectPr = this._sectPr.preceding_sectPr;
        return preceding_sectPr === null ? null :
            new _Footer(preceding_sectPr, this._document_part, this._hdrftr_index);
    }
}
class _Header extends _BaseHeaderFooter {
    /*Page header, used for all three types (_default, even-page, and first-page).

    Note that, like a document or table cell, a header must contain a minimum of one
    paragraph and a new or otherwise "empty" header contains a single empty paragraph.
    This first paragraph can be accessed as `header.paragraphs[0]` for purposes of
    adding content to it. Using :meth:`add_paragraph()` by itself to add content will
    leave an empty paragraph above the newly added one.
    */
    _add_definition() {
        /* Return newly-added header part. */
        let header_part, rId;
        [header_part, rId] = this._document_part.add_header_part();
        this._sectPr.add_headerReference(this._hdrftr_index, rId);
        return header_part;
    }
    get _definition() {
        /* |HeaderPart| object containing content of this header. */
        let headerReference;
        headerReference = this._sectPr.get_headerReference(this._hdrftr_index);
        return this._document_part.header_part(headerReference.rId);
    }
    _drop_definition() {
        /* Remove header definition associated with this section. */
        let rId;
        rId = this._sectPr.remove_headerReference(this._hdrftr_index);
        this._document_part.drop_header_part(rId);
    }
    get _has_definition() {
        /* True if a header is explicitly defined for this section. */
        let headerReference;
        headerReference = this._sectPr.get_headerReference(this._hdrftr_index);
        return headerReference !== null;
    }
    get _prior_headerfooter() {
        /* |_Header| proxy on prior sectPr element or None if this is first section. */
        let preceding_sectPr;
        preceding_sectPr = this._sectPr.preceding_sectPr;
        return preceding_sectPr === null ? null :
            new _Header(preceding_sectPr, this._document_part, this._hdrftr_index);
    }
}

module.exports = {Section, Sections, _Footer, _Header, _BaseHeaderFooter}
