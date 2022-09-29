
let {BaseOxmlElement, ZeroOrMore, RequiredAttribute} = require('../xmlchemy');
let {ST_RelationshipId} = require('../simpletypes');


class CT_Hyperlink extends BaseOxmlElement {
    rId = new RequiredAttribute("r:id", ST_RelationshipId);
    r = new ZeroOrMore("w:r");
}


module.exports = {CT_Hyperlink};
