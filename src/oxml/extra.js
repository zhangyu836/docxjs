let {CT_Border, CT_Borders} = require('./text/parfmt');
let {BaseOxmlElement, RequiredAttribute,
    ZeroOrOne, OptionalAttribute} = require('./xmlchemy');
let {ST_HexColor, ST_String, XsdInt,
    ST_OnOff, ST_TwipsMeasure } = require('./simpletypes');

class CT_TblStylePr extends BaseOxmlElement {
    pPr = new ZeroOrOne('w:pPr');
    rPr = new ZeroOrOne('w:rPr');
    tblPr = new ZeroOrOne('w:tblPr');
    trPr = new ZeroOrOne('w:trPr');
    tcPr = new ZeroOrOne('w:tcPr');
    type = new RequiredAttribute('w:type', ST_String);
}
class CT_TblStyleRowBandSize extends BaseOxmlElement {
    val = new RequiredAttribute('w:val', XsdInt);
}
class CT_TblStyleColBandSize extends BaseOxmlElement {
    val = new RequiredAttribute('w:val', XsdInt);
}
class CT_TblLook extends BaseOxmlElement {
    val = new OptionalAttribute('w:val', ST_String);//hex
    firstRow = new OptionalAttribute('w:firstRow', ST_OnOff);
    lastRow = new OptionalAttribute('w:lastRow', ST_OnOff);
    firstColumn = new OptionalAttribute('w:firstColumn', ST_OnOff);
    lastColumn = new OptionalAttribute('w:lastColumn', ST_OnOff);
    noHBand = new OptionalAttribute('w:noHBand', ST_OnOff);
    noVBand = new OptionalAttribute('w:noVBand', ST_OnOff);
}
class CT_Shading extends BaseOxmlElement {
    val = new RequiredAttribute('w:val', ST_String);
    color = new RequiredAttribute('w:color', ST_HexColor);
    fill = new RequiredAttribute('w:fill', ST_HexColor);
}
class CT_CellMarSide extends CT_Border {
    w = new OptionalAttribute('w:w', ST_TwipsMeasure); // in 1/12 of a point
    type = new OptionalAttribute('w:type', ST_String);
}
class CT_TblCellMar extends CT_Borders {
}

class CT_TblInd extends BaseOxmlElement {
    w = new OptionalAttribute('w:w', ST_TwipsMeasure);
    type = new OptionalAttribute('w:type', ST_String);
}

module.exports = {CT_Shading, CT_TblStylePr,
    CT_TblStyleRowBandSize, CT_TblStyleColBandSize, CT_TblLook,
    CT_CellMarSide, CT_TblCellMar, CT_TblInd }
