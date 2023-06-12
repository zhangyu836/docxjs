/* Custom element classes for core properties-related XML elements */

let {is_string} = require('../compat');
let {parse_xml} = require('./xmlhandler');
let {nsdecls} = require('./ns');
let {BaseOxmlElement, ZeroOrOne} = require('./xmlchemy');
let {getType} = require('./simpletypes');
let {ValueError} = require('../exceptions');

let _coreProperties_tmpl = `<cp:coreProperties ${nsdecls('cp', 'dc', 'dcterms')}/>\n`;
class CT_CoreProperties extends BaseOxmlElement {
    /*
    ``<cp:coreProperties>`` element, the root element of the Core Properties
    part stored as ``/docProps/core.xml``. Implements many of the Dublin Core
    document metadata elements. String elements resolve to an empty string
    ('') if the element is not present in the XML. String elements are
    limited in length to 255 unicode characters.
    */
    category = new ZeroOrOne('cp:category');
    contentStatus = new ZeroOrOne('cp:contentStatus');
    created = new ZeroOrOne('dcterms:created');
    creator = new ZeroOrOne('dc:creator');
    description = new ZeroOrOne('dc:description');
    identifier = new ZeroOrOne('dc:identifier');
    keywords = new ZeroOrOne('cp:keywords');
    language = new ZeroOrOne('dc:language');
    lastModifiedBy = new ZeroOrOne('cp:lastModifiedBy');
    lastPrinted = new ZeroOrOne('cp:lastPrinted');
    modified = new ZeroOrOne('dcterms:modified');
    revision = new ZeroOrOne('cp:revision');
    subject = new ZeroOrOne('dc:subject');
    title = new ZeroOrOne('dc:title');
    version = new ZeroOrOne('cp:version');


    static _new() {
        /*
        Return a new ``<cp:coreProperties>`` element
        */
        return _coreProperties_tmpl;
        /*
        let coreProperties, xml;
        xml = _coreProperties_tmpl;
        coreProperties = parse_xml(xml);
        return coreProperties;
         */
    }
    get author_text() {
        /*
        The text in the `dc:creator` child element.
        */
        return this._text_of_element("creator");
    }
    set author_text(value) {
        this._set_element_text("creator", value);
    }
    get category_text() {
        return this._text_of_element("category");
    }
    set category_text(value) {
        this._set_element_text("category", value);
    }
    get comments_text() {
        return this._text_of_element("description");
    }
    set comments_text(value) {
        this._set_element_text("description", value);
    }
    get contentStatus_text() {
        return this._text_of_element("contentStatus");
    }
    set contentStatus_text(value) {
        this._set_element_text("contentStatus", value);
    }
    get created_datetime() {
        return this._datetime_of_element("created");
    }
    set created_datetime(value) {
        this._set_element_datetime("created", value);
    }
    get identifier_text() {
        return this._text_of_element("identifier");
    }
    set identifier_text(value) {
        this._set_element_text("identifier", value);
    }
    get keywords_text() {
        return this._text_of_element("keywords");
    }
    set keywords_text(value) {
        this._set_element_text("keywords", value);
    }
    get language_text() {
        return this._text_of_element("language");
    }
    set language_text(value) {
        this._set_element_text("language", value);
    }
    get lastModifiedBy_text() {
        return this._text_of_element("lastModifiedBy");
    }
    set lastModifiedBy_text(value) {
        this._set_element_text("lastModifiedBy", value);
    }
    get lastPrinted_datetime() {
        return this._datetime_of_element("lastPrinted");
    }
    set lastPrinted_datetime(value) {
        this._set_element_datetime("lastPrinted", value);
    }
    get modified_datetime() {
        return this._datetime_of_element("modified");
    }
    set modified_datetime(value) {
        this._set_element_datetime("modified", value);
    }
    get revision_number() {
        /*
        Integer value of revision property.
        */
        let revision, revision_str;
        revision = this.revision;
        if (revision === null) {
            return 0;
        }
        revision_str = revision.text;
        revision = Number.parseInt(revision_str);
        if (isNaN(revision)) revision = 0;
        if (revision < 0) {
            revision = 0;
        }
        return revision;
    }
    set revision_number(value) {
        /*
        Set revision property to string value of integer *value*.
        */
        let revision, tmpl;
        if (! Number.isInteger(value) || (value < 1)) {
            tmpl = `revision property requires positive int, got '${value}'`;
            throw new ValueError(tmpl);
        }
        revision = this.get_or_add_revision();
        revision.text = String(value);
    }
    get subject_text() {
        return this._text_of_element("subject");
    }
    set subject_text(value) {
        this._set_element_text("subject", value);
    }
    get title_text() {
        return this._text_of_element("title");
    }
    set title_text(value) {
        this._set_element_text("title", value);
    }
    get version_text() {
        return this._text_of_element("version");
    }
    set version_text(value) {
        this._set_element_text("version", value);
    }
    _datetime_of_element(property_name) {
        let datetime_str, element;
        element = this[property_name];
        if (!element) {
            return null;
        }
        datetime_str = element.text;
        try {
            return this._parse_W3CDTF_to_datetime(datetime_str);
        } catch(e) {
            if (e instanceof ValueError) {
                return null;
            } else {
                throw e;
            }
        }
    }
    _get_or_add(prop_name) {
        /*
        Return element returned by 'get_or_add_' method for *prop_name*.
        */
        let element, get_or_add_method, get_or_add_method_name;
        get_or_add_method_name = `get_or_add_${prop_name}`;
        get_or_add_method = this[get_or_add_method_name];
        element = get_or_add_method.apply(this);
        return element;
    }

    _parse_W3CDTF_to_datetime(w3cdtf_str) {
        //# valid W3CDTF date cases:
        //# yyyy e.g. '2003'
        //# yyyy-mm e.g. '2003-12'
        //# yyyy-mm-dd e.g. '2003-12-31'
        //# UTC timezone e.g. '2003-12-31T10:14:55Z'
        //# numeric timezone e.g. '2003-12-31T10:14:55-08:00'
        let dt = new Date(w3cdtf_str);
        if (isNaN(dt.getTime())) {
            let msg = `could not parse W3CDTF datetime string '${w3cdtf_str}'`;
            throw new ValueError(msg);
        }
        return dt;
    }
    _set_element_datetime(prop_name, value) {
        /*
        Set date/time value of child element having *prop_name* to *value*.
        */
        let dt_str, element, tmpl;
        if (! (value instanceof Date)) {
            tmpl = `property requires <type 'Date'> object, got ${getType(value)}`;
            throw new ValueError(tmpl);
        }
        element = this._get_or_add(prop_name);
        dt_str = value.format("yyyy-MM-ddThh:mm:ssZ");
        element.text = dt_str;
        if (prop_name === "created" || prop_name == "modified") {
            //# These two require an explicit 'xsi:type="dcterms:W3CDTF"'
            //# attribute. The first and last line are a hack required to add
            //# the xsi namespace to the root element rather than each child
            //# element in which it is referenced
            //this.setAttribute("xsi:foo", "bar");
            element.setAttribute("xsi:type", "dcterms:W3CDTF");
            //this.removeAttribute("xsi:foo");
        }
    }
    _set_element_text(prop_name, value) {
        /* Set string value of *name* property to *value*. */
        let element, tmpl;
        if (! is_string(value)) {
            value = String(value);
        }
        if (value.length > 255) {
            tmpl = `exceeded 255 _char limit for property, got:\n\n'${value}'`;
            throw new ValueError(tmpl);
        }
        element = this._get_or_add(prop_name);
        element.text = value;
    }
    _text_of_element(property_name) {
        /*
        Return the text in the element matching *property_name*, or an empty
        string if the element is not present or contains no text.
        */
        let element;
        element = this[property_name];
        if (!element) {
            return "";
        }
        if (!element.text) {
            return "";
        }
        return element.text;
    }
}

Date.prototype.format = function (format) {
    let date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};


module.exports = {CT_CoreProperties};
