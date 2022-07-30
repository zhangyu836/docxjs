/*
Provides mappings that embody aspects of the Open XML spec ISO/IEC 29500.
*/
let {CT} = require('./constants');
let default_content_types;
default_content_types = [
    ["bin", CT.PML_PRINTER_SETTINGS],
    ["bin", CT.SML_PRINTER_SETTINGS],
    ["bin", CT.WML_PRINTER_SETTINGS],
    ["bmp", CT.BMP],
    ["emf", CT.X_EMF],
    ["fntdata", CT.X_FONTDATA],
    ["gif", CT.GIF],
    ["jpe", CT.JPEG],
    ["jpeg", CT.JPEG],
    ["jpg", CT.JPEG],
    ["png", CT.PNG],
    ["rels", CT.OPC_RELATIONSHIPS],
    ["tif", CT.TIFF],
    ["tiff", CT.TIFF],
    ["wdp", CT.MS_PHOTO],
    ["wmf", CT.X_WMF],
    ["xlsx", CT.SML_SHEET],
    ["xml", CT.XML]
];
default_content_types.contains = function (tuple) {
    let [_ext, _ct] = tuple;
    for(let [ext,ct] of this){
        if(ext===_ext && ct===_ct){
            return true;
        }
    }
    return false;
}

module.exports = {default_content_types};
