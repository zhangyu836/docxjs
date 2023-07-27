//
let {CT, RT} = require('./constants');
let {CorePropertiesPart} = require('./parts/coreprops');
let {DocumentPart} = require('../parts/document');
let {FooterPart, HeaderPart} = require('../parts/hdrftr');
let {ImagePart} = require('../parts/image');
let {NumberingPart} = require('../parts/numbering');
let {SettingsPart} = require('../parts/settings');
let {StylesPart} = require('../parts/styles');
let {ThemePart} = require('../parts/theme');
let {Part} = require('./part');


function part_class_selector(content_type, reltype) {
    if (reltype === RT.IMAGE) {
        return ImagePart;
    }
    return null;
}
//PartFactory.part_class_selector = part_class_selector;
let part_type_for = {};
part_type_for[CT.OPC_CORE_PROPERTIES] = CorePropertiesPart;
part_type_for[CT.WML_DOCUMENT_MAIN] = DocumentPart;
part_type_for[CT.WML_TEMPLATE_MAIN] = DocumentPart;
part_type_for[CT.WML_FOOTER] = FooterPart;
part_type_for[CT.WML_HEADER] = HeaderPart;
part_type_for[CT.WML_NUMBERING] = NumberingPart;
part_type_for[CT.WML_SETTINGS] = SettingsPart;
part_type_for[CT.WML_STYLES] = StylesPart;
part_type_for[CT.OFC_THEME] = ThemePart;

let default_part_type = Part;
function _part_cls_for(content_type)  {
    /*
    Return the custom part class registered for *content_type*, or the
    default part class if no custom class is registered for
    *content_type*.
    */
    if (part_type_for.hasOwnProperty(content_type)) {
        return part_type_for[content_type];
    }
    return default_part_type;
}
function PartFactory(partname, content_type, reltype, blob, _package)  {
    /*
    Provides a way for client code to specify a subclass of |Part| to be
    constructed by |Unmarshaller| based on its content type and/or a custom
    callable. Setting ``PartFactory.part_class_selector`` to a callable
    object will cause that object to be called with the parameters
    ``content_type, reltype``, once for each part in the package. If the
    callable returns an object, it is used as the class for that part. If it
    returns |None|, part class selection falls back to the content type map
    defined in ``part_type_for``. If no class is returned from
    either of these, the class contained in ``PartFactory.default_part_type``
    is used to construct the part, which is by default ``opc.package.Part``.
    */
    //this.part_class_selector = null;

    let PartClass;
    PartClass = part_class_selector(content_type, reltype);
    if (PartClass === null) {
        PartClass = _part_cls_for(content_type);
    }
    return PartClass.load(partname, content_type, blob, _package);
}

PartFactory._part_cls_for = _part_cls_for;
PartFactory.part_type_for = part_type_for;

module.exports = {PartFactory};
