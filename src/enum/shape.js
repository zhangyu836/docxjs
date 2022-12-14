/*
Enumerations related to DrawingML shapes in WordprocessingML files
*/
let WD_INLINE_SHAPE_TYPE = {
    /*
    Corresponds to WdInlineShapeType enumeration
    http://msdn.microsoft.com/en-us/library/office/ff192587.aspx
    */
    CHART : 12,
    LINKED_PICTURE : 4,
    PICTURE : 3,
    SMART_ART : 15,
    NOT_IMPLEMENTED : -6
}


module.exports = {WD_INLINE_SHAPE:WD_INLINE_SHAPE_TYPE};
