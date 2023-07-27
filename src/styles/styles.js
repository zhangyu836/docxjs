
/* Styles object, container for all objects in the styles part */
let {ElementProxy} = require('../shared');
let BabelFish = require('./babelfish');
let {LatentStyles} = require('./latent');
let {BaseStyle, StyleFactory} = require('./style');
let {KeyError, ValueError} = require('../exceptions');
let {Font} = require('../text/font');
let {ParagraphFormat} = require('../text/parfmt');


class Styles extends ElementProxy {
    /*Provides access to the styles defined in a document.

    Accessed using the :attr:`.Document.styles` property. Supports ``len()``, iteration,
    and dictionary-style access by style name.
    */
    constructor(element, parent) {
        super(element, parent);
        this[Symbol.iterator] = this.iter;
    }
    contains(name) {
        /*
        Enables `in` operator on style name.
        */
        let internal_name;
        internal_name = BabelFish.ui2internal(name);
        for (let style of this._element.style_lst) {
            if (style.name_val === internal_name) {
                return true;
            }
        }
        return false;
    }
    getitem(key) {
        /*
        Enables dictionary-style access by UI name. Lookup by style id is
        deprecated, triggers a warning, and will be removed in a near-future
        release.
        */
        let msg, style_elm;
        style_elm = this._element.get_by_name(BabelFish.ui2internal(key));
        if (style_elm !== null) {
            return StyleFactory(style_elm);
        }
        style_elm = this._element.get_by_id(key);
        if (style_elm !== null) {
            msg = "style lookup by style_id is deprecated. Use style name as key instead.";
            console.warn(msg);
            return StyleFactory(style_elm);
        }
        throw new KeyError(`no style with name '${key}'`);
    }
    *iter() {
        for(let style of this._element.style_iter){
            yield StyleFactory(style);
        }
    }
    get length() {
        return this._element.style_lst.length;
    }
    add_style(name, style_type, builtin = false) {
        /*
        Return a newly added style object of *style_type* and identified
        by *name*. A builtin style can be defined by passing True for the
        optional *builtin* argument.
        */
        let style, style_name;
        style_name = BabelFish.ui2internal(name);
        if (this.contains(style_name)) {
            throw new ValueError(`document already contains style '${name}'`);
        }
        style = this._element.add_style_of_type(style_name, style_type, builtin);
        return StyleFactory(style);
    }
    _default(style_type) {
        /*
        Return the default style for *style_type* or |None| if no default is
        defined for that type (not common).
        */
        let style;
        style = this._element.default_for(style_type);
        if (style === null) {
            return null;
        }
        return StyleFactory(style);
    }
    get_by_id(style_id, style_type) {
        /*Return the style of *style_type* matching *style_id*.

        Returns the default for *style_type* if *style_id* is not found or is |None|, or
        if the style having *style_id* is not of *style_type*.
        */
        if (style_id === null) {
            return this._default(style_type);
        }
        return this._get_by_id(style_id, style_type);
    }
    get_style_id(style_or_name, style_type) {
        /*
        Return the id of the style corresponding to *style_or_name*, or
        |None| if *style_or_name* is |None|. If *style_or_name* is not
        a style object, the style is looked up using *style_or_name* as
        a style name, raising |ValueError| if no style with that name is
        defined. Raises |ValueError| if the target style is not of
        *style_type*.
        */
        if (style_or_name === null) {
            return null;
        } else {
            if (style_or_name instanceof BaseStyle) {
                return this._get_style_id_from_style(style_or_name, style_type);
            } else {
                return this._get_style_id_from_name(style_or_name, style_type);
            }
        }
    }
    get latent_styles() {
        /*
        A |LatentStyles| object providing access to the default behaviors for
        latent styles and the collection of |_LatentStyle| objects that
        define overrides of those defaults for a particular named latent
        style.
        */
        return new LatentStyles(this._element.get_or_add_latentStyles());
    }
    _get_by_id(style_id, style_type) {
        /*
        Return the style of *style_type* matching *style_id*. Returns the
        default for *style_type* if *style_id* is not found or if the style
        having *style_id* is not of *style_type*.
        */
        let style;
        style = this._element.get_by_id(style_id);
        if ((style === null) || (style.type !== style_type)) {
            return this._default(style_type);
        }
        return StyleFactory(style);
    }
    _get_style_id_from_name(style_name, style_type) {
        /*
        Return the id of the style of *style_type* corresponding to
        *style_name*. Returns |None| if that style is the default style for
        *style_type*. Raises |ValueError| if the named style is not found in
        the document or does not match *style_type*.
        */
        return this._get_style_id_from_style(this.getitem(style_name), style_type);
    }
    _get_style_id_from_style(style, style_type) {
        /*
        Return the id of *style*, or |None| if it is the default style of
        *style_type*. Raises |ValueError| if style is not of *style_type*.
        */
        if (style.type !== style_type) {
            throw new ValueError(`assigned style is type ${style.type}, need type ${style_type}`);
        }
        if (style === this._default(style_type)) {
            return null;
        }
        return style.style_id;
    }
    default_format() {
        let docDefaults = this._element.docDefaults;
        if(docDefaults){
            let pPrDefault = docDefaults.pPrDefault;
            if(pPrDefault) return new ParagraphFormat(pPrDefault);
        }
        return null;
    }
    default_font() {
        let docDefaults = this._element.docDefaults
        if(docDefaults){
            let rPrDefault = docDefaults.rPrDefault;
            if(rPrDefault) return new Font(rPrDefault);
        }
        return null;
    }
}


module.exports = {Styles};
