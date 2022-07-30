/*
DrawingML objects related to color, ColorFormat being the most prominent.
*/
let {MSO_COLOR_TYPE} = require('../enum/dml');
let {ST_HexColorAuto} = require('../oxml/simpletypes');
let {ElementProxy} = require('../shared');

class ColorFormat extends ElementProxy {
    /*
    Provides access to color settings such as RGB color, theme color, and
    luminance adjustments.
    */
    constructor(rPr_parent) {
        super(rPr_parent);
    }
    get rgb() {
        /*
        An |RGBColor| value or |None| if no RGB color is specified.

        When :attr:`type` is `MSO_COLOR_TYPE.RGB`, the value of this property
        will always be an |RGBColor| value. It may also be an |RGBColor|
        value if :attr:`type` is `MSO_COLOR_TYPE.THEME`, as Word writes the
        current value of a theme color when one is assigned. In that case,
        the RGB value should be interpreted as no more than a good guess
        however, as the theme color takes precedence at rendering time. Its
        value is |None| whenever :attr:`type` is either |None| or
        `MSO_COLOR_TYPE.AUTO`.

        Assigning an |RGBColor| value causes :attr:`type` to become
        `MSO_COLOR_TYPE.RGB` and any theme color is removed. Assigning |None|
        causes any color to be removed such that the effective color is
        inherited from the style hierarchy.
        */
        let color;
        color = this._color;
        if (color === null) {
            return null;
        }
        if (color.val === ST_HexColorAuto.AUTO) {
            return null;
        }
        return color.val;
    }
    set rgb(value) {
        let rPr;
        if ((value === null) && (this._color === null)) {
            return;
        }
        rPr = this._element.get_or_add_rPr();
        rPr._remove_color();
        if (value !== null) {
            rPr.get_or_add_color().val = value;
        }
    }
    get theme_color() {
        /*
        A member of :ref:`MsoThemeColorIndex` or |None| if no theme color is
        specified. When :attr:`type` is `MSO_COLOR_TYPE.THEME`, the value of
        this property will always be a member of :ref:`MsoThemeColorIndex`.
        When :attr:`type` has any other value, the value of this property is
        |None|.

        Assigning a member of :ref:`MsoThemeColorIndex` causes :attr:`type`
        to become `MSO_COLOR_TYPE.THEME`. Any existing RGB value is retained
        but ignored by Word. Assigning |None| causes any color specification
        to be removed such that the effective color is inherited from the
        style hierarchy.
        */
        let color;
        color = this._color;
        if ((color === null) || (color.themeColor === null)) {
            return null;
        }
        return color.themeColor;
    }
    set theme_color(value) {
        if (value === null) {
            if (this._color !== null) {
                this._element.rPr._remove_color();
            }
            return;
        }
        this._element.get_or_add_rPr().get_or_add_color().themeColor = value;
    }
    get type() {
        /*
        Read-only. A member of :ref:`MsoColorType`, one of RGB, THEME, or
        AUTO, corresponding to the way this color is defined. Its value is
        |None| if no color is applied at this level, which causes the
        effective color to be inherited from the style hierarchy.
        */
        let color;
        color = this._color;
        if (color === null) {
            return null;
        }
        if (color.themeColor !== null) {
            return MSO_COLOR_TYPE.THEME;
        }
        if (color.val === ST_HexColorAuto.AUTO) {
            return MSO_COLOR_TYPE.AUTO;
        }
        return MSO_COLOR_TYPE.RGB;
    }
    get _color() {
        /*
        Return `w:rPr/w:color` or |None| if not present. Helper to factor out
        repetitive element access.
        */
        let rPr;
        rPr = this._element.rPr;
        if (rPr === null) {
            return null;
        }
        return rPr.color;
    }
}


module.exports = {ColorFormat};
