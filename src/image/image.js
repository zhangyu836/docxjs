
let fs = require('fs');
let path = require('path')
let {is_string} = require('../compat');
//let {UnrecognizedImageError} = require('./exceptions');
let {Emu, Inches} = require('../shared');
let sha1 = require('shasum-object');
/*
Provides objects that can characterize image streams as to content type and
size, as a required step in including them in a document.*/
class Image  {
    /*
    Graphical image stream such as JPEG, PNG, or GIF with properties and
    methods required by ImagePart.
    */
    constructor(blob, filename, image_header) {
        this._blob = blob;
        this._filename = filename;
        this._image_header = image_header;
    }
    static from_blob(blob) {
        /*
        Return a _new |Image| subclass instance parsed from the image binary
        contained in *blob*.
        */
        return this._from_stream(blob);
    }
    static from_file(image_descriptor) {
        /*
        Return a _new |Image| subclass instance loaded from the image file
        identified by *image_descriptor*, a path or file-like object.
        */
        let filename, blob;
        let _path = image_descriptor;
        blob = fs.readFileSync(_path)
        if( is_string(image_descriptor)){
            filename = path.parse(_path).base
        }  else {
            filename = null;
        }
        return this._from_stream(blob, filename)
    }
    get blob() {
        /*
        The bytes of the image 'file'
        */
        return this._blob;
    }
    get content_type() {
        /*
        MIME content type for this image, e.g. ``'image/jpeg'`` for a JPEG
        image
        */
        //return this._image_header.content_type;
        for(let [,type] of Object.entries(MIME_TYPE))
            if(type.includes(this.ext))
                return type;
    }
    get ext() {
        /*
        The file extension for the image. If an actual one is available from
        a load filename it is used. Otherwise a canonical extension is
        assigned based on the content type. Does not contain the leading
        period, e.g. 'jpg', not '.jpg'.
        */
        return path.parse(this._filename).ext.slice(1);
    }
    get filename() {
        /*
        Original image file name, if loaded from disk, or a generic filename
        if loaded from an anonymous stream.
        */
        return this._filename;
    }
    get px_width() {
        /*
        The horizontal pixel dimension of the image
        */
        return this._image_header.px_width;
    }
    get px_height() {
        /*
        The vertical pixel dimension of the image
        */
        return this._image_header.px_height;
    }
    get horz_dpi() {
        /*
        Integer dots per inch for the width of this image. Defaults to 72
        when not present in the file, as is often the case.
        */
        return this._image_header.horz_dpi;
    }
    get vert_dpi() {
        /*
        Integer dots per inch for the height of this image. Defaults to 72
        when not present in the file, as is often the case.
        */
        return this._image_header.vert_dpi;
    }
    get width() {
        /*
        A |Length| value representing the native width of the image,
        calculated from the values of `px_width` and `horz_dpi`.
        */
        return new Inches(this.px_width / this.horz_dpi);
    }
    get height() {
        /*
        A |Length| value representing the native height of the image,
        calculated from the values of `px_height` and `vert_dpi`.
        */
        return new Inches(this.px_height / this.vert_dpi);
    }
    scaled_dimensions(width = null, height = null) {
        /*
        Return a (cx, cy) 2-tuple representing the native dimensions of this
        image scaled by applying the following rules to *width* and *height*.
        If both *width* and *height* are specified, the return value is
        (*width*, *height*); no scaling is performed. If only one is
        specified, it is used to compute a scaling factor that is then
        applied to the unspecified dimension, preserving the aspect ratio of
        the image. If both *width* and *height* are |None|, the native
        dimensions are returned. The native dimensions are calculated using
        the dots-per-inch (dpi) value embedded in the image, defaulting to 72
        dpi if no value is specified, as is often the case. The returned
        values are both |Length| objects.
        */
        let scaling_factor;
        if ((width === null) && (height === null)) {
            return [this.width, this.height];
        }
        if (width === null) {
            scaling_factor = Math.fround(height) / this.height;
            width = Math.round(this.width * scaling_factor);
        }
        if (height === null) {
            scaling_factor = Math.fround(width) / this.width;
            height = Math.round(this.height * scaling_factor);
        }
        return [new Emu(width), new Emu(height)];
    }
    get sha1() {
        /*
        SHA1 hash digest of the image blob
        */
        if(! this._sha1)
            this._sha1 = sha1(this._blob);
        return this._sha1;
    }
    static _from_stream(blob, filename = null) {
        /*
        Return an instance of the |Image| subclass corresponding to the
        format of the image in *stream*.
        */
        let image_header;
        image_header = new ImageHeader(3840, 5120, 72, 72);
        if (filename === null) {
            filename = `image.${image_header.default_ext}`;
        }
        return new this(blob, filename, image_header);
    }
}

class ImageHeader  {
    /*
    Base class for image header subclasses like |Jpeg| and |Tiff|.
    */
    constructor(px_width, px_height, horz_dpi, vert_dpi) {
        this._px_width = px_width;
        this._px_height = px_height;
        this._horz_dpi = horz_dpi;
        this._vert_dpi = vert_dpi;
    }

    get default_ext() {
        /*
        Default filename extension for images of this type. An abstract
        property definition, must be implemented by all subclasses.
        */
        return 'png'
    }

    get px_width() {
        /*
        The horizontal pixel dimension of the image
        */
        return this._px_width;
    }
    get px_height() {
        /*
        The vertical pixel dimension of the image
        */
        return this._px_height;
    }
    get horz_dpi() {
        /*
        Integer dots per inch for the width of this image. Defaults to 72
        when not present in the file, as is often the case.
        */
        return this._horz_dpi;
    }
    get vert_dpi() {
        /*
        Integer dots per inch for the height of this image. Defaults to 72
        when not present in the file, as is often the case.
        */
        return this._vert_dpi;
    }
}

let MIME_TYPE = {
    /*
    Image content types
    */
    BMP : 'image/bmp',
    GIF : 'image/gif',
    JPEG : 'image/jpeg',
    PNG : 'image/png',
    TIFF : 'image/tiff',
}


module.exports = {Image};
