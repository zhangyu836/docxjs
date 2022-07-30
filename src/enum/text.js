/*
Enumerations related to text in WordprocessingML files
*/
let {EnumMember, XmlEnumeration, XmlMappedEnumMember} = require('./base');




class WD_PARAGRAPH_ALIGNMENT extends XmlEnumeration {
    /*
    alias: **WD_ALIGN_PARAGRAPH**

    Specifies paragraph justification type.

    Example::

        from docx.enum.text import WD_ALIGN_PARAGRAPH

        paragraph = document.add_paragraph()
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    */
    __ms_name__ = 'WdParagraphAlignment'

    __url__ = 'http://msdn.microsoft.com/en-us/library/office/ff835817.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            'LEFT', 0, 'left', 'Left-aligned'
        ),
        new XmlMappedEnumMember(
            'CENTER', 1, 'center', 'Center-aligned.'
        ),
        new XmlMappedEnumMember(
            'RIGHT', 2, 'right', 'Right-aligned.'
        ),
        new XmlMappedEnumMember(
            'JUSTIFY', 3, 'both', 'Fully justified.'
        ),
        new XmlMappedEnumMember(
            'DISTRIBUTE', 4, 'distribute', 'Paragraph characters are ' +
            'distributed to fill the entire width of the paragraph.'
        ),
        new XmlMappedEnumMember(
            'JUSTIFY_MED', 5, 'mediumKashida', 'Justified with a medium ' +
            'character compression ratio.'
        ),
        new XmlMappedEnumMember(
            'JUSTIFY_HI', 7, 'highKashida', 'Justified with a high character' +
            ' compression ratio.'
        ),
        new XmlMappedEnumMember(
            'JUSTIFY_LOW', 8, 'lowKashida', 'Justified with a low character ' +
            'compression ratio.'
        ),
        new XmlMappedEnumMember(
            'THAI_JUSTIFY', 9, 'thaiDistribute', 'Justified according to Thai' +
            ' formatting layout.'
        )]
}


let WD_BREAK_TYPE = {
    /*
    Corresponds to WdBreakType enumeration
    http://msdn.microsoft.com/en-us/library/office/ff195905.aspx
    */
    COLUMN: 8,
    LINE: 6,
    LINE_CLEAR_LEFT : 9,
    LINE_CLEAR_RIGHT : 10,
    LINE_CLEAR_ALL : 11,  // added for consistency, not in MS version
    PAGE : 7,
    SECTION_CONTINUOUS : 3,
    SECTION_EVEN_PAGE : 4,
    SECTION_NEXT_PAGE : 2,
    SECTION_ODD_PAGE : 5,
    TEXT_WRAPPING : 11
}


class WD_COLOR_INDEX extends XmlEnumeration {
    /*
    Specifies a standard preset color to apply. Used for font highlighting and
    perhaps other applications.
    */
    __ms_name__ = 'WdColorIndex'

    __url__ = 'https://msdn.microsoft.com/EN-US/library/office/ff195343.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            null, null, null, 'Color is inherited from the style hierarchy.'
        ),
        new XmlMappedEnumMember(
            'AUTO', 0, 'default', 'Automatic color. Default; usually black.'
        ),
        new XmlMappedEnumMember(
            'BLACK', 1, 'black', 'Black color.'
        ),
        new XmlMappedEnumMember(
            'BLUE', 2, 'blue', 'Blue color'
        ),
        new XmlMappedEnumMember(
            'BRIGHT_GREEN', 4, 'green', 'Bright green color.'
        ),
        new XmlMappedEnumMember(
            'DARK_BLUE', 9, 'darkBlue', 'Dark blue color.'
        ),
        new XmlMappedEnumMember(
            'DARK_RED', 13, 'darkRed', 'Dark red color.'
        ),
        new XmlMappedEnumMember(
            'DARK_YELLOW', 14, 'darkYellow', 'Dark yellow color.'
        ),
        new XmlMappedEnumMember(
            'GRAY_25', 16, 'lightGray', '25% shade of gray color.'
        ),
        new XmlMappedEnumMember(
            'GRAY_50', 15, 'darkGray', '50% shade of gray color.'
        ),
        new XmlMappedEnumMember(
            'GREEN', 11, 'darkGreen', 'Green color.'
        ),
        new XmlMappedEnumMember(
            'PINK', 5, 'magenta', 'Pink color.'
        ),
        new XmlMappedEnumMember(
            'RED', 6, 'red', 'Red color.'
        ),
        new XmlMappedEnumMember(
            'TEAL', 10, 'darkCyan', 'Teal color.'
        ),
        new XmlMappedEnumMember(
            'TURQUOISE', 3, 'cyan', 'Turquoise color.'
        ),
        new XmlMappedEnumMember(
            'VIOLET', 12, 'darkMagenta', 'Violet color.'
        ),
        new XmlMappedEnumMember(
            'WHITE', 8, 'white', 'White color.'
        ),
        new XmlMappedEnumMember(
            'YELLOW', 7, 'yellow', 'Yellow color.'
        )]
}


class _WD_LINE_SPACING extends XmlEnumeration {
    /*
    Specifies a line spacing format to be applied to a paragraph.

    Example::

        from docx.enum.text import WD_LINE_SPACING

        paragraph = document.add_paragraph()
        paragraph.line_spacing_rule = WD_LINE_SPACING.EXACTLY
    */
    __ms_name__ = 'WdLineSpacing'

    __url__ = 'http://msdn.microsoft.com/en-us/library/office/ff844910.aspx'

    __members__ = [
        new EnumMember(
            'ONE_POINT_FIVE', 1, 'Space-and-a-half line spacing.'
        ),
        new XmlMappedEnumMember(
            'AT_LEAST', 3, 'atLeast', 'Line spacing is always at least the ' +
            'specified amount. The amount is specified separately.'
        ),
        new EnumMember(
            'DOUBLE', 2, 'Double spaced.'
        ),
        new XmlMappedEnumMember(
            'EXACTLY', 4, 'exact', 'Line spacing is exactly the specified ' +
            'amount. The amount is specified separately.'
        ),
        new XmlMappedEnumMember(
            'MULTIPLE', 5, 'auto', 'Line spacing is specified as a multiple ' +
            'of line heights. Changing the font size will change the line spacing proportionately.'
        ),
        new EnumMember(
            'SINGLE', 0, 'Single spaced (default).'
        )]
}



class _WD_TAB_ALIGNMENT extends XmlEnumeration {
    /*
    Specifies the tab stop alignment to apply.
    */
    __ms_name__ = 'WdTabAlignment'

    __url__ = 'https://msdn.microsoft.com/EN-US/library/office/ff195609.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            'LEFT', 0, 'left', 'Left-aligned.'
        ),
        new XmlMappedEnumMember(
            'CENTER', 1, 'center', 'Center-aligned.'
        ),
        new XmlMappedEnumMember(
            'RIGHT', 2, 'right', 'Right-aligned.'
        ),
        new XmlMappedEnumMember(
            'DECIMAL', 3, 'decimal', 'Decimal-aligned.'
        ),
        new XmlMappedEnumMember(
            'BAR', 4, 'bar', 'Bar-aligned.'
        ),
        new XmlMappedEnumMember(
            'LIST', 6, 'list', 'List-aligned. (deprecated)'
        ),
        new XmlMappedEnumMember(
            'CLEAR', 101, 'clear', 'Clear an inherited tab stop.'
        ),
        new XmlMappedEnumMember(
            'END', 102, 'end', 'Right-aligned.  (deprecated)'
        ),
        new XmlMappedEnumMember(
            'NUM', 103, 'num', 'Left-aligned.  (deprecated)'
        ),
        new XmlMappedEnumMember(
            'START', 104, 'start', 'Left-aligned.  (deprecated)'
        )]
}

class _WD_TAB_LEADER extends XmlEnumeration {
    /*
    Specifies the character to use as the leader with formatted tabs.
    */
    __ms_name__ = 'WdTabLeader'

    __url__ = 'https://msdn.microsoft.com/en-us/library/office/ff845050.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            'SPACES', 0, 'none', 'Spaces. Default.'
        ),
        new XmlMappedEnumMember(
            'DOTS', 1, 'dot', 'Dots.'
        ),
        new XmlMappedEnumMember(
            'DASHES', 2, 'hyphen', 'Dashes.'
        ),
        new XmlMappedEnumMember(
            'LINES', 3, 'underscore', 'Double lines.'
        ),
        new XmlMappedEnumMember(
            'HEAVY', 4, 'heavy', 'A heavy line.'
        ),
        new XmlMappedEnumMember(
            'MIDDLE_DOT', 5, 'middleDot', 'A vertically-centered dot.'
        )]
}

class _WD_UNDERLINE extends XmlEnumeration {
    /*
    Specifies the style of underline applied to a run of characters.
    */

    __ms_name__ = 'WdUnderline'

    __url__ = 'http://msdn.microsoft.com/en-us/library/office/ff822388.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            null, null, '', 'Inherit underline setting from containing ' +
            'paragraph.'
        ),
        new XmlMappedEnumMember(
            null, null, null, 'Inherit underline setting from containing ' +
            'paragraph.'
        ),
        new XmlMappedEnumMember(
            'NONE', 0, 'none', 'No underline. This setting overrides any ' +
            'inherited underline value, so can be used to remove underline from' +
            ' a run that inherits underlining from its containing paragraph.' +
            ' Note this is not the same as assigning |None| to Run.underline.' +
            ' |None| is a valid assignment value, but causes the run to inherit' +
            ' its underline value. Assigning ``WD_UNDERLINE.NONE`` causes' +
            ' underlining to be unconditionally turned off.'
        ),
        new XmlMappedEnumMember(
            'SINGLE', 1, 'single', 'A single line. Note that this setting is' +
            'write-only in the sense that |True| (rather than ' +
            '``WD_UNDERLINE.SINGLE``) is returned for a run having this setting.'
        ),
        new XmlMappedEnumMember(
            'WORDS', 2, 'words', 'Underline individual words only.'
        ),
        new XmlMappedEnumMember(
            'DOUBLE', 3, 'double', 'A double line.'
        ),
        new XmlMappedEnumMember(
            'DOTTED', 4, 'dotted', 'Dots.'
        ),
        new XmlMappedEnumMember(
            'THICK', 6, 'thick', 'A single thick line.'
        ),
        new XmlMappedEnumMember(
            'DASH', 7, 'dash', 'Dashes.'
        ),
        new XmlMappedEnumMember(
            'DOT_DASH', 9, 'dotDash', 'Alternating dots and dashes.'
        ),
        new XmlMappedEnumMember(
            'DOT_DOT_DASH', 10, 'dotDotDash', 'An alternating dot-dot-dash ' +
            'pattern.'
        ),
        new XmlMappedEnumMember(
            'WAVY', 11, 'wave', 'A single wavy line.'
        ),
        new XmlMappedEnumMember(
            'DOTTED_HEAVY', 20, 'dottedHeavy', 'Heavy dots.'
        ),
        new XmlMappedEnumMember(
            'DASH_HEAVY', 23, 'dashedHeavy', 'Heavy dashes.'
        ),
        new XmlMappedEnumMember(
            'DOT_DASH_HEAVY', 25, 'dashDotHeavy', 'Alternating heavy dots ' +
            'and heavy dashes.'
        ),
        new XmlMappedEnumMember(
            'DOT_DOT_DASH_HEAVY', 26, 'dashDotDotHeavy', 'An alternating ' +
            'heavy dot-dot-dash pattern.'
        ),
        new XmlMappedEnumMember(
            'WAVY_HEAVY', 27, 'wavyHeavy', 'A heavy wavy line.'
        ),
        new XmlMappedEnumMember(
            'DASH_LONG', 39, 'dashLong', 'Long dashes.'
        ),
        new XmlMappedEnumMember(
            'WAVY_DOUBLE', 43, 'wavyDouble', 'A double wavy line.'
        ),
        new XmlMappedEnumMember(
            'DASH_LONG_HEAVY', 55, 'dashLongHeavy', 'Long heavy dashes.'
        )]
}
let WD_ALIGN_PARAGRAPH = new WD_PARAGRAPH_ALIGNMENT();
WD_ALIGN_PARAGRAPH.populate_enums();
let WD_COLOR = new WD_COLOR_INDEX();
WD_COLOR.populate_enums();
let WD_LINE_SPACING = new _WD_LINE_SPACING();
WD_LINE_SPACING.populate_enums();
let WD_TAB_ALIGNMENT = new _WD_TAB_ALIGNMENT();
WD_TAB_ALIGNMENT.populate_enums();
let WD_TAB_LEADER = new _WD_TAB_LEADER();
WD_TAB_LEADER.populate_enums();
let WD_UNDERLINE = new _WD_UNDERLINE();
WD_UNDERLINE.populate_enums();

module.exports = {WD_COLOR, WD_UNDERLINE, WD_ALIGN_PARAGRAPH,
    WD_LINE_SPACING, WD_TAB_ALIGNMENT, WD_TAB_LEADER, WD_BREAK:WD_BREAK_TYPE};
