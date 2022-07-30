/*
Latent style-related objects.
*/
let BabelFish = require('./babelfish');
let {ElementProxy} = require('../shared');
let {KeyError} = require('../exceptions')


class LatentStyles extends ElementProxy {
    /*
    Provides access to the default behaviors for latent styles in this
    document and to the collection of |_LatentStyle| objects that define
    overrides of those defaults for a particular named latent style.
    */
    constructor(element, parent) {
        super(element, parent);
        this[Symbol.iterator] = this.iter;
    }
    getitem(key) {
        /*
        Enables dictionary-style access to a latent style by name.
        */
        let lsdException, style_name;
        style_name = BabelFish.ui2internal(key);
        lsdException = this._element.get_by_name(style_name);
        if (lsdException === null) {
            throw new KeyError(`no latent style with name '${key}'`);
        }
        return new _LatentStyle(lsdException);
    }
    *iter() {
        for(let ls of this._element.lsdException_lst){
            yield new _LatentStyle(ls);
        }
    }
    get length() {
        return this._element.lsdException_lst.length;
    }
    add_latent_style(name) {
        /*
        Return a newly added |_LatentStyle| object to override the inherited
        defaults defined in this latent styles object for the built-in style
        having *name*.
        */
        let lsdException;
        lsdException = this._element.add_lsdException();
        lsdException.name = BabelFish.ui2internal(name);
        return new _LatentStyle(lsdException);
    }
    get default_priority() {
        /*
        Integer between 0 and 99 inclusive specifying the default sort order
        for latent styles in style lists and the style gallery. |None| if no
        value is assigned, which causes Word to use the default value 99.
        */
        return this._element.defUIPriority;
    }
    set default_priority(value) {
        this._element.defUIPriority = value;
    }
    get default_to_hidden() {
        /*
        Boolean specifying whether the default behavior for latent styles is
        to be hidden. A hidden style does not appear in the recommended list
        or in the style gallery.
        */
        return this._element.bool_prop("defSemiHidden");
    }
    set default_to_hidden(value) {
        this._element.set_bool_prop("defSemiHidden", value);
    }
    get default_to_locked() {
        /*
        Boolean specifying whether the default behavior for latent styles is
        to be locked. A locked style does not appear in the styles panel or
        the style gallery and cannot be applied to document content. This
        behavior is only active when formatting protection is turned on for
        the document (via the Developer menu).
        */
        return this._element.bool_prop("defLockedState");
    }
    set default_to_locked(value) {
        this._element.set_bool_prop("defLockedState", value);
    }
    get default_to_quick_style() {
        /*
        Boolean specifying whether the default behavior for latent styles is
        to appear in the style gallery when not hidden.
        */
        return this._element.bool_prop("defQFormat");
    }
    set default_to_quick_style(value) {
        this._element.set_bool_prop("defQFormat", value);
    }
    get default_to_unhide_when_used() {
        /*
        Boolean specifying whether the default behavior for latent styles is
        to be unhidden when first applied to content.
        */
        return this._element.bool_prop("defUnhideWhenUsed");
    }
    set default_to_unhide_when_used(value) {
        this._element.set_bool_prop("defUnhideWhenUsed", value);
    }
    get load_count() {
        /*
        Integer specifying the number of built-in styles to initialize to the
        defaults specified in this |LatentStyles| object. |None| if there is
        no setting in the XML (very uncommon). The default Word 2011 template
        sets this value to 276, accounting for the built-in styles in Word
        2010.
        */
        return this._element.count;
    }
    set load_count(value) {
        this._element.count = value;
    }
}

class _LatentStyle extends ElementProxy {
    /*
    Proxy for an `w:lsdException` element, which specifies display behaviors
    for a built-in style when no definition for that style is stored yet in
    the `styles.xml` part. The values in this element override the defaults
    specified in the parent `w:latentStyles` element.
    */
    delete() {
        /*
        Remove this latent style definition such that the defaults defined in
        the containing |LatentStyles| object provide the effective value for
        each of its attributes. Attempting to access any attributes on this
        object after calling this method will raise |AttributeError|.
        */
        this._element.delete();
        this._element = null;
    }
    get hidden() {
        /*
        Tri-state value specifying whether this latent style should appear in
        the recommended list. |None| indicates the effective value is
        inherited from the parent ``<w:latentStyles>`` element.
        */
        return this._element.on_off_prop("semiHidden");
    }
    set hidden(value) {
        this._element.set_on_off_prop("semiHidden", value);
    }
    get locked() {
        /*
        Tri-state value specifying whether this latent styles is locked.
        A locked style does not appear in the styles panel or the style
        gallery and cannot be applied to document content. This behavior is
        only active when formatting protection is turned on for the document
        (via the Developer menu).
        */
        return this._element.on_off_prop("locked");
    }
    set locked(value) {
        this._element.set_on_off_prop("locked", value);
    }
    get name() {
        /*
        The name of the built-in style this exception applies to.
        */
        return BabelFish.internal2ui(this._element.name);
    }
    get priority() {
        /*
        The integer sort key for this latent style in the Word UI.
        */
        return this._element.uiPriority;
    }
    set priority(value) {
        this._element.uiPriority = value;
    }
    get quick_style() {
        /*
        Tri-state value specifying whether this latent style should appear in
        the Word styles gallery when not hidden. |None| indicates the
        effective value should be inherited from the default values in its
        parent |LatentStyles| object.
        */
        return this._element.on_off_prop("qFormat");
    }
    set quick_style(value) {
        this._element.set_on_off_prop("qFormat", value);
    }
    get unhide_when_used() {
        /*
        Tri-state value specifying whether this style should have its
        :attr:`hidden` attribute set |False| the next time the style is
        applied to content. |None| indicates the effective value should be
        inherited from the default specified by its parent |LatentStyles|
        object.
        */
        return this._element.on_off_prop("unhideWhenUsed");
    }
    set unhide_when_used(value) {
        this._element.set_on_off_prop("unhideWhenUsed", value);
    }
}


module.exports = {LatentStyles, _LatentStyle}
