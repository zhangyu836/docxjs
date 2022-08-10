
/*
Base classes and other objects used by enumerations
*/

let {InvalidXmlError, ValueError} = require('../exceptions');
let {getType} = require('../oxml/simpletypes')


class Enumeration {
    /*
    The metaclass for Enumeration and its subclasses. Adds a name for each
    named member and compiles state needed by the enumeration class to
    respond to other attribute gets
    */
    populate_enums() {//clsdict
        this._add_enum_members(this);
        this._collect_valid_settings(this);
        //this._generate_docs_page(clsname, clsdict);
    }
    _add_enum_members(clsdict) {
        /*
        Dispatch ``.add_to_enum()`` call to each member so it can do its
        thing to properly add itself to the enumeration class. This
        delegation allows member sub-classes to add specialized behaviors.
        */
        let enum_members = clsdict["__members__"];
        for (let member of enum_members) {
            member.add_to_enum(clsdict);
        }
    }
    _collect_valid_settings(clsdict) {
        /*
        Return a sequence containing the enumeration values that are valid
        assignment values. Return-only values are excluded.
        */
        let enum_members, valid_settings;
        enum_members = clsdict["__members__"];
        valid_settings = [];
        for (let member of enum_members) {
            valid_settings.push(...member.valid_settings);
        }
        clsdict["_valid_settings"] = valid_settings;
    }
   _generate_docs_page(clsname, clsdict) {
        /*
        Return the RST documentation page for the enumeration.
        */
        //clsdict["__docs_rst__"] = _DocsPageFormatter(clsname, clsdict).page_str;
    }
//}
//class EnumerationBase  {
    /*
    Base class for all enumerations, used directly for enumerations requiring
    only basic behavior. It's __dict__ is used below in the Python 2+3
    compatible metaclass definition.
    */
    validate(value) {
        /*
        Raise |ValueError| if *value* is not an assignable value.
        */
        if (! this._valid_settings.includes(value)) {
            throw new ValueError(`${value} not a member of ${getType(this)} enumeration`);
        }
    }
}

//let Enumeration = MetaEnumeration("Enumeration" );
class XmlEnumeration extends Enumeration {
    /*
    Provides ``to_xml()`` and ``from_xml()`` methods in addition to base
    enumeration features
    */
    from_xml(xml_val) {
        /*
        Return the enumeration member corresponding to the XML value
        *xml_val*.
        */
        if (! this._xml_to_member.has(xml_val)) {
            throw new InvalidXmlError(`attribute value '${xml_val}' not valid for this type`);
        }
        return this._xml_to_member.get(xml_val);
    }
    to_xml(enum_val) {
        /*
        Return the XML value of the enumeration value *enum_val*.
        */
        if (! this._member_to_xml.has(enum_val)) {
            throw new ValueError(`value '${enum_val}' not in enumeration ${getType(this)}`);
        }
        return this._member_to_xml.get(enum_val);
    }
}

class EnumMember  {
    /*
    Used in the enumeration class definition to define a member value and its
    mappings
    */
    constructor(name, value, docstring) {
        this._name = name;
        //if (Number.isInteger(value)) {
        //    value = new EnumValue(name, value, docstring);
        //}
        this._value = value;
        this._docstring = docstring;
    }
    add_to_enum(clsdict) {
        /*
        Add a name to *clsdict* for this member.
        */
        this.register_name(clsdict);
    }
    get docstring() {
        /*
        The description of this member
        */
        return this._docstring;
    }
    get name() {
        /*
        The distinguishing name of this member within the enumeration class,
        e.g. 'MIDDLE' for MSO_VERTICAL_ANCHOR.MIDDLE, if this is a named
        member. Otherwise the primitive value such as |None|, |True| or
        |False|.
        */
        return this._name;
    }
    register_name(clsdict) {
        /*
        Add a member name to the class dict *clsdict* containing the value of
        this member object. Where the name of this object is None, do
        nothing; this allows out-of-band values to be defined without adding
        a name to the class dict.
        */
        if (this.name === null) {
            return;
        }
        clsdict[this.name] = this.value;
    }
    get valid_settings() {
        /*
        A sequence containing the values valid for assignment for this
        member. May be zero, one, or more in number.
        */
        return [this._value];
    }
    get value() {
        /*
        The enumeration value for this member, often an instance of
        EnumValue, but may be a primitive value such as |None|.
        */
        return this._value;
    }
}
class EnumValue extends Number{
    /*
    A named enumeration value, providing __str__ and __doc__ string values
    for its symbolic name and description, respectively. Subclasses int, so
    behaves as a regular int unless the strings are asked for.
    */

    constructor(member_name, int_value, docstring) {
        super(int_value);
        this._member_name = member_name;
        this._docstring = docstring;
        //this.int_value = int_value;
    }
    get __doc__() {
        /*
        The description of this enumeration member
        */
        return this._docstring.trim();
    }
    toString() {
        /*
        The symbolic name and string value of this member, e.g. 'MIDDLE (3)'
        */
        return `${this._member_name} (${this.valueOf()})`;
    }
}
class ReturnValueOnlyEnumMember extends EnumMember {
    /*
    Used to define a member of an enumeration that is only valid as a query
    result and is not valid as a setting, e.g. MSO_VERTICAL_ANCHOR.MIXED (-2)
    */
    get valid_settings() {
        /*
        No settings are valid for a return-only value.
        */
        return [];
    }
}
class XmlMappedEnumMember extends EnumMember {
    /*
    Used to define a member whose value maps to an XML attribute value.
    */
    constructor(name, value, xml_value, docstring) {
        super(name, value, docstring);
        this._xml_value = xml_value;
    }
    add_to_enum(clsdict) {
        /*
        Compile XML mappings in addition to base add behavior.
        */
        super.add_to_enum(clsdict);
        this.register_xml_mapping(clsdict);
    }
    register_xml_mapping(clsdict) {
        /*
        Add XML mappings to the enumeration class state for this member.
        */
        let member_to_xml, xml_to_member;
        member_to_xml = this._get_or_add_member_to_xml(clsdict);
        //member_to_xml[this.value] = this.xml_value;
        member_to_xml.set(this.value, this.xml_value);
        xml_to_member = this._get_or_add_xml_to_member(clsdict);
        //xml_to_member[this.xml_value] = this.value;
        xml_to_member.set(this.xml_value, this.value);
    }
    get xml_value() {
        /*
        The XML attribute value that corresponds to this enumeration value
        */
        return this._xml_value;
    }
    _get_or_add_member_to_xml(clsdict) {
        /*
        Add the enum -> xml value mapping to the enumeration class state
        */
        if (! clsdict["_member_to_xml"]) {
            clsdict["_member_to_xml"] = new Map();//{};
        }
        return clsdict["_member_to_xml"];
    }
    _get_or_add_xml_to_member(clsdict) {
        /*
        Add the xml -> enum value mapping to the enumeration class state
        */
        if (! clsdict["_xml_to_member"]) {
            clsdict["_xml_to_member"] = new Map();//{};
        }
        return clsdict["_xml_to_member"];
    }
}

module.exports = {EnumMember, Enumeration, XmlEnumeration,
    XmlMappedEnumMember, ReturnValueOnlyEnumMember};
