
/* |DocumentPart| and closely related objects */
let {Document} = require('../document');
let {RT} = require('../opc/constants');
let {FooterPart, HeaderPart} = require('./hdrftr');
let {NumberingPart} = require('./numbering');
let {SettingsPart} = require('./settings');
let {ThemePart} = require('./theme');
let {BaseStoryPart} = require('./story');
let {StylesPart} = require('./styles');
let {InlineShapes} = require('../shape');
let {KeyError} = require('../exceptions')



class DocumentPart extends BaseStoryPart {
    /*Main document part of a WordprocessingML (WML) package, aka a .docx file.

    Acts as broker to other parts such as image, core properties, and style parts. It
    also acts as a convenient delegate when a mid-document object needs a service
    involving a remote ancestor. The `Parented.part` property inherited by many content
    objects provides access to this part object for that purpose.
    */
    add_footer_part() {
        /* Return (footer_part, rId) pair for newly-created footer part. */
        let footer_part, rId;
        footer_part = FooterPart._new(this._package);
        rId = this.relate_to(footer_part, RT.FOOTER);
        return [footer_part, rId];
    }
    add_header_part() {
        /* Return (header_part, rId) pair for newly-created header part. */
        let header_part, rId;
        header_part = HeaderPart._new(this._package);
        rId = this.relate_to(header_part, RT.HEADER);
        return [header_part, rId];
    }
    get core_properties() {
        /*
        A |CoreProperties| object providing read/write access to the core
        properties of this document.
        */
        return this._package.core_properties;
    }
    get document() {
        /*
        A |Document| object providing access to the content of this document.
        */
        return new Document(this.element, this);
    }
    drop_header_part(rId) {
        /* Remove related header part identified by *rId*. */
        this.drop_rel(rId);
    }
    footer_part(rId) {
        /* Return |FooterPart| related by *rId*. */
        return this.related_parts[rId];
    }
    get_style(style_id, style_type) {
        /*
        Return the style in this document matching *style_id*. Returns the
        default style for *style_type* if *style_id* is |None| or does not
        match a defined style of *style_type*.
        */
        return this.styles.get_by_id(style_id, style_type);
    }
    get_style_id(style_or_name, style_type) {
        /*
        Return the style_id (|str|) of the style of *style_type* matching
        *style_or_name*. Returns |None| if the style resolves to the default
        style for *style_type* or if *style_or_name* is itself |None|. Raises
        if *style_or_name* is a style of the wrong type or names a style not
        present in the document.
        */
        return this.styles.get_style_id(style_or_name, style_type);
    }
    header_part(rId) {
        /* Return |HeaderPart| related by *rId*. */
        return this.related_parts[rId];
    }
    get inline_shapes() {
        /*
        The |InlineShapes| instance containing the inline shapes in the
        document.
        */
        if (!this._inline_shapes)
            this._inline_shapes = new InlineShapes(this.element.body, this);
        return this._inline_shapes;
    }
    get numbering_part() {
        /*
        A |NumberingPart| object providing access to the numbering
        definitions for this document. Creates an empty numbering part if one
        is not present.
        */
        if (this._numbering_part) return this._numbering_part;
        let numbering_part;
        try {
            this._numbering_part = this.part_related_by(RT.NUMBERING);
        } catch(e) {
            if (e instanceof KeyError) {
                numbering_part = NumberingPart._new();
                this.relate_to(numbering_part, RT.NUMBERING);
                this._numbering_part = numbering_part;
            } else {
                throw e;
            }
        }
        return this._numbering_part;
    }
    save(path_or_stream) {
        /*
        Save this document to *path_or_stream*, which can be either a path to
        a filesystem location (a string) or a file-like object.
        */
        return this._package.save(path_or_stream);
    }
    get settings() {
        /*
        A |Settings| object providing access to the settings in the settings
        part of this document.
        */
        return this._settings_part.settings;
    }
    get styles() {
        /*
        A |Styles| object providing access to the styles in the styles part
        of this document.
        */
        return this._styles_part.styles;
    }
    get theme() {
        /*
        A |Theme| object providing access to the theme in the theme part
        of this document.
        */
        return this._theme_part.theme;
    }
    get _settings_part() {
        /*
        A |SettingsPart| object providing access to the document-level
        settings for this document. Creates a default settings part if one is
        not present.
        */
        let settings_part;
        try {
            return this.part_related_by(RT.SETTINGS);
        } catch(e) {
            if (e instanceof KeyError) {
                settings_part = SettingsPart._default(this._package);
                this.relate_to(settings_part, RT.SETTINGS);
                return settings_part;
            } else {
                throw e;
            }
        }
    }
    get _styles_part() {
        /*
        Instance of |StylesPart| for this document. Creates an empty styles
        part if one is not present.
        */
        let styles_part;
        try {
            return this.part_related_by(RT.STYLES);
        } catch(e) {
            if (e instanceof KeyError) {
                styles_part = StylesPart._default(this._package);
                this.relate_to(styles_part, RT.STYLES);
                return styles_part;
            } else {
                throw e;
            }
        }
    }
    get _theme_part() {
        /*
        Instance of |ThemePart| for this document. Creates an empty theme
        part if one is not present.
        */
        return this.get_part(ThemePart, RT.THEME);
    }
    get_part(part_cls, rt ) {
        let part;
        try {
            return this.part_related_by(rt);
        } catch(e) {
            if (e instanceof KeyError) {
                part = part_cls._default(this._package);
                this.relate_to(part, rt);
                return part;
            } else {
                throw e;
            }
        }

    }
}


module.exports = {DocumentPart};
