let {DOMParser, XMLSerializer, DOMImplementation} = require("@xmldom/xmldom");
let {nsUri} = require("./ns");
let {bindElement} = require('./xmlelemlookup');

let domParser = new DOMParser();
function parseFromString(xml, mimeType="application/xml"){
    let elem = domParser.parseFromString(xml, mimeType);
    for (let i = 0, l = elem.childNodes.length; i < l; i++) {
        let child = elem.childNodes.item(i);
        if (child.nodeType === 1){
            return child;
        }
    }
}
function parse_xml(xml){
    let elem = parseFromString(xml);
    return bindElement(elem);
}
let xmlSerializer = new XMLSerializer();
function serializeToString(dom){
    return xmlSerializer.serializeToString(dom);
}
let domImplementation = new DOMImplementation();
let doc = domImplementation.createDocument();
function createElement(tagName, raw=false){
    let uri = nsUri(tagName);
    let elem = doc.createElementNS(uri, tagName);
    if(!raw) {
        return bindElement(elem);
    }
    return elem;
}
function findChildElement(elem, tagName, raw=false) {
    for (let i = 0, l = elem.childNodes.length; i < l; i++) {
        let child = elem.childNodes.item(i);
        if (child.nodeType === 1 && child.tagName === tagName){
            if(!raw) {
                return bindElement(child);
            }
            return child;
        }
    }
    return null;
}

module.exports = {parseFromString, parse_xml, serializeToString,
    createElement, findChildElement}
