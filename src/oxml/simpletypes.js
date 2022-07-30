/*
Simple type classes, providing validation and format translation for values
stored in XML element attributes. Naming generally corresponds to the simple
type in the associated XML schema.
*/

let {Emu, Pt, RGBColor, Twips} = require('../shared');
let {InvalidXmlError, ValueError} = require('../exceptions');

function getType(obj){
    let proto = Object.getPrototypeOf(obj);
    if(proto.constructor) return proto.constructor.name;
    return typeof obj;
}
class BaseSimpleType  {
    static from_xml(str_value) {
        return this.convert_from_xml(str_value);
    }
    static to_xml(value) {
        this.validate(value);
        return this.convert_to_xml(value);
    }
    static validate_int(value) {
        if (! Number.isInteger(value) && ! value instanceof Emu) {
            throw new TypeError(`value must be <type 'Integer'>, got ${getType(value)}`);
        }
    }
    static validate_int_in_range(value, min_inclusive, max_inclusive) {
        this.validate_int(value);
        if ((value < min_inclusive) || (value > max_inclusive)) {
            throw new ValueError(`value must be in range ${min_inclusive} to ${max_inclusive} inclusive, got ${value}`);
        }
    }
    static validate_string(value) {
        if (((typeof value) === "string") || (value instanceof String)) {
            return value;
        }
        throw new TypeError(`value must be a string, got ${getType(value)}`);
    }
}
class BaseIntType extends BaseSimpleType {
    static convert_from_xml(str_value) {
        return parseInt(str_value);
    }
    static convert_to_xml(value) {
        return value.toString();
    }
    static validate(value) {
        this.validate_int(value);
    }
}
class BaseStringType extends BaseSimpleType {
    static convert_from_xml(str_value) {
        return str_value;
    }
    static convert_to_xml(value) {
        return value;
    }
    static validate(value) {
        this.validate_string(value);
    }
}
class BaseStringEnumerationType extends BaseStringType {
    static validate(value) {
        this.validate_string(value);
        if (!this._members.includes(value)) {
            throw new ValueError(`must be one of ${this._members}, got '${value}'`);
        }
    }
}
class XsdAnyUri extends BaseStringType {
    /*
    There's a regular expression this is supposed to meet but so far thinking
    spending cycles on validating wouldn't be worth it for the number of
    programming errors it would catch.
    */
}
class XsdBoolean extends BaseSimpleType {
    static convert_from_xml(str_value) {
        if (!["1", "0", "true", "false"].includes(str_value)) {
            throw new InvalidXmlError("value must be one of '1', '0', 'true' or" +
                ` 'false', got '${str_value}'`);
        }
        return ["1", "true"].includes(str_value);
    }
    static convert_to_xml(value) {
        return {[true]: "1", [false]: "0", [1]: "1", [0]: "0"}[value];//, [1]: "1", [0]: "0" //added
    }
    static validate(value) {
        if (![1, 0, true, false].includes(value)) { // 1, 0,  added
            throw new TypeError("only True or False (and possibly None) " +
                `may be assigned, got '${value}'`);
        }
    }
}
class XsdId extends BaseStringType {
    /*
    String that must begin with a letter or underscore and cannot contain any
    colons. Not fully validated because not used in external API.
    */
}
class XsdInt extends BaseIntType {
    static validate(value) {
        this.validate_int_in_range(value, (- 2147483648), 2147483647);
    }
}
class XsdLong extends BaseIntType {
    static validate(value) {
        this.validate_int_in_range(value, (- 9223372036854775808), 9223372036854775807);
    }
}
class XsdString extends BaseStringType {
}
class XsdStringEnumeration extends BaseStringEnumerationType {
    /*
    Set of enumerated xsd:string values.
    */
}
class XsdToken extends BaseStringType {
    /*
    xsd:string with whitespace collapsing, e.g. multiple spaces reduced to
    one, leading and trailing space stripped.
    */
}
class XsdUnsignedInt extends BaseIntType {
    static validate(value) {
        this.validate_int_in_range(value, 0, 4294967295);
    }
}
class XsdUnsignedLong extends BaseIntType {
    static validate(value) {
        this.validate_int_in_range(value, 0, 18446744073709551615);
    }
}
class ST_BrClear extends XsdString {
    static validate(value) {
        let valid_values;
        this.validate_string(value);
        valid_values = ["none", "left", "right", "all"];
        if (!valid_values.includes(value)) {
            throw new ValueError(`must be one of ${valid_values}, got '${value}'`);
        }
    }
}
class ST_BrType extends XsdString {
    static validate(value) {
        let valid_values;
        this.validate_string(value);
        valid_values = ["page", "column", "textWrapping"];
        if (!valid_values.includes(value)) {
            throw new ValueError(`must be one of ${valid_values}, got '${value}'`);
        }
    }
}
class ST_Coordinate extends BaseIntType {
    static convert_from_xml(str_value) {
        if (str_value.includes("i") || str_value.includes("m")
            || str_value.includes("m")) {
            return ST_UniversalMeasure.convert_from_xml(str_value);
        }
        return new Emu(str_value);
    }
    static validate(value) {
        ST_CoordinateUnqualified.validate(value);
    }
}
class ST_CoordinateUnqualified extends XsdLong {
    static validate(value) {
        this.validate_int_in_range(value, (- 27273042329600), 27273042316900);
    }
}
class ST_DecimalNumber extends XsdInt {
}
class ST_DrawingElementId extends XsdUnsignedInt {
}
class ST_HexColor extends BaseStringType {
    static convert_from_xml(str_value) {
        if (str_value === "auto") {
            return ST_HexColorAuto.AUTO;
        }
        return RGBColor.from_string(str_value);
    }
    static convert_to_xml(value) {
        /*
        Keep alpha hex numerals all uppercase just for consistency.
        */
        return value.toString();
    }
    static validate(value) {
        if (! (value instanceof RGBColor)) {
            throw new ValueError("rgb color value must be RGBColor object, " +
                `got ${getType(value)} ${value}`);
        }
    }
}

class ST_HexColorAuto extends XsdStringEnumeration {
    /*
    Value for `w:color/[@val="auto"] attribute setting
    */
    static AUTO = 'auto'
    static _members = ['auto']
}
//ST_HexColorAuto.AUTO = 'auto';

class ST_HpsMeasure extends XsdUnsignedLong {
    /*
    Half-point measure, e.g. 24.0 represents 12.0 points.
    */
    static convert_from_xml(str_value) {
        if (str_value.includes("m") || str_value.includes("n")
            || str_value.includes("p")) {
            return ST_UniversalMeasure.convert_from_xml(str_value);
        }
        return new Pt(parseInt(str_value) / 2.0);
    }
    static convert_to_xml(value) {
        let emu, half_points;
        emu = new Emu(value);
        half_points = Math.round(emu.pt * 2);
        return half_points.toString();
    }
}

class ST_Merge extends XsdStringEnumeration {
    /*
    Valid values for <w:xMerge val=""> attribute
    */
    static CONTINUE = 'continue';
    static RESTART = 'restart';
    static _members = ['continue', 'restart']
}


class ST_OnOff extends XsdBoolean {
    static convert_from_xml(str_value) {
        if (!["1", "0", "true", "false", "on", "off"].includes(str_value)) {
            throw new InvalidXmlError("value must be one of '1', '0', 'true', 'false'," +
                ` 'on', or 'off', got '${str_value}'`);
        }
        return ["1", "true", "on"].includes(str_value);
    }
}
class ST_PositiveCoordinate extends XsdLong {
    static convert_from_xml(str_value) {
        return new Emu(str_value).emu;
    }
    static validate(value) {
        this.validate_int_in_range(value, 0, 27273042316900);
    }
}
class ST_RelationshipId extends XsdString {
}
class ST_SignedTwipsMeasure extends XsdInt {
    static convert_from_xml(str_value) {
        if (str_value.includes("i") || str_value.includes("m")
            || str_value.includes("p")) {
            return ST_UniversalMeasure.convert_from_xml(str_value);
        }
        return new Twips(parseInt(str_value));
    }
    static convert_to_xml(value) {
        let emu, twips;
        emu = new Emu(value);
        twips = emu.twips;
        return twips.toString();
    }
}
class ST_String extends XsdString {
}
class ST_TblLayoutType extends XsdString {
    static validate(value) {
        let valid_values;
        this.validate_string(value);
        valid_values = ["fixed", "autofit"];
        if (!valid_values.includes(value)) {
            throw new ValueError(`must be one of ${valid_values}, got '${value}'`);
        }
    }
}
class ST_TblWidth extends XsdString {
    static validate(value) {
        let valid_values;
        this.validate_string(value);
        valid_values = ["auto", "dxa", "nil", "pct"];
        if (!valid_values.includes(value)) {
            throw new ValueError(`must be one of ${valid_values}, got '${value}'`);
        }
    }
}
class ST_TwipsMeasure extends XsdUnsignedLong {
    static convert_from_xml(str_value) {
        if (str_value.includes("i") || str_value.includes("m")
            || str_value.includes("p")) {
            return ST_UniversalMeasure.convert_from_xml(str_value);
        }
        return new Twips(parseInt(str_value));
    }
    static convert_to_xml(value) {
        let emu, twips;
        emu = new Emu(value);
        twips = emu.twips;
        return twips.toString();
    }
}
class ST_UniversalMeasure extends BaseSimpleType {
    static convert_from_xml(str_value) {
        let emu_value, float_part, multiplier, quantity, units_part;
        [float_part, units_part] = [str_value.slice(0, -2), str_value.slice(-2)];
        quantity = parseFloat(float_part);
        multiplier = {"mm": 36000, "cm": 360000, "in": 914400,
            "pt": 12700, "pc": 152400, "pi": 152400}[units_part];
        emu_value = new Emu(Math.round(quantity * multiplier));
        return emu_value;
    }
}
class ST_VerticalAlignRun extends XsdStringEnumeration {
    /*
    Valid values for `w:vertAlign/@val`.
    */
    static BASELINE = 'baseline';
    static SUPERSCRIPT = 'superscript';
    static SUBSCRIPT = 'subscript';
    static _members = ['baseline', 'superscript', 'subscript']
}


module.exports = {ST_HexColor, ST_HpsMeasure, ST_String, ST_BrClear,
    ST_BrType, ST_VerticalAlignRun, ST_SignedTwipsMeasure, ST_TwipsMeasure,
    ST_DecimalNumber,ST_Merge, ST_TblLayoutType, ST_TblWidth, XsdInt,
    ST_HexColorAuto, ST_OnOff, ST_Coordinate, ST_PositiveCoordinate,
    BaseIntType, ST_DrawingElementId, ST_RelationshipId, XsdString, XsdToken, getType
};
