/*
Custom element classes related to the styles part
*/
let {WD_STYLE_TYPE} = require('../enum/style');
let {ST_DecimalNumber, ST_OnOff, ST_String} = require('./simpletypes');
let {BaseOxmlElement, OptionalAttribute, RequiredAttribute,
    ZeroOrMore, ZeroOrOne} = require('./xmlchemy');


function styleId_from_name(name) {
    /*
    Return the style id corresponding to *name*, taking into account
    special-case names such as 'Heading 1'.
    */
    let ids = {
        'caption':   'Caption',
        'heading 1': 'Heading1',
        'heading 2': 'Heading2',
        'heading 3': 'Heading3',
        'heading 4': 'Heading4',
        'heading 5': 'Heading5',
        'heading 6': 'Heading6',
        'heading 7': 'Heading7',
        'heading 8': 'Heading8',
        'heading 9': 'Heading9',
    }
    return ids[name] || name.replace(/\n| /g, '');

}
class CT_LatentStyles extends BaseOxmlElement {
    /*
    `w:latentStyles` element, defining behavior defaults for latent styles
    and containing `w:lsdException` child elements that each override those
    defaults for a named latent style.
    */
    lsdException = new ZeroOrMore('w:lsdException');
    count = new OptionalAttribute('w:count', ST_DecimalNumber);
    defLockedState = new OptionalAttribute('w:defLockedState', ST_OnOff);
    defQFormat = new OptionalAttribute('w:defQFormat', ST_OnOff);
    defSemiHidden = new OptionalAttribute('w:defSemiHidden', ST_OnOff);
    defUIPriority = new OptionalAttribute('w:defUIPriority', ST_DecimalNumber);
    defUnhideWhenUsed = new OptionalAttribute('w:defUnhideWhenUsed', ST_OnOff);

    bool_prop(attr_name) {
        /*
        Return the boolean value of the attribute having *attr_name*, or
        |False| if not present.
        */
        let value;
        value = this[attr_name];
        if (value === null) {
            return false;
        }
        return value;
    }
    get_by_name(name) {
        /*
        Return the `w:lsdException` child having *name*, or |None| if not
        found.
        */
        let found;
        found = this.xpath(`w:lsdException[@w:name="${name}"]`);
        if (found.length===0) {
            return null;
        }
        return found[0];
    }
    set_bool_prop(attr_name, value) {
        /*
        Set the on/off attribute having *attr_name* to *value*.
        */
        this[attr_name] = Boolean(value);
    }
}
class CT_LsdException extends BaseOxmlElement {
    /*
    ``<w:lsdException>`` element, defining override visibility behaviors for
    a named latent style.
    */
    locked = new OptionalAttribute('w:locked', ST_OnOff);
    name = new RequiredAttribute('w:name', ST_String);
    qFormat = new OptionalAttribute('w:qFormat', ST_OnOff);
    semiHidden = new OptionalAttribute('w:semiHidden', ST_OnOff);
    uiPriority = new OptionalAttribute('w:uiPriority', ST_DecimalNumber);
    unhideWhenUsed = new OptionalAttribute('w:unhideWhenUsed', ST_OnOff);
    delete() {
        /*
        Remove this `w:lsdException` element from the XML document.
        */
        this.getparent().remove(this);
    }
    on_off_prop(attr_name) {
        /*
        Return the boolean value of the attribute having *attr_name*, or
        |None| if not present.
        */
        return this[attr_name];
    }
    set_on_off_prop(attr_name, value) {
        /*
        Set the on/off attribute having *attr_name* to *value*.
        */
        this[attr_name] = value;
    }
}
let _tag_seq = (
    'w:name', 'w:aliases', 'w:basedOn', 'w:next', 'w:link',
        'w:autoRedefine', 'w:hidden', 'w:uiPriority', 'w:semiHidden',
        'w:unhideWhenUsed', 'w:qFormat', 'w:locked', 'w:personal',
        'w:personalCompose', 'w:personalReply', 'w:rsid', 'w:pPr', 'w:rPr',
        'w:tblPr', 'w:trPr', 'w:tcPr', 'w:tblStylePr'
)
class CT_Style extends BaseOxmlElement {
    /*
    A ``<w:style>`` element, representing a style definition
    */
    name = new ZeroOrOne('w:name', _tag_seq.slice(1));
    basedOn = new ZeroOrOne('w:basedOn', _tag_seq.slice(3));
    next = new ZeroOrOne('w:next', _tag_seq.slice(4));
    uiPriority = new ZeroOrOne('w:uiPriority', _tag_seq.slice(8));
    semiHidden = new ZeroOrOne('w:semiHidden', _tag_seq.slice(9));
    unhideWhenUsed = new ZeroOrOne('w:unhideWhenUsed', _tag_seq.slice(10));
    qFormat = new ZeroOrOne('w:qFormat', _tag_seq.slice(11));
    locked = new ZeroOrOne('w:locked', _tag_seq.slice(12));
    pPr = new ZeroOrOne('w:pPr', _tag_seq.slice(17));
    rPr = new ZeroOrOne('w:rPr', _tag_seq.slice(18));
    tblPr = new ZeroOrOne('w:tblPr', _tag_seq.slice(19));
    trPr = new ZeroOrOne('w:trPr', _tag_seq.slice(20));
    tcPr = new ZeroOrOne('w:tcPr', _tag_seq.slice(21));
    tblStylePr = new ZeroOrMore('w:tblStylePr', _tag_seq.slice(22));
    //del _tag_seq
    type = new OptionalAttribute('w:type', WD_STYLE_TYPE);
    styleId = new OptionalAttribute('w:styleId', ST_String);
    default = new OptionalAttribute('w:default', ST_OnOff);
    customStyle = new OptionalAttribute('w:customStyle', ST_OnOff);

    get basedOn_val() {
        /*
        Value of `w:basedOn/@w:val` or |None| if not present.
        */
        let basedOn;
        basedOn = this.basedOn;
        if (basedOn === null) {
            return null;
        }
        return basedOn.val;
    }
    set basedOn_val(value) {
        if (value === null) {
            this._remove_basedOn();
        } else {
            this.get_or_add_basedOn().val = value;
        }
    }
    get base_style() {
        /*
        Sibling CT_Style element this style is based on or |None| if no base
        style or base style not found.
        */
        let base_style, basedOn, styles;
        basedOn = this.basedOn;
        if (basedOn === null) {
            return null;
        }
        styles = this.getparent();
        base_style = styles.get_by_id(basedOn.val);
        if (base_style === null) {
            return null;
        }
        return base_style;
    }
    delete() {
        /*
        Remove this `w:style` element from its parent `w:styles` element.
        */
        this.getparent().remove(this);
    }
    get locked_val() {
        /*
        Value of `w:locked/@w:val` or |False| if not present.
        */
        let locked;
        locked = this.locked;
        if (locked === null) {
            return false;
        }
        return locked.val;
    }
    set locked_val(value) {
        let locked;
        this._remove_locked();
        if (Boolean(value) === true) {
            locked = this._add_locked();
            locked.val = value;
        }
    }
    get name_val() {
        /*
        Value of ``<w:name>`` child or |None| if not present.
        */
        let name;
        name = this.name;
        if (name === null) {
            return null;
        }
        return name.val;
    }
    set name_val(value) {
        let name;
        this._remove_name();
        if (value!==null) {
            name = this._add_name();
            name.val = value;
        }
    }
    get next_style() {
        /*
        Sibling CT_Style element identified by the value of `w:name/@w:val`
        or |None| if no value is present or no style with that style id
        is found.
        */
        let next, styles;
        next = this.next;
        if (next === null) {
            return null;
        }
        styles = this.getparent();
        return styles.get_by_id(next.val);
    }
    get qFormat_val() {
        /*
        Value of `w:qFormat/@w:val` or |False| if not present.
        */
        let qFormat;
        qFormat = this.qFormat;
        if (qFormat === null) {
            return false;
        }
        return qFormat.val;
    }
    set qFormat_val(value) {
        this._remove_qFormat();
        if (Boolean(value)) {
            this._add_qFormat();
        }
    }
    get semiHidden_val() {
        /*
        Value of ``<w:semiHidden>`` child or |False| if not present.
        */
        let semiHidden;
        semiHidden = this.semiHidden;
        if (semiHidden === null) {
            return false;
        }
        return semiHidden.val;
    }
    set semiHidden_val(value) {
        let semiHidden;
        this._remove_semiHidden();
        if (Boolean(value) === true) {
            semiHidden = this._add_semiHidden();
            semiHidden.val = value;
        }
    }
    get uiPriority_val() {
        /*
        Value of ``<w:uiPriority>`` child or |None| if not present.
        */
        let uiPriority;
        uiPriority = this.uiPriority;
        if (uiPriority === null) {
            return null;
        }
        return uiPriority.val;
    }
    set uiPriority_val(value) {
        let uiPriority;
        this._remove_uiPriority();
        if (value !== null) {
            uiPriority = this._add_uiPriority();
            uiPriority.val = value;
        }
    }
    get unhideWhenUsed_val() {
        /*
        Value of `w:unhideWhenUsed/@w:val` or |False| if not present.
        */
        let unhideWhenUsed;
        unhideWhenUsed = this.unhideWhenUsed;
        if (unhideWhenUsed === null) {
            return false;
        }
        return unhideWhenUsed.val;
    }
    set unhideWhenUsed_val(value) {
        let unhideWhenUsed;
        this._remove_unhideWhenUsed();
        if (Boolean(value) === true) {
            unhideWhenUsed = this._add_unhideWhenUsed();
            unhideWhenUsed.val = value;
        }
    }
}
let _tag_seq2 = ['w:docDefaults', 'w:latentStyles', 'w:style'];
class CT_Styles extends BaseOxmlElement {
    /*
    ``<w:styles>`` element, the root element of a styles part, i.e.
    styles.xml
    del _tag_seq
    */
    docDefaults = new ZeroOrOne('w:docDefaults', _tag_seq2.slice(1));
    latentStyles = new ZeroOrOne('w:latentStyles', _tag_seq2.slice(2));
    style = new ZeroOrMore('w:style', );

    add_style_of_type(name, style_type, builtin) {
        /*
        Return a newly added `w:style` element having *name* and
        *style_type*. `w:style/@customStyle` is set based on the value of
        *builtin*.
        */
        let style;
        style = this.add_style();
        style.type = style_type;
        style.customStyle = builtin ? null : true;
        style.styleId = styleId_from_name(name);
        style.name_val = name;
        return style;
    }
    default_for(style_type) {
        /*
        Return `w:style[@w:type="*{style_type}*][-1]` or |None| if not found.
        */
        let default_styles_for_type = [];
        for(let s of this._iter_styles()){
            if( s.type === style_type && s.default)
                default_styles_for_type.push(s);
        }
        if (!default_styles_for_type.length>0) {
            return null;
        }
        // spec calls for last default in document order
        return default_styles_for_type.slice(-1)[0];
    }
    get_by_id(styleId) {
        /*
        Return the ``<w:style>`` child element having ``styleId`` attribute
        matching *styleId*, or |None| if not found.
        */
        let xpath;
        xpath = `w:style[@w:styleId="${styleId}"]`;
        let a = this.xpath(xpath);
        return a.length>0? a[0] : null;
    }
    get_by_name(name) {
        /*
        Return the ``<w:style>`` child element having ``<w:name>`` child
        element with value *name*, or |None| if not found.
        */
        let xpath;
        xpath = `w:style[w:name/@w:val="${name}"]`;
        let a = this.xpath(xpath);
        return a.length>0? a[0] : null;
    }
    _iter_styles() {
        /*
        Generate each of the `w:style` child elements in document order.
        */
        return this.xpath('w:style');
        //let styles = []
        //for(let style of this.xpath('w:style')){
        //    styles.push(style);
        //}
        //return styles;
    }
}
class CT_DocDefaults extends BaseOxmlElement {
    pPrDefault = new ZeroOrOne('w:pPrDefault');
    rPrDefault = new ZeroOrOne('w:rPrDefault');
}
class CT_PPrDefault extends BaseOxmlElement {
    pPr = new ZeroOrOne('w:pPr');
}
class CT_RPrDefault extends BaseOxmlElement {
    rPr = new ZeroOrOne('w:rPr');
}

module.exports = {CT_LatentStyles, CT_LsdException, CT_Style, CT_Styles,
    CT_DocDefaults, CT_PPrDefault, CT_RPrDefault};
