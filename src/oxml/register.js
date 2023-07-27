/*
Initializes oxml sub-package, including registering custom element classes
corresponding to Open XML elements.*/

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
let {register_element_cls} = require('./xmlelemlookup');

/* moved to xmlhandler.js parseFromString
function parse_xml(xml) {
}*/

//function register_element_cls(tag, cls) {
    /*
    Register *cls* to be constructed when the oxml parser encounters an
    element with matching *tag*. *tag* is a string of the form
    ``nspfx:tagroot``, e.g. ``'w:document'``.

}*/
/*moved to xmlhandler.js
function OxmlElement(nsptag_str, attrs = null, nsdecls = null) {
}*/

register_element_cls("w:evenAndOddHeaders", CT_OnOff);
register_element_cls("w:titlePg", CT_OnOff);
register_element_cls("cp:coreProperties", CT_CoreProperties);
register_element_cls("w:body", CT_Body);
register_element_cls("w:document", CT_Document);
register_element_cls("w:abstractNumId", CT_DecimalNumber);
register_element_cls("w:ilvl", CT_DecimalNumber);
register_element_cls("w:lvlOverride", CT_NumLvl);
register_element_cls("w:num", CT_Num);
register_element_cls("w:numId", CT_DecimalNumber);
register_element_cls("w:numPr", CT_NumPr);
register_element_cls("w:numbering", CT_Numbering);
register_element_cls('w:abstractNum', CT_AbstractNum);
register_element_cls('w:lvl', CT_Lvl);
register_element_cls('w:start', CT_String);
register_element_cls('w:numFmt', CT_String);
register_element_cls('w:lvlText', CT_String);
register_element_cls('w:lvlJc', CT_String);
register_element_cls("w:startOverride", CT_DecimalNumber);
register_element_cls("w:footerReference", CT_HdrFtrRef);
register_element_cls("w:ftr", CT_HdrFtr);
register_element_cls("w:hdr", CT_HdrFtr);
register_element_cls("w:headerReference", CT_HdrFtrRef);
register_element_cls("w:pgMar", CT_PageMar);
register_element_cls("w:pgSz", CT_PageSz);
register_element_cls("w:col", CT_Column);
register_element_cls("w:cols", CT_Columns);
register_element_cls("w:sectPr", CT_SectPr);
register_element_cls("w:type", CT_SectType);
register_element_cls("w:settings", CT_Settings);
register_element_cls("a:blip", CT_Blip);
register_element_cls("a:ext", CT_PositiveSize2D);
register_element_cls("a:graphic", CT_GraphicalObject);
register_element_cls("a:graphicData", CT_GraphicalObjectData);
register_element_cls("a:off", CT_Point2D);
register_element_cls("a:xfrm", CT_Transform2D);
register_element_cls("pic:blipFill", CT_BlipFillProperties);
register_element_cls("pic:cNvPr", CT_NonVisualDrawingProps);
register_element_cls("pic:nvPicPr", CT_PictureNonVisual);
register_element_cls("pic:pic", CT_Picture);
register_element_cls("pic:spPr", CT_ShapeProperties);
register_element_cls("wp:docPr", CT_NonVisualDrawingProps);
register_element_cls("wp:extent", CT_PositiveSize2D);
register_element_cls("wp:inline", CT_Inline);
register_element_cls("w:basedOn", CT_String);
register_element_cls("w:latentStyles", CT_LatentStyles);
register_element_cls("w:locked", CT_OnOff);
register_element_cls("w:lsdException", CT_LsdException);
register_element_cls("w:name", CT_String);
register_element_cls("w:next", CT_String);
register_element_cls("w:qFormat", CT_OnOff);
register_element_cls("w:semiHidden", CT_OnOff);
register_element_cls("w:style", CT_Style);
register_element_cls("w:styles", CT_Styles);
register_element_cls("w:docDefaults", CT_DocDefaults);
register_element_cls("w:rPrDefault", CT_RPrDefault);
register_element_cls("w:pPrDefault", CT_PPrDefault);
register_element_cls("w:uiPriority", CT_DecimalNumber);
register_element_cls("w:unhideWhenUsed", CT_OnOff);
register_element_cls("w:bidiVisual",  CT_Bidi);//CT_OnOff);//,
register_element_cls("w:gridCol", CT_TblGridCol);
register_element_cls("w:gridSpan", CT_DecimalNumber);
register_element_cls("w:tbl", CT_Tbl);
register_element_cls("w:tblGrid", CT_TblGrid);
register_element_cls("w:tblLayout", CT_TblLayoutType);
register_element_cls("w:tblPr", CT_TblPr);
register_element_cls("w:tblStyle", CT_String);
register_element_cls("w:tc", CT_Tc);
register_element_cls("w:tcPr", CT_TcPr);
register_element_cls("w:tcW", CT_TblWidth);
register_element_cls("w:tr", CT_Row);
register_element_cls("w:trHeight", CT_Height);
register_element_cls("w:trPr", CT_TrPr);
register_element_cls("w:vAlign", CT_VerticalJc);
register_element_cls("w:vMerge", CT_VMerge);
register_element_cls("w:b", CT_OnOff);
register_element_cls("w:bCs", CT_OnOff);
register_element_cls("w:caps", CT_OnOff);
register_element_cls("w:color", CT_Color);
register_element_cls("w:cs", CT_OnOff);
register_element_cls("w:dstrike", CT_OnOff);
register_element_cls("w:emboss", CT_OnOff);
register_element_cls("w:highlight", CT_Highlight);
register_element_cls("w:i", CT_OnOff);
register_element_cls("w:iCs", CT_OnOff);
register_element_cls("w:imprint", CT_OnOff);
register_element_cls("w:noProof", CT_OnOff);
register_element_cls("w:oMath", CT_OnOff);
register_element_cls("w:outline", CT_OnOff);
register_element_cls("w:rFonts", CT_Fonts);
register_element_cls("w:rPr", CT_RPr);
register_element_cls("w:rStyle", CT_String);
register_element_cls("w:rtl", CT_OnOff);
register_element_cls("w:shadow", CT_OnOff);
register_element_cls("w:smallCaps", CT_OnOff);
register_element_cls("w:snapToGrid", CT_OnOff);
register_element_cls("w:specVanish", CT_OnOff);
register_element_cls("w:strike", CT_OnOff);
register_element_cls("w:sz", CT_HpsMeasure);
register_element_cls("w:u", CT_Underline);
register_element_cls("w:vanish", CT_OnOff);
register_element_cls("w:vertAlign", CT_VerticalAlignRun);
register_element_cls("w:webHidden", CT_OnOff);
register_element_cls("w:p", CT_P);
register_element_cls("w:ind", CT_Ind);
register_element_cls("w:jc", CT_Jc);
register_element_cls("w:keepLines", CT_OnOff);
register_element_cls("w:keepNext", CT_OnOff);
register_element_cls("w:pageBreakBefore", CT_OnOff);
register_element_cls('w:pBdr', CT_Borders);
register_element_cls('w:top', CT_Border);
register_element_cls('w:bottom', CT_Border);
register_element_cls('w:left', CT_Border);
register_element_cls('w:right', CT_Border);
register_element_cls('w:insideH', CT_Border);
register_element_cls('w:insideV', CT_Border);
register_element_cls('w:bdr', CT_Border);
register_element_cls('w:textAlignment', CT_String);
register_element_cls("w:pPr", CT_PPr);
register_element_cls("w:pStyle", CT_String);
register_element_cls("w:spacing", CT_Spacing);
register_element_cls("w:tab", CT_TabStop);
register_element_cls("w:tabs", CT_TabStops);
register_element_cls("w:widowControl", CT_OnOff);
register_element_cls("w:br", CT_Br);
register_element_cls("w:r", CT_R);
register_element_cls("w:hyperlink", CT_Hyperlink);
register_element_cls("w:t", CT_Text);
register_element_cls("default", BaseOxmlElement);

let {CT_Shading, CT_TblStylePr, CT_TblStyleRowBandSize,
    CT_TblStyleColBandSize, CT_TblLook, CT_CellMarSide,
    CT_TblCellMar, CT_TblInd } = require('./extra');

register_element_cls('w:tblBorders', CT_Borders);
register_element_cls('w:tcBorders', CT_Borders);
register_element_cls('w:shd', CT_Shading);
register_element_cls("w:tblStylePr", CT_TblStylePr);
register_element_cls("w:tblStyleRowBandSize", CT_TblStyleRowBandSize);
register_element_cls("w:tblStyleColBandSize", CT_TblStyleColBandSize);
register_element_cls("w:tblLook", CT_TblLook);
register_element_cls('w:top', CT_CellMarSide);
register_element_cls('w:bottom', CT_CellMarSide);
register_element_cls('w:left', CT_CellMarSide);
register_element_cls('w:right', CT_CellMarSide);
register_element_cls('w:bdr', CT_CellMarSide);
register_element_cls("w:tblCellMar", CT_TblCellMar);
register_element_cls("w:tblW", CT_TblWidth);
register_element_cls("w:tblInd", CT_TblInd);

let {CT_Theme, CT_ThemeElements, CT_FontScheme,
    CT_MajorMinorFont, CT_Font} = require('./theme');

register_element_cls("a:theme", CT_Theme);
register_element_cls("a:themeElements", CT_ThemeElements);
register_element_cls("a:fontScheme", CT_FontScheme);
register_element_cls("a:majorFont", CT_MajorMinorFont);
register_element_cls("a:minorFont", CT_MajorMinorFont);
register_element_cls("a:latin", CT_Font);
register_element_cls("a:ea", CT_Font);
register_element_cls("a:cs", CT_Font);
register_element_cls("a:font", CT_Font);

