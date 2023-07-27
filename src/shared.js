
/*
Objects shared by docx modules.
*/
let {ValueError} = require('./exceptions')

class Length extends Number{
    /*
    Base class for length constructor classes Inches, Cm, Mm, Px, and Emu.
    Behaves as an int count of English Metric Units, 914,400 to the inch,
    36,000 to the mm. Provides convenience unit conversion methods in the form
    of read-only properties. Immutable.
    */
    static _EMUS_PER_INCH = 914400.00;
    static _EMUS_PER_CM = 360000.00;
    static _EMUS_PER_MM = 36000.00;
    static _EMUS_PER_PT = 12700.00;
    static _EMUS_PER_PX = 9525.00;
    static _EMUS_PER_TWIP = 635.00;

    constructor (emu) {
        super(Math.floor(emu));
    }
    get cm() {
        /*
        The equivalent length expressed in centimeters (float).
        */
        return this / Length._EMUS_PER_CM;
    }
    get emu() {
        /*
        The equivalent length expressed in English Metric Units (int).
        */
        return this.valueOf();
    }
    get inches() {
        /*
        The equivalent length expressed in inches (float).
        */
        return this / Length._EMUS_PER_INCH;
    }
    get mm() {
        /*
        The equivalent length expressed in millimeters (float).
        */
        return this / Length._EMUS_PER_MM;
    }
    get pt() {
        /*
        Floating point length in points
        */
        return this / Length._EMUS_PER_PT;
    }
    get px() {
        /*
        Floating point length in pixels
        */
        return this / Length._EMUS_PER_PX;
    }
    get twips() {
        /*
        The equivalent length expressed in twips (int).
        */
        return Math.round(this / Length._EMUS_PER_TWIP);
    }
}


class Inches extends Length {
    /*
    Convenience constructor for length in inches, e.g.
    ``width = Inches(0.5)``.
    */
    constructor(inches) {
        let emu = inches * Length._EMUS_PER_INCH;
        super(emu);
    }
}
class Cm extends Length {
    /*
    Convenience constructor for length in centimeters, e.g.
    ``height = Cm(12)``.
    */
    constructor(cm) {
        let emu = cm * Length._EMUS_PER_CM;
        super(emu);
    }
}
class Emu extends Length {
    /*
    Convenience constructor for length in English Metric Units, e.g.
    ``width = Emu(457200)``.
    */
    constructor(emu) {
        super(emu);
    }
}
class Mm extends Length {
    /*
    Convenience constructor for length in millimeters, e.g.
    ``width = Mm(240.5)``.
    */
    constructor(mm) {
        let emu = mm * Length._EMUS_PER_MM;
        super(emu);
    }
}
class Pt extends Length {
    /*
    Convenience value class for specifying a length in points
    */
    constructor(points) {
        let emu = points * Length._EMUS_PER_PT;
        super(emu);
    }
}
class Px extends Length {
    /*
    Convenience value class for specifying a length in pixels
    */
    constructor(pixels) {
        let emu = pixels * Length._EMUS_PER_PX;
        super(emu);
    }
}
class Twips extends Length {
    /*
    Convenience constructor for length in twips, e.g. ``width = Twips(42)``.
    A twip is a twentieth of a point, 635 EMU.
    */
    constructor(twips) {
        let emu = twips * Length._EMUS_PER_TWIP;
        super(emu);
    }
}
function toHex(c, toUpperCase=true) {
    let hex = c.toString(16);
    if(toUpperCase) hex = hex.toUpperCase()
    if (hex.length === 1) return '0'+hex;
    return hex;
}
class RGBColor {
    /*
    Immutable value object defining a particular RGB color.
    */
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        let msg;
        msg = "RGBColor() takes three integer values 0-255";
        for(let val of [r, g, b]) {
            if (!Number.isInteger(val) || val < 0 || val > 255){
                throw new ValueError(msg);
            }
        }
    }
    repr() {
        return `RGBColor(0x${toHex(this.r, false)}, 0x${toHex(this.g, false)}, 0x${toHex(this.b, false)})`;
    }
    toString() {
        /*
        Return a hex string rgb value, like '3C2F80'
        */

        return toHex(this.r) + toHex(this.g) + toHex(this.b);
    }
    static from_string(rgb_hex_str) {
        /*
        Return a _new instance from an RGB color hex string like ``'3C2F80'``.
        */
        let b, g, r;
        r = parseInt(rgb_hex_str.slice(0, 2), 16);
        g = parseInt(rgb_hex_str.slice(2, 4), 16);
        b = parseInt(rgb_hex_str.slice(4), 16);
        return new this(r, g, b);
    }
}

class ElementProxy  {
    /*
    Base class for lxml element proxy classes. An element proxy class is one
    whose primary responsibilities are fulfilled by manipulating the
    attributes and child elements of an XML element. They are the most common
    type of class in python-docx other than custom element (oxml) classes.
    */
    constructor(element, parent = null) {
        this._element = element;
        this._parent = parent;
    }
    eq(other) {
        /*
        Return |True| if this proxy object refers to the same oxml element as
        does *other*. ElementProxy objects are value objects and should
        maintain no mutable local state. Equality for proxy objects is
        defined as referring to the same XML element, whether or not they are
        the same proxy object instance.
        */
        if (! (other instanceof ElementProxy)) {
            return false;
        }
        return this._element === other._element;
    }
    ne(other) {
        if (! (other instanceof ElementProxy)) {
            return true;
        }
        return this._element !== other._element;
    }
    get element() {
        /*
        The lxml element proxied by this object.
        */
        return this._element;
    }
    get part() {
        /*
        The package part containing this object
        */
        return this._parent.part;
    }
}

class Parented  {
    /*
    Provides common services for document elements that occur below a part
    but may occasionally require an ancestor object to provide a service,
    such as add or drop a relationship. Provides ``self._parent`` attribute
    to subclasses.
    */
    constructor(parent) {
        this._parent = parent;
    }
    get part() {
        /*
        The package part containing this object
        */
        return this._parent.part;
    }
}
const indexedAccessHandler = {
    get: function(obj, prop) {
        if(typeof prop === "string"){
            let _int = Number.parseInt(prop)
            if (_int.toString()===prop)
                return obj.getitem(prop);
        }
        return obj[prop];
    },
    deleteProperty: function(obj, prop) {
        if(obj.hasOwnProperty('delitem')) {
            let _int = Number.parseInt(prop)
            if (_int.toString() === prop) {
                obj.delitem(prop);
                return true
            }
        }
        return delete obj[prop];
    }
};
function getIndexedAccess(obj) {
    return new Proxy(obj, indexedAccessHandler);
}

module.exports = {Emu, Pt, Inches, Cm, Mm, Twips, Length,
    RGBColor, ElementProxy, Parented, getIndexedAccess };
