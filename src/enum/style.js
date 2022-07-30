
/*
Enumerations related to styles
*/
let {EnumMember, XmlEnumeration, XmlMappedEnumMember} = require('./base');

class WD_BUILTIN_STYLE extends XmlEnumeration {
    /*
    alias: **WD_STYLE**

    Specifies a built-in Microsoft Word style.

    Example::

        from docx import Document
        from docx.enum.style import WD_STYLE

        document = Document()
        styles = document.styles
        style = styles[WD_STYLE.BODY_TEXT]
    */
    __ms_name__ = 'WdBuiltinStyle'

    __url__ = 'http://msdn.microsoft.com/en-us/library/office/ff835210.aspx'

    __members__ = [
        new EnumMember(
            'BLOCK_QUOTATION', -85, 'Block Text.'
        ),
        new EnumMember(
            'BODY_TEXT', -67, 'Body Text.'
        ),
        new EnumMember(
            'BODY_TEXT_2', -81, 'Body Text 2.'
        ),
        new EnumMember(
            'BODY_TEXT_3', -82, 'Body Text 3.'
        ),
        new EnumMember(
            'BODY_TEXT_FIRST_INDENT', -78, 'Body Text First Indent.'
        ),
        new EnumMember(
            'BODY_TEXT_FIRST_INDENT_2', -79, 'Body Text First Indent 2.'
        ),
        new EnumMember(
            'BODY_TEXT_INDENT', -68, 'Body Text Indent.'
        ),
        new EnumMember(
            'BODY_TEXT_INDENT_2', -83, 'Body Text Indent 2.'
        ),
        new EnumMember(
            'BODY_TEXT_INDENT_3', -84, 'Body Text Indent 3.'
        ),
        new EnumMember(
            'BOOK_TITLE', -265, 'Book Title.'
        ),
        new EnumMember(
            'CAPTION', -35, 'Caption.'
        ),
        new EnumMember(
            'CLOSING', -64, 'Closing.'
        ),
        new EnumMember(
            'COMMENT_REFERENCE', -40, 'Comment Reference.'
        ),
        new EnumMember(
            'COMMENT_TEXT', -31, 'Comment Text.'
        ),
        new EnumMember(
            'DATE', -77, 'Date.'
        ),
        new EnumMember(
            'DEFAULT_PARAGRAPH_FONT', -66, 'Default Paragraph Font.'
        ),
        new EnumMember(
            'EMPHASIS', -89, 'Emphasis.'
        ),
        new EnumMember(
            'ENDNOTE_REFERENCE', -43, 'Endnote Reference.'
        ),
        new EnumMember(
            'ENDNOTE_TEXT', -44, 'Endnote Text.'
        ),
        new EnumMember(
            'ENVELOPE_ADDRESS', -37, 'Envelope Address.'
        ),
        new EnumMember(
            'ENVELOPE_RETURN', -38, 'Envelope Return.'
        ),
        new EnumMember(
            'FOOTER', -33, 'Footer.'
        ),
        new EnumMember(
            'FOOTNOTE_REFERENCE', -39, 'Footnote Reference.'
        ),
        new EnumMember(
            'FOOTNOTE_TEXT', -30, 'Footnote Text.'
        ),
        new EnumMember(
            'HEADER', -32, 'Header.'
        ),
        new EnumMember(
            'HEADING_1', -2, 'Heading 1.'
        ),
        new EnumMember(
            'HEADING_2', -3, 'Heading 2.'
        ),
        new EnumMember(
            'HEADING_3', -4, 'Heading 3.'
        ),
        new EnumMember(
            'HEADING_4', -5, 'Heading 4.'
        ),
        new EnumMember(
            'HEADING_5', -6, 'Heading 5.'
        ),
        new EnumMember(
            'HEADING_6', -7, 'Heading 6.'
        ),
        new EnumMember(
            'HEADING_7', -8, 'Heading 7.'
        ),
        new EnumMember(
            'HEADING_8', -9, 'Heading 8.'
        ),
        new EnumMember(
            'HEADING_9', -10, 'Heading 9.'
        ),
        new EnumMember(
            'HTML_ACRONYM', -96, 'HTML Acronym.'
        ),
        new EnumMember(
            'HTML_ADDRESS', -97, 'HTML Address.'
        ),
        new EnumMember(
            'HTML_CITE', -98, 'HTML Cite.'
        ),
        new EnumMember(
            'HTML_CODE', -99, 'HTML Code.'
        ),
        new EnumMember(
            'HTML_DFN', -100, 'HTML Definition.'
        ),
        new EnumMember(
            'HTML_KBD', -101, 'HTML Keyboard.'
        ),
        new EnumMember(
            'HTML_NORMAL', -95, 'Normal (Web).'
        ),
        new EnumMember(
            'HTML_PRE', -102, 'HTML Preformatted.'
        ),
        new EnumMember(
            'HTML_SAMP', -103, 'HTML Sample.'
        ),
        new EnumMember(
            'HTML_TT', -104, 'HTML Typewriter.'
        ),
        new EnumMember(
            'HTML_VAR', -105, 'HTML Variable.'
        ),
        new EnumMember(
            'HYPERLINK', -86, 'Hyperlink.'
        ),
        new EnumMember(
            'HYPERLINK_FOLLOWED', -87, 'Followed Hyperlink.'
        ),
        new EnumMember(
            'INDEX_1', -11, 'Index 1.'
        ),
        new EnumMember(
            'INDEX_2', -12, 'Index 2.'
        ),
        new EnumMember(
            'INDEX_3', -13, 'Index 3.'
        ),
        new EnumMember(
            'INDEX_4', -14, 'Index 4.'
        ),
        new EnumMember(
            'INDEX_5', -15, 'Index 5.'
        ),
        new EnumMember(
            'INDEX_6', -16, 'Index 6.'
        ),
        new EnumMember(
            'INDEX_7', -17, 'Index 7.'
        ),
        new EnumMember(
            'INDEX_8', -18, 'Index 8.'
        ),
        new EnumMember(
            'INDEX_9', -19, 'Index 9.'
        ),
        new EnumMember(
            'INDEX_HEADING', -34, 'Index Heading'
        ),
        new EnumMember(
            'INTENSE_EMPHASIS', -262, 'Intense Emphasis.'
        ),
        new EnumMember(
            'INTENSE_QUOTE', -182, 'Intense Quote.'
        ),
        new EnumMember(
            'INTENSE_REFERENCE', -264, 'Intense Reference.'
        ),
        new EnumMember(
            'LINE_NUMBER', -41, 'Line Number.'
        ),
        new EnumMember(
            'LIST', -48, 'List.'
        ),
        new EnumMember(
            'LIST_2', -51, 'List 2.'
        ),
        new EnumMember(
            'LIST_3', -52, 'List 3.'
        ),
        new EnumMember(
            'LIST_4', -53, 'List 4.'
        ),
        new EnumMember(
            'LIST_5', -54, 'List 5.'
        ),
        new EnumMember(
            'LIST_BULLET', -49, 'List Bullet.'
        ),
        new EnumMember(
            'LIST_BULLET_2', -55, 'List Bullet 2.'
        ),
        new EnumMember(
            'LIST_BULLET_3', -56, 'List Bullet 3.'
        ),
        new EnumMember(
            'LIST_BULLET_4', -57, 'List Bullet 4.'
        ),
        new EnumMember(
            'LIST_BULLET_5', -58, 'List Bullet 5.'
        ),
        new EnumMember(
            'LIST_CONTINUE', -69, 'List Continue.'
        ),
        new EnumMember(
            'LIST_CONTINUE_2', -70, 'List Continue 2.'
        ),
        new EnumMember(
            'LIST_CONTINUE_3', -71, 'List Continue 3.'
        ),
        new EnumMember(
            'LIST_CONTINUE_4', -72, 'List Continue 4.'
        ),
        new EnumMember(
            'LIST_CONTINUE_5', -73, 'List Continue 5.'
        ),
        new EnumMember(
            'LIST_NUMBER', -50, 'List Number.'
        ),
        new EnumMember(
            'LIST_NUMBER_2', -59, 'List Number 2.'
        ),
        new EnumMember(
            'LIST_NUMBER_3', -60, 'List Number 3.'
        ),
        new EnumMember(
            'LIST_NUMBER_4', -61, 'List Number 4.'
        ),
        new EnumMember(
            'LIST_NUMBER_5', -62, 'List Number 5.'
        ),
        new EnumMember(
            'LIST_PARAGRAPH', -180, 'List Paragraph.'
        ),
        new EnumMember(
            'MACRO_TEXT', -46, 'Macro Text.'
        ),
        new EnumMember(
            'MESSAGE_HEADER', -74, 'Message Header.'
        ),
        new EnumMember(
            'NAV_PANE', -90, 'Document Map.'
        ),
        new EnumMember(
            'NORMAL', -1, 'Normal.'
        ),
        new EnumMember(
            'NORMAL_INDENT', -29, 'Normal Indent.'
        ),
        new EnumMember(
            'NORMAL_OBJECT', -158, 'Normal (applied to an object).'
        ),
        new EnumMember(
            'NORMAL_TABLE', -106, 'Normal (applied within a table).'
        ),
        new EnumMember(
            'NOTE_HEADING', -80, 'Note Heading.'
        ),
        new EnumMember(
            'PAGE_NUMBER', -42, 'Page Number.'
        ),
        new EnumMember(
            'PLAIN_TEXT', -91, 'Plain Text.'
        ),
        new EnumMember(
            'QUOTE', -181, 'Quote.'
        ),
        new EnumMember(
            'SALUTATION', -76, 'Salutation.'
        ),
        new EnumMember(
            'SIGNATURE', -65, 'Signature.'
        ),
        new EnumMember(
            'STRONG', -88, 'Strong.'
        ),
        new EnumMember(
            'SUBTITLE', -75, 'Subtitle.'
        ),
        new EnumMember(
            'SUBTLE_EMPHASIS', -261, 'Subtle Emphasis.'
        ),
        new EnumMember(
            'SUBTLE_REFERENCE', -263, 'Subtle Reference.'
        ),
        new EnumMember(
            'TABLE_COLORFUL_GRID', -172, 'Colorful Grid.'
        ),
        new EnumMember(
            'TABLE_COLORFUL_LIST', -171, 'Colorful List.'
        ),
        new EnumMember(
            'TABLE_COLORFUL_SHADING', -170, 'Colorful Shading.'
        ),
        new EnumMember(
            'TABLE_DARK_LIST', -169, 'Dark List.'
        ),
        new EnumMember(
            'TABLE_LIGHT_GRID', -161, 'Light Grid.'
        ),
        new EnumMember(
            'TABLE_LIGHT_GRID_ACCENT_1', -175, 'Light Grid Accent 1.'
        ),
        new EnumMember(
            'TABLE_LIGHT_LIST', -160, 'Light List.'
        ),
        new EnumMember(
            'TABLE_LIGHT_LIST_ACCENT_1', -174, 'Light List Accent 1.'
        ),
        new EnumMember(
            'TABLE_LIGHT_SHADING', -159, 'Light Shading.'
        ),
        new EnumMember(
            'TABLE_LIGHT_SHADING_ACCENT_1', -173, 'Light Shading Accent 1.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_GRID_1', -166, 'Medium Grid 1.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_GRID_2', -167, 'Medium Grid 2.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_GRID_3', -168, 'Medium Grid 3.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_LIST_1', -164, 'Medium List 1.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_LIST_1_ACCENT_1', -178, 'Medium List 1 Accent 1.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_LIST_2', -165, 'Medium List 2.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_SHADING_1', -162, 'Medium Shading 1.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_SHADING_1_ACCENT_1', -176,
            'Medium Shading 1 Accent 1.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_SHADING_2', -163, 'Medium Shading 2.'
        ),
        new EnumMember(
            'TABLE_MEDIUM_SHADING_2_ACCENT_1', -177,
            'Medium Shading 2 Accent 1.'
        ),
        new EnumMember(
            'TABLE_OF_AUTHORITIES', -45, 'Table of Authorities.'
        ),
        new EnumMember(
            'TABLE_OF_FIGURES', -36, 'Table of Figures.'
        ),
        new EnumMember(
            'TITLE', -63, 'Title.'
        ),
        new EnumMember(
            'TOAHEADING', -47, 'TOA Heading.'
        ),
        new EnumMember(
            'TOC_1', -20, 'TOC 1.'
        ),
        new EnumMember(
            'TOC_2', -21, 'TOC 2.'
        ),
        new EnumMember(
            'TOC_3', -22, 'TOC 3.'
        ),
        new EnumMember(
            'TOC_4', -23, 'TOC 4.'
        ),
        new EnumMember(
            'TOC_5', -24, 'TOC 5.'
        ),
        new EnumMember(
            'TOC_6', -25, 'TOC 6.'
        ),
        new EnumMember(
            'TOC_7', -26, 'TOC 7.'
        ),
        new EnumMember(
            'TOC_8', -27, 'TOC 8.'
        ),
        new EnumMember(
            'TOC_9', -28, 'TOC 9.'
        )]
}


class _WD_STYLE_TYPE extends XmlEnumeration {
    /*
    Specifies one of the four style types: paragraph, character, list, or
    table.

    Example::

        from docx import Document
        from docx.enum.style import WD_STYLE_TYPE

        styles = Document().styles
        assert styles[0].type == WD_STYLE_TYPE.PARAGRAPH
    */

    __url__ = 'http://msdn.microsoft.com/en-us/library/office/ff196870.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            'CHARACTER', 2, 'character', 'Character style.'
        ),
        new XmlMappedEnumMember(
            'LIST', 4, 'numbering', 'List style.'
        ),
        new XmlMappedEnumMember(
            'PARAGRAPH', 1, 'paragraph', 'Paragraph style.'
        ),
        new XmlMappedEnumMember(
            'TABLE', 3, 'table', 'Table style.'
        )]
}
let WD_STYLE = new WD_BUILTIN_STYLE();
WD_STYLE.populate_enums();
let WD_STYLE_TYPE = new _WD_STYLE_TYPE();
WD_STYLE_TYPE.populate_enums();
module.exports = {WD_STYLE_TYPE, WD_STYLE};
