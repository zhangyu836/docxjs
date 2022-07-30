
/*
Enumerations related to tables in WordprocessingML files
*/
let {EnumMember, Enumeration, XmlEnumeration, XmlMappedEnumMember} = require('./base');


class WD_CELL_VERTICAL_ALIGNMENT extends XmlEnumeration {
    /*
    alias: **WD_ALIGN_VERTICAL**

    Specifies the vertical alignment of text in one or more cells of a table.

    Example::

        from docx.enum.table import WD_ALIGN_VERTICAL

        table = document.add_table(3, 3)
        table.cell(0, 0).vertical_alignment = WD_ALIGN_VERTICAL.BOTTOM
    */
    __ms_name__ = 'WdCellVerticalAlignment'

    __url__ = 'https://msdn.microsoft.com/en-us/library/office/ff193345.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            'TOP', 0, 'top', 'Text is aligned to the top border of the cell.'
        ),
        new XmlMappedEnumMember(
            'CENTER', 1, 'center', 'Text is aligned to the center of the cell.'
        ),
        new XmlMappedEnumMember(
            'BOTTOM', 3, 'bottom', 'Text is aligned to the bottom border of' +
            ' the cell.'
        ),
        new XmlMappedEnumMember(
            'BOTH', 101, 'both', 'This is an option in the OpenXml spec, but' +
            ' not in Word itself. It\'s not clear what Word behavior this ' +
            'setting produces. If you find out please let us know and we\'ll ' +
            'update this documentation. Otherwise, probably best to avoid this option.'
        )]
}


class WD_ROW_HEIGHT_RULE extends XmlEnumeration {
    /*
    alias: **WD_ROW_HEIGHT**

    Specifies the rule for determining the height of a table row

    Example::

        from docx.enum.table import WD_ROW_HEIGHT_RULE

        table = document.add_table(3, 3)
        table.rows[0].height_rule = WD_ROW_HEIGHT_RULE.EXACTLY
    */
    __ms_name__ = "WdRowHeightRule"

    __url__ = 'https://msdn.microsoft.com/en-us/library/office/ff193620.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            'AUTO', 0, 'auto', 'The row height is adjusted to accommodate ' +
            'the tallest value in the row.'
        ),
        new XmlMappedEnumMember(
            'AT_LEAST', 1, 'atLeast', 'The row height is at least a minimum ' +
            'specified value.'
        ),
        new XmlMappedEnumMember(
            'EXACTLY', 2, 'exact', 'The row height is an exact value.'
        )]
}


class _WD_TABLE_ALIGNMENT extends XmlEnumeration {
    /*
    Specifies table justification type.

    Example::

        from docx.enum.table import WD_TABLE_ALIGNMENT

        table = document.add_table(3, 3)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
    */
    __ms_name__ = 'WdRowAlignment'

    __url__ = ' http://office.microsoft.com/en-us/word-help/HV080607259.aspx'

    __members__ = [
        new XmlMappedEnumMember(
            'LEFT', 0, 'left', 'Left-aligned'
        ),
        new XmlMappedEnumMember(
            'CENTER', 1, 'center', 'Center-aligned.'
        ),
        new XmlMappedEnumMember(
            'RIGHT', 2, 'right', 'Right-aligned.'
        )]
}
class _WD_TABLE_DIRECTION extends Enumeration {
    /*
    Specifies the direction in which an application orders cells in the
    specified table or row.

    Example::

        from docx.enum.table import WD_TABLE_DIRECTION

        table = document.add_table(3, 3)
        table.direction = WD_TABLE_DIRECTION.RTL
    */
    __ms_name__ = 'WdTableDirection'

    __url__ = ' http://msdn.microsoft.com/en-us/library/ff835141.aspx'

    __members__ = [
        new EnumMember(
            'LTR', 0, 'The table or row is arranged with the first column ' +
            'in the leftmost position.'
        ),
        new EnumMember(
            'RTL', 1, 'The table or row is arranged with the first column ' +
            'in the rightmost position.'
        )]
}
let WD_ALIGN_VERTICAL = new WD_CELL_VERTICAL_ALIGNMENT();
WD_ALIGN_VERTICAL.populate_enums();
let WD_ROW_HEIGHT = new WD_ROW_HEIGHT_RULE();
WD_ROW_HEIGHT.populate_enums();
let WD_TABLE_ALIGNMENT = new _WD_TABLE_ALIGNMENT();
WD_TABLE_ALIGNMENT.populate_enums();
let WD_TABLE_DIRECTION = new _WD_TABLE_DIRECTION();
WD_TABLE_DIRECTION.populate_enums();

module.exports = {WD_CELL_VERTICAL_ALIGNMENT:WD_ALIGN_VERTICAL,
    WD_ROW_HEIGHT_RULE:WD_ROW_HEIGHT,
    WD_TABLE_ALIGNMENT, WD_TABLE_DIRECTION, WD_ALIGN_VERTICAL, WD_ROW_HEIGHT };
