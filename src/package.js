
/* WordprocessingML Package class and related objects */

let {Image} = require('./image/image');
let {RT} = require('./opc/constants');
let {OpcPackage} = require('./opc/package');
let {PackURI} = require('./opc/packuri');
let {ImagePart} = require('./parts/image');



class Package extends OpcPackage {
    /* Customizations specific to a WordprocessingML package */
    after_unmarshal() {
        /*
	Called by loading code after all parts and relationships have been loaded.

        This method affords the opportunity for any required post-processing.
        */
        this._gather_image_parts();
    }
    get_or_add_image_part(image_descriptor) {
        /*
	Return |ImagePart| containing image specified by *image_descriptor*.

        The image-part is newly created if a matching one is not already present in the
        collection.
        */
        return this.image_parts.get_or_add_image_part(image_descriptor);
    }
    get image_parts() {
        /* |ImageParts| collection object for this package. */
        if(!this._image_parts) this._image_parts = new ImageParts();
        return this._image_parts;
    }
    _gather_image_parts() {
        /* Load the image part collection with all the image parts in package. */
        for (let rel of this.iter_rels()) {
            if (rel.is_external) {
                continue;
            }
            if (rel.reltype !== RT.IMAGE) {
                continue;
            }
            if (this.image_parts.includes(rel.target_part)) {
                continue;
            }
            this.image_parts.push(rel.target_part);
        }
    }
}

class ImageParts {
    /* Collection of |ImagePart| objects corresponding to images in the package */
    constructor() {
        this._image_parts = [];
        this[Symbol.iterator] = this.iter;
    }
    includes(item) {
        return this._image_parts.includes(item);
    }
    *iter() {
        for (let part of this._image_parts)
            yield part
    }
    get length(){
        return this._image_parts.length;
    }
    push(item) {
        this._image_parts.push(item);
    }
    get_or_add_image_part(image_descriptor) {
        /*
	Return |ImagePart| object containing image identified by *image_descriptor*.

        The image-part is newly created if a matching one is not present in the
        collection.
        */
        let image, matching_image_part;
        image = Image.from_file(image_descriptor);
        matching_image_part = this._get_by_sha1(image.sha1);
        if (matching_image_part !== null) {
            return matching_image_part;
        }
        return this._add_image_part(image);
    }

    _add_image_part(image) {
        /*
        Return an |ImagePart| instance newly created from image and appended
        to the collection.
        */
        let image_part, partname;
        partname = this._next_image_partname(image.ext);
        image_part = ImagePart.from_image(image, partname);
        this.push(image_part);
        return image_part;
    }

    _get_by_sha1(sha1) {
        /*
        Return the image part in this collection having a SHA1 hash matching
        *sha1*, or |None| if not found.
        */
        for (let image_part of this._image_parts) {
            if (image_part.sha1 === sha1) {
                return image_part;
            }
        }
        return null;
    }

    _next_image_partname(ext) {
        /*
        The next available image partname, starting from
        ``/word/media/image1.{ext}`` where unused numbers are reused. The
        partname is unique by number, without regard to the extension. *ext*
        does not include the leading period.
        */
        let used_numbers = [];

        function image_partname(n) {
            return new PackURI(`/word/media/image${n}.${ext}`);
        }
        for (let image_part of this._image_parts) {
            used_numbers.push(image_part.partname.idx);
        }
        for (let n = 1; n < this.length + 1; n++) {
            if (!used_numbers.includes(n)) return image_partname(n);
        }
        return image_partname(this.length + 1);
    }
}

module.exports = {Package, ImageParts};
