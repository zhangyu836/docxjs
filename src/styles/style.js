
/*
Style object hierarchy.
*/
let BabelFish = require('./babelfish');
let {WD_STYLE_TYPE} = require('../enum/style');
let {ElementProxy} = require('../shared');
let {Font} = require('../text/font');
let {ParagraphFormat} = require('../text/parfmt');


function StyleFactory(style_elm) {
    /*
    Return a style object of the appropriate |BaseStyle| subclass, according
    to the type of *style_elm*.
    */
    let style_cls = style_cls_map[style_elm.type];
    //if(!style_cls) style_cls = _ParagraphStyle;
    return new style_cls(style_elm);
}


class BaseStyle extends ElementProxy {
    /*
    Base class for the various types of style object, paragraph, character,
    table, and numbering. These properties and methods are inherited by all
    style objects.
    */
    get builtin() {
        /*
        Read-only. |True| if this style is a built-in style. |False|
        indicates it is a custom (user-defined) style. Note this value is
        based on the presence of a `customStyle` attribute in the XML, not on
        specific knowledge of which styles are built into Word.
        */
        return (! this._element.customStyle);
    }
    delete() {
        /*
        Remove this style definition from the document. Note that calling
        this method does not remove or change the style applied to any
        document content. Content items having the deleted style will be
        rendered using the default style, as is any content with a style not
        defined in the document.
        */
        this._element.delete();
        this._element = null;
    }
    get hidden() {
        /*
        |True| if display of this style in the style gallery and list of
        recommended styles is suppressed. |False| otherwise. In order to be
        shown in the style gallery, this value must be |False| and
        :attr:`.quick_style` must be |True|.
        */
        return this._element.semiHidden_val;
    }
    set hidden(value) {
        this._element.semiHidden_val = value;
    }
    get locked() {
        /*
        Read/write Boolean. |True| if this style is locked. A locked style
        does not appear in the styles panel or the style gallery and cannot
        be applied to document content. This behavior is only active when
        formatting protection is turned on for the document (via the
        Developer menu).
        */
        return this._element.locked_val;
    }
    set locked(value) {
        this._element.locked_val = value;
    }
    get name() {
        /*
        The UI name of this style.
        */
        let name;
        name = this._element.name_val;
        if (name === null) {
            return null;
        }
        return BabelFish.internal2ui(name);
    }
    set name(value) {
        this._element.name_val = value;
    }
    get priority() {
        /*
        The integer sort key governing display sequence of this style in the
        Word UI. |None| indicates no setting is defined, causing Word to use
        the default value of 0. Style name is used as a secondary sort key to
        resolve ordering of styles having the same priority value.
        */
        return this._element.uiPriority_val;
    }
    set priority(value) {
        this._element.uiPriority_val = value;
    }
    get quick_style() {
        /*
        |True| if this style should be displayed in the style gallery when
        :attr:`.hidden` is |False|. Read/write Boolean.
        */
        return this._element.qFormat_val;
    }
    set quick_style(value) {
        this._element.qFormat_val = value;
    }
    get style_id() {
        /*
        The unique key name (string) for this style. This value is subject to
        rewriting by Word and should generally not be changed unless you are
        familiar with the internals involved.
        */
        return this._element.styleId;
    }
    set style_id(value) {
        this._element.styleId = value;
    }
    get type() {
        /*
        Member of :ref:`WdStyleType` corresponding to the type of this style,
        e.g. ``WD_STYLE_TYPE.PARAGRAPH``.
        */
        let type;
        type = this._element.type;
        if (type === null) {
            return WD_STYLE_TYPE.PARAGRAPH;
        }
        return type;
    }
    get unhide_when_used() {
        /*
        |True| if an application should make this style visible the next time
        it is applied to content. False otherwise. Note that |docx| does not
        automatically unhide a style having |True| for this attribute when it
        is applied to content.
        */
        return this._element.unhideWhenUsed_val;
    }
    set unhide_when_used(value) {
        this._element.unhideWhenUsed_val = value;
    }
}

class _CharacterStyle extends BaseStyle {
    /*
    A character style. A character style is applied to a |Run| object and
    primarily provides character-level formatting via the |Font| object in
    its :attr:`.font` property.
    */
    get base_style() {
        /*
        Style object this style inherits from or |None| if this style is
        not based on another style.
        */
        let base_style;
        base_style = this._element.base_style;
        if (base_style === null) {
            return null;
        }
        return new StyleFactory(base_style);
    }
    set base_style(style) {
        let style_id;
        style_id = style !== null ? style.style_id : null;
        this._element.basedOn_val = style_id;
    }
    get font() {
        /*
        The |Font| object providing access to the character formatting
        properties for this style, such as font name and size.
        */
        return new Font(this._element);
    }
}

class _ParagraphStyle extends _CharacterStyle {
    /*
    A paragraph style. A paragraph style provides both character formatting
    and paragraph formatting such as indentation and line-spacing.
    */
    toString() {
        return `_ParagraphStyle('${this.name}') id: ${this.id}`;
    }
    get next_paragraph_style() {
        /*
        |_ParagraphStyle| object representing the style to be applied
        automatically to a new paragraph inserted after a paragraph of this
        style. Returns self if no next paragraph style is defined. Assigning
        |None| or *self* removes the setting such that new paragraphs are
        created using this same style.
        */
        let next_style_elm;
        next_style_elm = this._element.next_style;
        if (next_style_elm === null) {
            return this;
        }
        if (next_style_elm.type !== WD_STYLE_TYPE.PARAGRAPH) {
            return this;
        }
        return new StyleFactory(next_style_elm);
    }
    set next_paragraph_style(style) {
        if (((style === null) || (style.style_id === this.style_id))) {
            this._element._remove_next();
        } else {
            this._element.get_or_add_next().val = style.style_id;
        }
    }
    get paragraph_format() {
        /*
        The |ParagraphFormat| object providing access to the paragraph
        formatting properties for this style such as indentation.
        */
        return new ParagraphFormat(this._element);
    }
}

class _TableStyle extends _ParagraphStyle {
    /*
    A table style. A table style provides character and paragraph formatting
    for its contents as well as special table formatting properties.
    */
    toString() {
        return `_TableStyle('${this.name}') id: ${this.id}`;
    }
}

class _NumberingStyle extends BaseStyle {
    /*
    A numbering style. Not yet implemented.
    */
}
let style_cls_map = {
    [WD_STYLE_TYPE.PARAGRAPH]: _ParagraphStyle,
    [WD_STYLE_TYPE.CHARACTER]: _CharacterStyle,
    [WD_STYLE_TYPE.TABLE]: _TableStyle,
    [WD_STYLE_TYPE.LIST]: _NumberingStyle
}


module.exports = {BaseStyle, StyleFactory, _CharacterStyle, _NumberingStyle,
    _ParagraphStyle, _TableStyle};
