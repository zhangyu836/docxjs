/* |BaseStoryPart| and related objects */

let {RT} = require('../opc/constants');
let {XmlPart} = require('../opc/part');
let {CT_Inline} = require('../oxml/shape');


class BaseStoryPart extends XmlPart {
    /*Base class for story parts.

    A story part is one that can contain textual content, such as the document-part and
    header or footer parts. These all share content behaviors like `.paragraphs`,
    `.add_paragraph()`, `.add_table()` etc.
    */
    get_or_add_image(image_descriptor) {
        /*Return (rId, image) pair for image identified by *image_descriptor*.

        *rId* is the str key (often like "rId7") for the relationship between this story
        part and the image part, reused if already present, newly created if not.
        *image* is an |Image| instance providing access to the properties of the image,
        such as dimensions and image type.
        */
        let image_part, rId;
        image_part = this._package.get_or_add_image_part(image_descriptor);
        rId = this.relate_to(image_part, RT.IMAGE);
        return [rId, image_part.image];
    }
    get_rel_by_rid(rId) {
        return this.rels.get(rId);
    }
    get_style(style_id, style_type) {
        /*Return the style in this document matching *style_id*.

        Returns the default style for *style_type* if *style_id* is |None| or does not
        match a defined style of *style_type*.
        */
        return this._document_part.get_style(style_id, style_type);
    }
    get_style_id(style_or_name, style_type) {
        /*Return str style_id for *style_or_name* of *style_type*.

        Returns |None| if the style resolves to the default style for *style_type* or if
        *style_or_name* is itself |None|. Raises if *style_or_name* is a style of the
        wrong type or names a style not present in the document.
        */
        return this._document_part.get_style_id(style_or_name, style_type);
    }
    new_pic_inline(image_descriptor, width, height) {
        /*Return a newly-created `w:inline` element.

        The element contains the image specified by *image_descriptor* and is scaled
        based on the values of *width* and *height*.
        */
        let cx, cy, filename, image, rId, shape_id;
        [rId, image] = this.get_or_add_image(image_descriptor);
        [cx, cy] = image.scaled_dimensions(width, height);
        [shape_id, filename] = [this.next_id, image.filename];
        return CT_Inline.new_pic_inline(shape_id, rId, filename, cx, cy);
    }
    get next_id() {
        /*Next available positive integer id value in this story XML document.

        The value is determined by incrementing the maximum existing id value. Gaps in
        the existing id sequence are not filled. The id attribute value is unique in the
        document, without regard to the element type it appears on.
        */
        let id_str_lst, used_ids;
        id_str_lst = this.element.xpath("//@id");
        used_ids = [];
        for (let id_str of id_str_lst) {
            let n = parseInt(id_str.value);
            if (n.toString()===id_str.value) {
                used_ids.push(n);
            }
        }
        if (used_ids.length===0) {
            return 1;
        }
        return Math.max(...used_ids) + 1;
    }
    _document_part() {
        /* |DocumentPart| object for this package. */
        if (! this.__document_part)
            this.__document_part = this._package.main_document_part;
        return this.__document_part;
    }
}

module.exports = {BaseStoryPart};
