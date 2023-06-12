let {BaseOxmlElement} = require('./xmlchemy');
let {CT_DecimalNumber, CT_OnOff, CT_String} = require('./shared');
let {CT_CoreProperties} = require('./coreprops');
let {CT_Body, CT_Document} = require('./document');
let {CT_Num, CT_NumLvl, CT_NumPr, CT_Numbering, CT_AbstractNum, CT_Lvl} = require('./numbering');
let {CT_HdrFtr, CT_HdrFtrRef, CT_PageMar, CT_PageSz, CT_SectPr, CT_SectType,
    CT_Column, CT_Columns} = require('./section');
let {CT_Settings} = require('./settings');
let {CT_Blip, CT_BlipFillProperties, CT_GraphicalObject, CT_GraphicalObjectData,
    CT_Inline, CT_NonVisualDrawingProps, CT_Picture, CT_PictureNonVisual, CT_Point2D,
    CT_PositiveSize2D, CT_ShapeProperties, CT_Transform2D} = require('./shape');
let {CT_LatentStyles, CT_LsdException, CT_Style, CT_Styles,
    CT_DocDefaults, CT_PPrDefault, CT_RPrDefault} = require('./styles');
let {CT_Height, CT_Row, CT_Tbl, CT_TblGrid, CT_TblGridCol, CT_TblLayoutType,
    CT_TblPr, CT_TblWidth, CT_Tc, CT_TcPr, CT_TrPr, CT_VMerge, CT_VerticalJc,
    CT_Bidi} = require('./table');
let {CT_Color, CT_Fonts, CT_Highlight, CT_HpsMeasure, CT_RPr, CT_Underline,
    CT_VerticalAlignRun} = require('./text/font');
let {CT_P} = require('./text/paragraph');
let {CT_Ind, CT_Jc, CT_PPr, CT_Spacing, CT_TabStop, CT_TabStops,
    CT_Borders, CT_Border} = require('./text/parfmt');
let {CT_Br, CT_R, CT_Text} = require('./text/run');
let {CT_Hyperlink} = require('./text/hyperlink');
let {CT_Shading, CT_TblStylePr, CT_TblStyleRowBandSize,
    CT_TblStyleColBandSize, CT_TblLook, CT_CellMarSide,
    CT_TblCellMar, CT_TblInd } = require('./extra');
let {register_element_cls} = require('./xmlelemlookup');

module.exports = {
    BaseOxmlElement,
    CT_DecimalNumber, CT_OnOff, CT_String,
    CT_CoreProperties,
    CT_Body, CT_Document,
    CT_Num, CT_NumLvl, CT_NumPr, CT_Numbering, CT_AbstractNum, CT_Lvl,
    CT_HdrFtr, CT_HdrFtrRef, CT_PageMar, CT_PageSz,
    CT_SectPr, CT_SectType, CT_Column, CT_Columns,
    CT_Settings,
    CT_Blip, CT_BlipFillProperties, CT_GraphicalObject, CT_GraphicalObjectData,
    CT_Inline, CT_NonVisualDrawingProps, CT_Picture, CT_PictureNonVisual,
    CT_Point2D, CT_PositiveSize2D, CT_ShapeProperties, CT_Transform2D,
    CT_LatentStyles, CT_LsdException, CT_Style, CT_Styles,
    CT_DocDefaults, CT_PPrDefault, CT_RPrDefault,
    CT_Height, CT_Row, CT_Tbl, CT_TblGrid, CT_TblGridCol, CT_TblLayoutType,
    CT_TblPr, CT_TblWidth, CT_Tc, CT_TcPr, CT_TrPr, CT_VMerge, CT_VerticalJc,
    CT_Bidi,
    CT_Color, CT_Fonts, CT_Highlight, CT_HpsMeasure, CT_RPr, CT_Underline,
    CT_VerticalAlignRun, CT_P,
    CT_Ind, CT_Jc, CT_PPr, CT_Spacing, CT_TabStop, CT_TabStops,
    CT_Borders, CT_Border,
    CT_Br, CT_R, CT_Text,
    CT_Hyperlink,
    CT_Shading, CT_TblStylePr, CT_TblStyleRowBandSize,
    CT_TblStyleColBandSize, CT_TblLook, CT_CellMarSide,
    CT_TblCellMar, CT_TblInd, register_element_cls
}
