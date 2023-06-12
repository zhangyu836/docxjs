/*
|NumberingPart| and closely related objects
*/
let {XmlPart} = require('../opc/part');
let {NotImplementedError} = require('../exceptions')


class NumberingPart extends XmlPart {
    /*
    Proxy for the numbering.xml part containing numbering definitions for
    a document or glossary.
    */
    static _new() {
        /*
        Return newly created empty numbering part, containing only the root
        ``<w:numbering>`` element.
        */
        throw new NotImplementedError('');
    }
    get numbering_definitions() {
        /*
        The |_NumberingDefinitions| instance containing the numbering
        definitions (<w:num> element proxies) for this numbering part.
        */
        if(!this._numbering_definitions)
            this._numbering_definitions = new _NumberingDefinitions(this.element);
        return this._numbering_definitions;
    }
}

class _NumberingDefinitions  {
    /*
    Collection of |_NumberingDefinition| instances corresponding to the
    ``<w:num>`` elements in a numbering part.
    */
    constructor(numbering_elm) {
        this._numbering = numbering_elm;
    }
    get length() {
        return this._numbering.num_lst.length;
    }
}

module.exports = {_NumberingDefinitions, NumberingPart};
