/*
Enumerations related to the main document in WordprocessingML files
*/
let {XmlEnumeration, XmlMappedEnumMember} = require('./base');


class WD_HEADER_FOOTER_INDEX extends XmlEnumeration {
    /*
    alias: **WD_HEADER_FOOTER**

    Specifies one of the three possible header/footer definitions for a section.

    For internal use only; not part of the python-docx API.
    */
    __ms_name__ = "WdHeaderFooterIndex"

    __url__ = "https://docs.microsoft.com/en-us/office/vba/api/word.wdheaderfooterindex"

    __members__ = [
        new XmlMappedEnumMember(
            "PRIMARY", 1, "default", "Header for odd pages or all if no even header."
        ),
        new XmlMappedEnumMember(
            "FIRST_PAGE", 2, "first", "Header for first page of section."
        ),
        new XmlMappedEnumMember(
            "EVEN_PAGE", 3, "even", "Header for even pages of recto/verso section."
        )]
}


class _WD_ORIENTATION extends XmlEnumeration {
    /*
    alias: **WD_ORIENT**

    Specifies the page layout orientation.

    Example::

        from docx.enum.section import WD_ORIENT

        section = document.sections[-1]
        section.orientation = WD_ORIENT.LANDSCAPE
    */
    __ms_name__ = 'WdOrientation'

    __url__ = 'http://msdn.microsoft.com/en-us/library/office/ff837902.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            'PORTRAIT', 0, 'portrait', 'Portrait orientation.'
        ),
        new XmlMappedEnumMember(
            'LANDSCAPE', 1, 'landscape', 'Landscape orientation.'
        )]
}


class _WD_SECTION_START extends XmlEnumeration {
    /*
    alias: **WD_SECTION**

    Specifies the start type of a section break.

    Example::

        from docx.enum.section import WD_SECTION

        section = document.sections[0]
        section.start_type = WD_SECTION.NEW_PAGE
    */

    __ms_name__ = 'WdSectionStart'

    __url__ = 'http://msdn.microsoft.com/en-us/library/office/ff840975.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            'CONTINUOUS', 0, 'continuous', 'Continuous section break.'
        ),
        new XmlMappedEnumMember(
            'NEW_COLUMN', 1, 'nextColumn', 'New column section break.'
        ),
        new XmlMappedEnumMember(
            'NEW_PAGE', 2, 'nextPage', 'New page section break.'
        ),
        new XmlMappedEnumMember(
            'EVEN_PAGE', 3, 'evenPage', 'Even pages section break.'
        ),
        new XmlMappedEnumMember(
            'ODD_PAGE', 4, 'oddPage', 'Section begins on next odd page.'
        )]
}
let WD_HEADER_FOOTER = new WD_HEADER_FOOTER_INDEX();
WD_HEADER_FOOTER.populate_enums();
let WD_ORIENTATION = new _WD_ORIENTATION();
WD_ORIENTATION.populate_enums();
let WD_SECTION_START = new _WD_SECTION_START();
WD_SECTION_START.populate_enums();
module.exports = {WD_HEADER_FOOTER, WD_ORIENTATION, WD_SECTION_START,
    WD_SECTION:WD_SECTION_START, WD_ORIENT:WD_ORIENTATION};
