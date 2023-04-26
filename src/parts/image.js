/*
The proxy class for an image part, and related objects.
*/

let sha1 = require('shasum-object');
let {Image} = require('../image/image');
let {Part} = require('../opc/part');
let {Emu, Inches} = require('../shared');
class ImagePart extends Part {
    /*
    An image part. Corresponds to the target part of a relationship with type
    RELATIONSHIP_TYPE.IMAGE.
    */
    constructor(partname, content_type, blob, image = null) {
        super(partname, content_type, blob);
        this._image = image;
    }
    get default_cx() {
        /*
        Native width of this image, calculated from its width in pixels and
        horizontal dots per inch (dpi).
        */
        let horz_dpi, px_width, width_in_inches;
        px_width = this.image.px_width;
        horz_dpi = this.image.horz_dpi;
        width_in_inches = px_width / horz_dpi;
        return new Inches(width_in_inches);
    }
    get default_cy() {
        /*
        Native height of this image, calculated from its height in pixels and
        vertical dots per inch (dpi).
        */
        let height_in_emu, horz_dpi, px_height;
        px_height = this.image.px_height;
        horz_dpi = this.image.horz_dpi;
        height_in_emu = 914400 * px_height / horz_dpi;
        return new Emu(height_in_emu);
    }
    get filename() {
        /*
        Filename from which this image part was originally created. A generic
        name, e.g. 'image.png', is substituted if no name is available, for
        example when the image was loaded from an unnamed stream. In that
        case a default extension is applied based on the detected MIME type
        of the image.
        */
        if (this._image !== null) {
            return this._image.filename;
        }
        return `image.${this.partname.ext}`;
    }
    static from_image(image, partname) {
        /*
        Return an |ImagePart| instance newly created from *image* and
        assigned *partname*.
        */
        return new this(partname, image.content_type, image.blob, image);
    }
    get image() {
        if (!this._image) {
            // noinspection JSValidateTypes
            this._image = Image.from_blob(this.blob);
        }
        return this._image;
    }
    static load(partname, content_type, blob, _package) {
        /*
        Called by ``docx.opc.package.PartFactory`` to load an image part from
        a package being opened by ``Document(...)`` call.
        */
        return new this(partname, content_type, blob);
    }
    get sha1() {
        /*
        SHA1 hash digest of the blob of this image part.
        */
        return sha1(this._blob);
    }
}

module.exports = {ImagePart};
