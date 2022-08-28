
/*
Custom element classes related to the numbering part
*/
let {CT_DecimalNumber} = require('./shared');
let {ST_DecimalNumber, ST_String} = require('./simpletypes');
let {BaseOxmlElement, OneAndOnlyOne, RequiredAttribute,
    ZeroOrMore, ZeroOrOne, OxmlElement} = require('./xmlchemy');
let {KeyError} = require('../exceptions');


class CT_Num extends BaseOxmlElement {
    /*
    ``<w:num>`` element, which represents a concrete list definition
    instance, having a required child <w:abstractNumId> that references an
    abstract numbering definition that defines most of the formatting details.
    */
    abstractNumId = new OneAndOnlyOne('w:abstractNumId');
    lvlOverride = new ZeroOrMore('w:lvlOverride');
    numId = new RequiredAttribute('w:numId', ST_DecimalNumber);

    add_lvlOverride(ilvl) {
        /*
        Return a newly added CT_NumLvl (<w:lvlOverride>) element having its
        ``ilvl`` attribute set to *ilvl*.
        */
        return this._add_lvlOverride({ilvl});
    }
    _new(num_id, abstractNum_id) {
        /*
        Return a new ``<w:num>`` element having numId of *num_id* and having
        a ``<w:abstractNumId>`` child with val attribute set to
        *abstractNum_id*.
        */
        let abstractNumId, num;
        num = OxmlElement("w:num");
        num.numId = num_id;
        abstractNumId = CT_DecimalNumber._new("w:abstractNumId", abstractNum_id);
        num.append(abstractNumId);
        return num;
    }
}

class CT_NumLvl extends BaseOxmlElement {
    /*
    ``<w:lvlOverride>`` element, which identifies a level in a list
    definition to override with settings it contains.
    */
    startOverride = new ZeroOrOne('w:startOverride', ['w:lvl']);
    ilvl = new RequiredAttribute('w:ilvl', ST_DecimalNumber);

    add_startOverride(val) {
        /*
        Return a newly added CT_DecimalNumber element having tagname
        ``w:startOverride`` and ``val`` attribute set to *val*.
        */
        return this._add_startOverride({val});
    }
}

class CT_NumPr extends BaseOxmlElement {
    /*
    A ``<w:numPr>`` element, a container for numbering properties applied to
    a paragraph.
    */
    ilvl = new ZeroOrOne('w:ilvl', ['w:numId', 'w:numberingChange', 'w:ins']);
    numId = new ZeroOrOne('w:numId', ['w:numberingChange', 'w:ins']);
}

class CT_Numbering extends BaseOxmlElement {
    /*
    ``<w:numbering>`` element, the root element of a numbering part, i.e.
    numbering.xml
    */
    num = new ZeroOrMore('w:num', ['w:numIdMacAtCleanup']);

    add_num(abstractNum_id) {
        /*
        Return a newly added CT_Num (<w:num>) element referencing the
        abstract numbering definition identified by *abstractNum_id*.
        */
        let next_num_id, num;
        next_num_id = this._next_numId;
        num = CT_Num._new(next_num_id, abstractNum_id);
        return this._insert_num(num);
    }
    num_having_numId(numId) {
        /*
        Return the ``<w:num>`` child element having ``numId`` attribute
        matching *numId*.
        */
        let xpath;
        xpath = `./w:num[@w:numId="${numId}"]`;
        let num_ids = this.xpath(xpath);
        if(num_ids.length>0) return num_ids[0];
        throw new KeyError(`no <w:num> element with numId ${numId}`);
    }
    get _next_numId() {
        /*
        The first ``numId`` unused by a ``<w:num>`` element, starting at
        1 and filling any gaps in numbering between existing ``<w:num>``
        elements.
        */
        let numId_strs = this.xpath("./w:num/@w:numId");
        let num_ids = [];
        for (let numId_str of numId_strs) {
            num_ids.push(parseInt(numId_str.value));
        }
        let num;
        for( num = 1; num < num_ids.length + 2; num++){
            if (!num_ids.includes(num))  break;
        }
        return num;
    }
}

class CT_AbstractNum extends BaseOxmlElement {
    lvl = new ZeroOrOne('w:lvl');
    abstractNumId = new RequiredAttribute('w:abstractNumId', ST_String);
}
class CT_Lvl extends BaseOxmlElement {
    ilvl = new RequiredAttribute('w:ilvl', ST_DecimalNumber);
    start = new ZeroOrOne('w:start');
    numFmt = new ZeroOrOne('w:numFmt');
    pStyle = new ZeroOrOne('w:pStyle');
    lvlText = new ZeroOrOne('w:lvlText');
    lvlJc = new ZeroOrOne('w:lvlJc');
    pPr = new ZeroOrOne('w:pPr');
}

module.exports = {CT_Num, CT_NumLvl, CT_NumPr, CT_Numbering,
    CT_AbstractNum, CT_Lvl};
