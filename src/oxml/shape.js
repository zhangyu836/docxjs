/*
Custom element classes for shape-related elements like ``<w:inline>``
*/
let {parse_xml} = require('./xmlhandler');
let {nsdecls} = require('./ns');
let {ST_Coordinate, ST_DrawingElementId, ST_PositiveCoordinate, ST_RelationshipId,
    XsdString, XsdToken} = require('./simpletypes');
let {BaseOxmlElement, OneAndOnlyOne, OptionalAttribute,
    RequiredAttribute, ZeroOrOne} = require('./xmlchemy');


class CT_Blip extends BaseOxmlElement {
    /*
    ``<a:blip>`` element, specifies image source and adjustments such as
    alpha and tint.
    */
    embed = new OptionalAttribute('r:embed', ST_RelationshipId);
    link = new OptionalAttribute('r:link', ST_RelationshipId);
}

class CT_BlipFillProperties extends BaseOxmlElement {
    /*
    ``<pic:blipFill>`` element, specifies picture properties
    */
    blip = new ZeroOrOne('a:blip', [
        'a:srcRect', 'a:tile', 'a:stretch']);
}

class CT_GraphicalObject extends BaseOxmlElement {
    /*
    ``<a:graphic>`` element, container for a DrawingML object
    */
    graphicData = new OneAndOnlyOne('a:graphicData');
}

class CT_GraphicalObjectData extends BaseOxmlElement {
    /*
    ``<a:graphicData>`` element, container for the XML of a DrawingML object
    */
    pic = new ZeroOrOne('pic:pic');
    uri = new RequiredAttribute('uri', XsdToken);
}

class CT_Inline extends BaseOxmlElement {
    /*
    ``<w:inline>`` element, container for an inline shape.
    */
    extent = new OneAndOnlyOne('wp:extent');
    docPr = new OneAndOnlyOne('wp:docPr');
    graphic = new OneAndOnlyOne('a:graphic');
    static _new(cx, cy, shape_id, pic) {
        /*
        Return a new ``<wp:inline>`` element populated with the values passed
        as parameters.
        */
        let inline;
        inline = parse_xml(this._inline_xml());
        inline.extent.cx = cx;
        inline.extent.cy = cy;
        inline.docPr.id = shape_id;
        inline.docPr.name = `Picture ${shape_id}`;
        inline.graphic.graphicData.uri = "http://schemas.openxmlformats.org/drawingml/2006/picture";
        inline.graphic.graphicData._insert_pic(pic);
        return inline;
    }
    static new_pic_inline(shape_id, rId, filename, cx, cy) {
        /*
        Return a new `wp:inline` element containing the `pic:pic` element
        specified by the argument values.
        */
        let inline, pic, pic_id;
        pic_id = 0;  // Word doesn't seem to use this, but does not omit it
        pic = CT_Picture._new(pic_id, filename, rId, cx, cy);
        inline = this._new(cx, cy, shape_id, pic);
        inline.graphic.graphicData._insert_pic(pic);
        return inline;
    }
    static _inline_xml() {
        return `<wp:inline ${nsdecls('wp', 'a', 'pic', 'r')}>\n` +
            '  <wp:extent cx="914400" cy="914400"/>\n' +
            '  <wp:docPr id="666" name="unnamed"/>\n' +
            '  <wp:cNvGraphicFramePr>\n' +
            '    <a:graphicFrameLocks noChangeAspect="1"/>\n' +
            '  </wp:cNvGraphicFramePr>\n' +
            '  <a:graphic>\n' +
            '    <a:graphicData uri="URI not set"/>\n' +
            '  </a:graphic>\n' +
            '</wp:inline>';
    }
}

class CT_NonVisualDrawingProps extends BaseOxmlElement {
    /*
    Used for ``<wp:docPr>`` element, and perhaps others. Specifies the id and
    name of a DrawingML drawing.
    */
    id = new RequiredAttribute('id', ST_DrawingElementId);
    name = new RequiredAttribute('name', XsdString);
}

class CT_NonVisualPictureProperties extends BaseOxmlElement {
    /*
    ``<pic:cNvPicPr>`` element, specifies picture locking and resize
    behaviors.
    */
}
class CT_Picture extends BaseOxmlElement {
    /*
    ``<pic:pic>`` element, a DrawingML picture
    */
    nvPicPr = new OneAndOnlyOne('pic:nvPicPr');
    blipFill = new OneAndOnlyOne('pic:blipFill');
    spPr = new OneAndOnlyOne('pic:spPr');
    static _new(pic_id, filename, rId, cx, cy) {
        /*
        Return a new ``<pic:pic>`` element populated with the minimal
        contents required to define a viable picture element, based on the
        values passed as parameters.
        */
        let pic;
        pic = parse_xml(this._pic_xml());
        pic.nvPicPr.cNvPr.id = pic_id;
        pic.nvPicPr.cNvPr.name = filename;
        pic.blipFill.blip.embed = rId;
        pic.spPr.cx = cx;
        pic.spPr.cy = cy;
        return pic;
    }
    static _pic_xml() {
        return `<pic:pic ${nsdecls('pic', 'a', 'r')}>\n` +
            '  <pic:nvPicPr>\n' +
        '    <pic:cNvPr id="666" name="unnamed"/>\n' +
        '    <pic:cNvPicPr/>\n' +
        '  </pic:nvPicPr>\n' +
        '  <pic:blipFill>\n' +
        '    <a:blip/>\n' +
        '    <a:stretch>\n' +
        '      <a:fillRect/>\n' +
        '    </a:stretch>\n' +
        '  </pic:blipFill>\n' +
        '  <pic:spPr>\n' +
        '    <a:xfrm>\n' +
        '      <a:off x="0" y="0"/>\n' +
        '      <a:ext cx="914400" cy="914400"/>\n' +
        '    </a:xfrm>\n' +
        '    <a:prstGeom prst="rect"/>\n' +
        '  </pic:spPr>\n' +
        '</pic:pic>'
    }
}

class CT_PictureNonVisual extends BaseOxmlElement {
    /*
    ``<pic:nvPicPr>`` element, non-visual picture properties
    */
    cNvPr = new OneAndOnlyOne('pic:cNvPr');
}

class CT_Point2D extends BaseOxmlElement {
    /*
    Used for ``<a:off>`` element, and perhaps others. Specifies an x, y
    coordinate (point).
    */
    x = new RequiredAttribute('x', ST_Coordinate);
    y = new RequiredAttribute('y', ST_Coordinate);
}

class CT_PositiveSize2D extends BaseOxmlElement {
    /*
    Used for ``<wp:extent>`` element, and perhaps others later. Specifies the
    size of a DrawingML drawing.
    */
    cx = new RequiredAttribute('cx', ST_PositiveCoordinate);
    cy = new RequiredAttribute('cy', ST_PositiveCoordinate);
}

class CT_PresetGeometry2D extends BaseOxmlElement {
    /*
    ``<a:prstGeom>`` element, specifies an preset autoshape geometry, such
    as ``rect``.
    */
}
class CT_RelativeRect extends BaseOxmlElement {
    /*
    ``<a:fillRect>`` element, specifying picture should fill containing
    rectangle shape.
    */
}
class CT_ShapeProperties extends BaseOxmlElement {
    /*
    ``<pic:spPr>`` element, specifies size and shape of picture container.
    */
    xfrm = new ZeroOrOne('a:xfrm', [
        'a:custGeom', 'a:prstGeom', 'a:ln', 'a:effectLst', 'a:effectDag',
            'a:scene3d', 'a:sp3d', 'a:extLst'])
    get cx() {
        /*
        Shape width as an instance of Emu, or None if not present.
        */
        let xfrm;
        xfrm = this.xfrm;
        if (xfrm === null) {
            return null;
        }
        return xfrm.cx;
    }
    set cx(value) {
        let xfrm;
        xfrm = this.get_or_add_xfrm();
        xfrm.cx = value;
    }
    get cy() {
        /*
        Shape height as an instance of Emu, or None if not present.
        */
        let xfrm;
        xfrm = this.xfrm;
        if (xfrm === null) {
            return null;
        }
        return xfrm.cy;
    }
    set cy(value) {
        let xfrm;
        xfrm = this.get_or_add_xfrm();
        xfrm.cy = value;
    }
}
class CT_StretchInfoProperties extends BaseOxmlElement {
    /*
    ``<a:stretch>`` element, specifies how picture should fill its containing
    shape.
    */
}
class CT_Transform2D extends BaseOxmlElement {
    /*
    ``<a:xfrm>`` element, specifies size and shape of picture container.
    */
    off = new ZeroOrOne('a:off', ['a:ext']);
    ext = new ZeroOrOne('a:ext');
    get cx() {
        let ext;
        ext = this.ext;
        if (ext === null) {
            return null;
        }
        return ext.cx;
    }
    set cx(value) {
        let ext;
        ext = this.get_or_add_ext();
        ext.cx = value;
    }
    get cy() {
        let ext;
        ext = this.ext;
        if (ext === null) {
            return null;
        }
        return ext.cy;
    }
    set cy(value) {
        let ext;
        ext = this.get_or_add_ext();
        ext.cy = value;
    }
}

module.exports = {CT_Blip, CT_BlipFillProperties, CT_GraphicalObject, CT_GraphicalObjectData,
    CT_Inline, CT_NonVisualDrawingProps, CT_Picture, CT_PictureNonVisual, CT_Point2D,
    CT_PositiveSize2D, CT_ShapeProperties, CT_Transform2D};
