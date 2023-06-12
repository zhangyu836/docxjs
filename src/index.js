let {Document} = require('./api');
let {Emu, Pt, Inches, Cm, Mm, Twips, Length, RGBColor} = require('./shared');
let {Font} = require('./text/font');
let {Run} = require('./text/run');
let {ParagraphFormat} = require('./text/parfmt');
let {Paragraph} = require('./text/paragraph');
let table = require('./table');
let textEnums = require('./enum/text');
let tableEnums = require('./enum/table');
let styleEnums = require('./enum/style');
let shapeEnums = require('./enum/shape');
let oxml = require('./oxml/index');
module.exports = {
    Document,
    shared: { Emu, Pt, Inches, Cm, Mm, Twips, Length, RGBColor },
    text: { Font, Run, ParagraphFormat, Paragraph },
    enums: {...textEnums, ...tableEnums, ...styleEnums, ...shapeEnums},
    table,
    oxml
}


