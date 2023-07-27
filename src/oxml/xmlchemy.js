
let {InvalidXmlError} = require('../exceptions');
let {NamespacePrefixedTag, nsmap} = require('./ns');
let xpath = require('./xpath')
let {serializeToString, createElement} = require('./xmlhandler');
let {bindElement} = require('./xmlelemlookup');
let {getType} = require('./simpletypes');

/* no meta class
class MetaOxmlElement {
    Metaclass for BaseOxmlElement
}
*/
class BaseAttribute  {
    /*
    Base class for OptionalAttribute and RequiredAttribute, providing common
    methods.
    */
    constructor(attr_name, simple_type) {
        this._attr_name = attr_name;
        this._simple_type = simple_type;
    }
    populate_class_members(element_cls, prop_name) {
        /*
        Add the appropriate methods to *element_cls*.
        */
        this._element_cls = element_cls;
        this._prop_name = prop_name;
        this._add_attr_property();
    }
    _add_attr_property() {
        /*
        Add a read/write ``{prop_name}`` property to the element class that
        returns the interpreted value of this attribute on access and changes
        the attribute value to its ST_* counterpart on assignment.
        */
        Object.defineProperty(this._element_cls, this._prop_name, {
            get: this._getter, set: this._setter})
    }
    /*
    get _clark_name() {
        if (this._attr_name.includes(":")) {
            return qn(this._attr_name);
        }
        return this._attr_name;
    }*/
}
class OptionalAttribute extends BaseAttribute {
    /*
    Defines an optional attribute on a custom element class. An optional
    attribute returns a default value when not present for reading. When
    assigned |None|, the attribute is removed.
    */
    constructor(attr_name, simple_type, _default = null) {
        super(attr_name, simple_type);
        this._default = _default;
    }
    get _getter() {
        /*
        Return a function object suitable for the "get" side of the attribute
        property descriptor.
        */
        let _this = this;
        function get_attr_value() {
            if (!this.hasAttribute(_this._attr_name)) {
                return _this._default;
            }
            let attr_str_value = this.getAttribute(_this._attr_name);
            return _this._simple_type.from_xml(attr_str_value);
        }
        return get_attr_value;
    }
    get _docstring() {
        /*
        Return the string to use as the ``__doc__`` attribute of the property
        for this attribute.
        */
        return `${getType(this._simple_type)} type-converted value of ``${this._attr_name}``` +
            ' attribute, or |None| (or specified' +
            ' default value) if not present. Assigning the default value' +
            'causes the attribute to be removed from the element. %'
    }
    get _setter() {
        /*
        Return a function object suitable for the "set" side of the attribute
        property descriptor.
        */
        let _this = this;
        function set_attr_value (value) {
            if ((value === null) || (value === _this._default)) {
                if (this.hasAttribute(_this._attr_name)) {//_this._clark_name
                    this.removeAttribute(_this._attr_name);
                }
                return;
            }
            let str_value = _this._simple_type.to_xml(value);
            this.setAttribute(_this._attr_name, str_value);
        }
        return set_attr_value;
    }
}
class RequiredAttribute extends BaseAttribute {
    /*
    Defines a required attribute on a custom element class. A required
    attribute is assumed to be present for reading, so does not have
    a default value; its actual value is always used. If missing on read,
    an |InvalidXmlError| is raised. It also does not remove the attribute if
    |None| is assigned. Assigning |None| raises |TypeError| or |ValueError|,
    depending on the simple type of the attribute.
    */
    get _getter() {
        /*
        Return a function object suitable for the "get" side of the attribute
        property descriptor.
        */
        let _this = this;
        function get_attr_value() {
            if (!this.hasAttribute(_this._attr_name)) {
                throw new InvalidXmlError(
                    `required '${_this._attr_name}' attribute not present on element ${getType(this)}`);
            }
            let attr_str_value = this.getAttribute(_this._attr_name);
            return _this._simple_type.from_xml(attr_str_value);
        }
        return get_attr_value;
    }
    get _docstring() {
        /*
        Return the string to use as the ``__doc__`` attribute of the property
        for this attribute.
        */
          return `${getType(this._simple_type)} type-converted value of ``${this._attr_name}`` attribute.`;
    }
    get _setter() {
        /*
        Return a function object suitable for the "set" side of the attribute
        property descriptor.
        */
        let _this = this;
        function set_attr_value (value) {
            let str_value = _this._simple_type.to_xml(value);
            this.setAttribute(_this._attr_name, str_value);
        }
        return set_attr_value;
    }
}

class _BaseChildElement  {
    /*
    Base class for the child element classes corresponding to varying
    cardinalities, such as ZeroOrOne and ZeroOrMore.
    */
    constructor(nsptagname, successors = []) {
        this._nsptagname = nsptagname;
        this._successors = successors;
    }
    populate_class_members(element_cls, prop_name) {
        /*
        Baseline behavior for adding the appropriate methods to
        *element_cls*.
        */
        this._element_cls = element_cls;
        this._prop_name = prop_name;
    }
    _add_adder() {
        /*
        Add an ``_add_x()`` method to the element class for this child
        element.
        */
        let _this = this;
        function _add_child (attrs = {}) {
            let child, insert_method, new_method;
            new_method = this[_this._new_method_name];
            child = new_method.apply(this);
            for(let [key, value] of Object.entries(attrs)){
                child[key] = value;
            }
            insert_method = this[_this._insert_method_name];//
            insert_method.apply(this, [child]);
            return child;
        }
        this._add_to_class(this._add_method_name, _add_child);
    }
    _add_creator() {
        /*
        Add a ``_new_{prop_name}()`` method to the element class that creates
        a new, empty element of the correct type, having no attributes.
        */
        let creator = this._creator;
        this._add_to_class(this._new_method_name, creator);
    }
    _add_getter() {
        /*
        Add a read-only ``{prop_name}`` property to the element class for
        this child element.
        */
        Object.defineProperty(this._element_cls, this._prop_name, {
            get: this._getter})
    }
    _add_inserter() {
        /*
        Add an ``_insert_x()`` method to the element class for this child
        element.
        */
        let _this = this;
        function _insert_child (child) {
            this.insert_element_before(child, ..._this._successors);
            return child;
        }
        this._add_to_class(this._insert_method_name, _insert_child);
    }
    _add_list_getter() {
        /*
        Add a read-only ``{prop_name}_lst`` property to the element class to
        retrieve a list of child elements matching this type.
        */
        let prop_name = `${this._prop_name}_lst`;
        Object.defineProperty(this._element_cls, prop_name, {
            get: this._list_getter})
        let index_prop_name = `${this._prop_name}_lst_index`;
        this._element_cls[index_prop_name] = this._list_index;
    }
    _add_iter_getter() {
        /*
        Add a read-only ``{prop_name}_iter`` property to the element class to
        retrieve a iterator of child elements matching this type.
        */
        let prop_name = `${this._prop_name}_iter`;
        Object.defineProperty(this._element_cls, prop_name, {
            get: this._iter_getter})
    }
    get _add_method_name() {
        return `_add_${this._prop_name}`;
    }
    _add_public_adder() {
        /*
        Add a public ``add_x()`` method to the parent element class.
        */
        let _this = this;
        function add_child() {
            let child, private_add_method;
            private_add_method = this[_this._add_method_name];
            child = private_add_method.apply(this);
            return child;
        }
        this._add_to_class(this._public_add_method_name, add_child);
    }
    _add_to_class(name, method) {
        /*
        Add *method* to the target class as *name*, unless *name* is already
        defined on the class.
        */
        if (this._element_cls[name]) {
            return;
        }
        this._element_cls[name] = method;
    }
    get _creator() {
        /*
        Return a function object that creates a new, empty element of the
        right type, having no attributes.
        */
        let _this = this;
        function new_child_element() {
            return OxmlElement(_this._nsptagname);
        }
        return new_child_element;
    }
    get _getter() {
        /*
        Return a function object suitable for the "get" side of the property
        descriptor. This default getter returns the child element with
        matching tag name or |None| if not present.
        */
        let _this = this;
        function get_child_element () {
            return this.find(_this._nsptagname);
        }
        return get_child_element;
    }
    get _insert_method_name() {
        return `_insert_${this._prop_name}`;
    }
    get _list_getter() {
        /*
        Return a function object suitable for the "get" side of a list
        property descriptor.
        */
        let _this = this;
        function get_child_element_list() {
            return this.findall(_this._nsptagname);
        }
        return get_child_element_list;
    }
    get _iter_getter() {
        /*
        Return a function object suitable for the "get" side of a list
        property descriptor.
        */
        let _this = this;
        function get_child_element_iter() {
            return this.findallIter(_this._nsptagname);
        }
        return get_child_element_iter;
    }
    get _list_index() {
        /*
        Return a function object suitable for the "get" side of a list
        property descriptor.
        */
        let _this = this;
        function get_list_index(elem) {
            let list = this.findall(_this._nsptagname);
            for(let i=0; i < list.length; i++){
                let item = list[i];
                if( item.xmlElement === elem.xmlElement) return i;
            }
            return -1;
        }
        return get_list_index;
    }
    get _public_add_method_name() {
        /*
        add_childElement() is public API for a repeating element, allowing
        new elements to be added to the sequence. May be overridden to
        provide a friendlier API to clients having domain appropriate
        parameter names for required attributes.
        */
        return `add_${this._prop_name}`;
    }
    get _remove_method_name() {
        return `_remove_${this._prop_name}`;
    }
    get _new_method_name() {
        return `_new_${this._prop_name}`;
    }
}

class Choice extends _BaseChildElement {
    /*
    Defines a child element belonging to a group, only one of which may
    appear as a child.
    */
    get nsptagname() {
        return this._nsptagname;
    }
    populate_class_members(element_cls, group_prop_name, successors) {
        /*
        Add the appropriate methods to *element_cls*.
        */
        this._element_cls = element_cls;
        this._group_prop_name = group_prop_name;
        this._successors = successors;
        this._add_getter();
        this._add_creator();
        this._add_inserter();
        this._add_adder();
        this._add_get_or_change_to_method();
    }
    _add_get_or_change_to_method() {
        /*
        Add a ``get_or_change_to_x()`` method to the element class for this
        child element.
        */
        let _this = this;
        function get_or_change_to_child() {
            let add_method, child, remove_group_method;
            child = this[_this._prop_name];
            if (child !== null) {
                return child;
            }
            remove_group_method = this[_this._remove_group_method_name];
            remove_group_method.apply(this);
            add_method = this[_this._add_method_name];
            child = add_method.apply(this);
            return child;
        }
        this._add_to_class(this._get_or_change_to_method_name, get_or_change_to_child);
    }
    get _prop_name() {
        /*
        Calculate property name from tag name, e.g. a:schemeClr -> schemeClr.
        */
        let index = this._nsptagname.indexOf(":");
        return this._nsptagname.slice(index+1);
    }
    get _get_or_change_to_method_name() {
        return `get_or_change_to_${this._prop_name}`;
    }
    get _remove_group_method_name() {
        return `_remove_${this._group_prop_name}`;
    }
}

class OneAndOnlyOne extends _BaseChildElement {
    /*
    Defines a required child element for MetaOxmlElement.
    */
    constructor(nsptagname) {
        super(nsptagname);
    }
    populate_class_members(element_cls, prop_name) {
        /*
        Add the appropriate methods to *element_cls*.
        */
        super.populate_class_members(element_cls, prop_name);
        this._add_getter();
    }
    get _getter() {
        /*
        Return a function object suitable for the "get" side of the property
        descriptor.
        */
        let _this = this;
        function get_child_element() {
            let child = this.find(_this._nsptagname);
            if (child === null) {
                throw new InvalidXmlError(
                    `required "<${_this._nsptagname}>" child element not present`
                );
            }
            return child;
        }
        return get_child_element;
    }
}
class OneOrMore extends _BaseChildElement {
    /*
    Defines a repeating child element for MetaOxmlElement that must appear at
    least once.
    */
    populate_class_members(element_cls, prop_name) {
        /*
        Add the appropriate methods to *element_cls*.
        */
        super.populate_class_members(element_cls, prop_name);
        this._add_list_getter();
        this._add_iter_getter();
        this._add_creator();
        this._add_inserter();
        this._add_adder();
        this._add_public_adder();
        delete element_cls[prop_name];
    }
}
class ZeroOrMore extends _BaseChildElement {
    /*
    Defines an optional repeating child element for MetaOxmlElement.
    */
    populate_class_members(element_cls, prop_name) {
        /*
        Add the appropriate methods to *element_cls*.
        */
        super.populate_class_members(element_cls, prop_name);
        this._add_list_getter();
        this._add_iter_getter();
        this._add_creator();
        this._add_inserter();
        this._add_adder();
        this._add_public_adder();
        delete element_cls[prop_name];
    }
}
class ZeroOrOne extends _BaseChildElement {
    /*
    Defines an optional child element for MetaOxmlElement.
    */
    populate_class_members(element_cls, prop_name) {
        /*
        Add the appropriate methods to *element_cls*.
        */
        super.populate_class_members(element_cls, prop_name);
        this._add_getter();
        this._add_creator();
        this._add_inserter();
        this._add_adder();
        this._add_get_or_adder();
        this._add_remover();
    }
    _add_get_or_adder() {
        /*
        Add a ``get_or_add_x()`` method to the element class for this
        child element.
        */
        let _this = this;
        function get_or_add_child() {
            let add_method, child;
            child = this[_this._prop_name];
            if (child === null) {
                add_method = this[_this._add_method_name];
                child = add_method.apply(this);
            }
            return child;
        }
        this._add_to_class(this._get_or_add_method_name, get_or_add_child);
    }
    _add_remover() {
        /*
        Add a ``_remove_x()`` method to the element class for this child
        element.
        */
        let _this = this;
        function _remove_child() {
            this.remove_all([_this._nsptagname]);
        }
        this._add_to_class(this._remove_method_name, _remove_child);
    }
    get _get_or_add_method_name() {
        return `get_or_add_${this._prop_name}`;
    }
}

class ZeroOrOneChoice extends _BaseChildElement {
    /*
    Corresponds to an ``EG_*`` element group where at most one of its
    members may appear as a child.
    */
    constructor(choices, successors = []) {
        super();
        this._choices = choices;
        this._successors = successors;
    }
    populate_class_members(element_cls, prop_name) {
        /*
        Add the appropriate methods to *element_cls*.
        */
        super.populate_class_members(element_cls, prop_name);
        this._add_choice_getter();
        for( let choice of this._choices){
            choice.populate_class_members(element_cls, this._prop_name, this._successors);
        }
        this._add_group_remover();
    }
    _add_choice_getter() {
        /*
        Add a read-only ``{prop_name}`` property to the element class that
        returns the present member of this group, or |None| if none are
        present.
        */
        //this._element_cls[this._prop_name] = this._choice_getter;
        //# assign unconditionally to overwrite element name definition
        Object.defineProperty(this._element_cls, this._prop_name, {
            get: this._choice_getter})
    }
    _add_group_remover() {
        /*
        Add a ``_remove_eg_x()`` method to the element class for this choice
        group.
        */
        let _this = this;
        function _remove_choice_group() {
            for(let tagname of _this._member_nsptagnames) {
                this.remove_all([tagname]);
            }
        }
        _remove_choice_group.__doc__ = (
            'Remove the current choice group child element if present.'
        )
        this._add_to_class(this._remove_choice_group_method_name, _remove_choice_group);
    }
    get _choice_getter() {
        /*
        Return a function object suitable for the "get" side of the property
        descriptor.
        */
        let _this = this;
        function get_group_member_element() {
            return this.first_child_found_in(..._this._member_nsptagnames);
        }
        return get_group_member_element;
    }

    get _member_nsptagnames() {
        /*
        Sequence of namespace-prefixed tagnames, one for each of the member
        elements of this choice group.
        */
        let a = [];
        for(let choice of this._choices){
            a.push(choice.nsptagname);
        }
        return a;
    }
    get _remove_choice_group_method_name() {
        return `_remove_${this._prop_name}`;
    }
}
//class _OxmlElementBase  {
class BaseOxmlElement  {
    /*
    Effective base class for all custom element classes, to add standardized
    behavior to all classes in one place. Actual inheritance is from
    BaseOxmlElement below, needed to manage Python 2-3 metaclass declaration
    compatibility.
    */
    constructor() {
        this.xmlElement = null;
    }
    populate_methods() {
        //let dispatchable = [OneAndOnlyOne, OneOrMore, OptionalAttribute,
       //     RequiredAttribute, ZeroOrMore, ZeroOrOne, ZeroOrOneChoice];
        for(let [key,value] of Object.entries(this)) {
            if (value instanceof BaseAttribute || value instanceof _BaseChildElement) {
                value.populate_class_members(this, key)
            }
        }
    }
    toString() {
        return `<${getType(this)} '<${this._nsptag}>' `//at 0x${this.id}>
    }
    first_child_found_in(...tagnames) {
        /*
        Return the first child found with tag in *tagnames*, or None if
        not found.
        */
        for(let tagname of tagnames){
            let child = this.find(tagname)
            if( child){
                return child
            }
        }
        return null;
    }
    insert_element_before(elem, ...tagnames) {
        let _successor = null;
        if(tagnames.length>0){
            let successor = this.first_child_found_in(...tagnames);
            if (successor)
                _successor = successor.xmlElement
        }
        let parent = this.xmlElement;
        let newChild = elem.xmlElement;
        parent.insertBefore(newChild, _successor);
        return elem;
    }
    remove_all(tagnames) {
        /*
        Remove all child elements whose tagname (e.g. 'a:p') appears in
        *tagnames*.
        */
        for(let tagname of tagnames){
            let parent = this.xmlElement;
            let matching = this.findall(tagname, true);// no binding
            for (let child of matching) {
                parent.removeChild(child);
            }
        }
    }
    addnext(elem) {
        let parent = this.xmlElement.parentNode;
        if (parent) {
            let refNode = this.xmlElement.nextSibling;
            let newNode = elem.xmlElement;
            parent.insertBefore(newNode, refNode);
            return elem;
        }
        return null;
    }
    addprevious(elem) {
        let parent = this.xmlElement.parentNode;
        if (parent) {
            let refNode = this.xmlElement;
            let newNode = elem.xmlElement;
            parent.insertBefore(newNode, refNode);
            return elem;
        }
        return null;
    }
    append(elem) {
        let parent = this.xmlElement;
        let child = elem.xmlElement;
        parent.appendChild(child);
        return elem;
    }
    clear() {
        let parent = this.xmlElement;
        //let matching = this.findall(null, true);
        //for (let child of matching) {
        //    parent.removeChild(child);
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }
    clone() {
        let clone = this.xmlElement.cloneNode(true);
        return bindElement(clone);
    }
    clear_attrs() {
        let a = [];
        let attrs = this.xmlElement.attributes;
        for(let i = 0; i < attrs.length; i++){
            let attr = attrs[i];
            a.push(attr.nodeName);
        }
        for(let attrName of a){
            this.xmlElement.removeAttribute(attrName)
        }
    }
    find(tagName, raw=false) {
        let parent = this.xmlElement;
        for (let i = 0, l = parent.childNodes.length; i < l; i++) {
            let child = parent.childNodes.item(i);
            if (child.nodeType === 1 && child.tagName === tagName){
                if(!raw) {
                    return bindElement(child);
                }
                return child;
            }
        }
        return null;
    }
    findall(tagName, raw=false) {
        const result = [];
        let parent = this.xmlElement;
        for (let i = 0, l = parent.childNodes.length; i < l; i++) {
            let child = parent.childNodes.item(i);
            if (child.nodeType === 1 && (tagName == null || child.tagName === tagName)){
                if(!raw) {
                    result.push(bindElement(child));
                } else {
                    result.push(child);
                }
            }
        }
        return result;
    }
    findallIter(tagName=null) {
        let child = this.xmlElement.firstChild;
        function *iter() {
            while(child) {
                if (child.nodeType === 1 && (tagName == null || child.tagName === tagName)){
                    yield bindElement(child);
                }
                child = child.nextSibling;
            }
        }
        return iter();
    }
    getparent() {
        let parent = this.xmlElement.parentNode;
        if (parent) {
            return bindElement(parent);
        }
        return null;
    }
    insert(index, elem) {
        let parent = this.xmlElement;
        let refNode = parent.childNodes.item(index);
        let newNode = elem.xmlElement;
        parent.insertBefore(newNode, refNode);
        return elem;
    }
    item(idx) {
        return this.findall()[idx];
    }
    get length(){
        return this.findall().length;
    }
    remove(elem) {
        let parent = this.xmlElement;
        let child = elem.xmlElement;
        parent.removeChild(child);
    }
    slice(start, end) {
        let result = this.findall(null);
        return result.slice(start, end);
    }
    get text() {
        return this.xmlElement.textContent;
    }
    set text(text) {
        this.xmlElement.textContent = text;
    }
    get tagName() {
        return this.xmlElement.tagName;
    }
    getAttribute(tagName){
        return this.xmlElement.getAttribute(tagName);
    }
    hasAttribute(attrName){
        return this.xmlElement.hasAttribute(attrName);
    }
    removeAttribute(attrName){
        return this.xmlElement.removeAttribute(attrName);
    }
    setAttribute(attrName, value) {
        return this.xmlElement.setAttribute(attrName, value);
    }
    get xml() {
        /*
        Return XML string for this element, suitable for testing purposes.
        Pretty printed for readability and without an XML declaration at the
        top.
        */
        function removeText(elem) {
            let tags = [
                'cp:category', 'cp:contentStatus', 'dcterms:created', 'dc:creator',
                'dc:description', 'dc:identifier', 'cp:keywords', 'dc:language',
                'cp:lastModifiedBy', 'cp:lastPrinted', 'dcterms:modified',
                'cp:revision', 'dc:subject', 'dc:title', 'cp:version', 'w:t'
            ];
            if(tags.includes(elem.tagName)) return;
            let result = [];
            for (let i = 0, l = elem.childNodes.length; i < l; i++) {
                let child = elem.childNodes.item(i);
                if (child.nodeType === 3){
                    result.push(child);
                } else if(child.nodeType === 1){
                    removeText(child);
                }
            }
            for(let child of result) elem.removeChild(child);
        }
        removeText(this.xmlElement);
        return serializeToString(this.xmlElement);
    }
    xpath(xpath_str) {
        /*
        Override of ``lxml`` _Element.xpath() method to provide standard Open
        XML namespace mapping (``nsmap``) in centralized location.
        */
        let lst = xpath.select(xpath_str, this.xmlElement);
        let a = [];
        for (let item of lst){
            item = bindElement(item);
            a.push(item);
        }
        return a;
    }
    xpathIter(xpath_str) {
        /*
        Override of ``lxml`` _Element.xpath() method to provide standard Open
        XML namespace mapping (``nsmap``) in centralized location.
        */
        let lst = xpath.select(xpath_str, this.xmlElement);
        function *iter() {
            for (let item of lst){
                yield bindElement(item);
            }
        }
        return iter();
    }
    get _nsptag() {
        return new NamespacePrefixedTag(this.xmlElement.tagName);
    }
}

function OxmlElement(nsptag_str, attrs=null) {//, nsdecls=null
    let elem = createElement(nsptag_str);
    if (attrs)
        for(let [key, value] of Object.entries(attrs))
            elem[key] = value;
    return elem;
}

module.exports = {BaseOxmlElement, OptionalAttribute, RequiredAttribute,
    OneAndOnlyOne, ZeroOrOne, ZeroOrMore, OneOrMore,
    Choice, ZeroOrOneChoice, OxmlElement};
