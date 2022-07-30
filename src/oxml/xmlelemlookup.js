
class ElementLookup {
    constructor() {
        this.clsMap = new Map();
        this.prototypeMap = new Map();
        this.defaultPrototype = null;
    }
    getPrototype(tagName) {
        let proto = this.prototypeMap.get(tagName);
        if(!proto){
            let cls = this.clsMap.get(tagName);
            if (!cls){
                proto = this.defaultPrototype;
            } else {
                proto = new cls();
                proto.populate_methods();
            }
            this.prototypeMap[tagName] = proto;
        }
        return proto;
    }
    getHandler(tagName, xmlElement) {
        let proto = this.getPrototype(tagName);
        let handler = Object.create(proto);
        handler.xmlElement = xmlElement;
        return handler;
    }
    bind(tagName, xmlElement) {
        // cache
        return this.getHandler(tagName, xmlElement);
    }
    register(tagName, cls) {
        this.clsMap.set(tagName, cls);
        if (tagName==='default') {
            this.defaultPrototype = new cls();
            this.defaultPrototype.populate_methods();
            this.prototypeMap['default'] = this.defaultPrototype;
        }
    }
}

let elementLookup = new ElementLookup();
function register_element_cls(tagName, cls){
    elementLookup.register(tagName, cls);
}
function bindElement(xmlElement) {
    if (!xmlElement || !xmlElement.tagName) return xmlElement;
    let tagName = xmlElement.tagName;
    return elementLookup.bind(tagName, xmlElement);
}
module.exports = {elementLookup, register_element_cls, bindElement};
