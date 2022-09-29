/*
Objects related to shapes, visual objects that appear on the drawing layer of
a document.
*/

let {WD_INLINE_SHAPE} = require('./enum/shape');
let {nsmap} = require('./oxml/ns');
let {Parented} = require('./shared');
let {IndexError} = require('./exceptions');
let {getIndexedAccess} = require('./shared');
class InlineShapes extends Parented {
    /*
    Sequence of |InlineShape| instances, supporting len(), iteration, and
    indexed access.
    */
    constructor(body_elm, parent) {
        super(parent);
        this._body = body_elm;
        this[Symbol.iterator] = this.iter;
        return getIndexedAccess(this);
    }
    getitem(idx) {
        /*
        Provide indexed access, e.g. 'inline_shapes[idx]'
        */
        let inline, msg;
        inline = this._inline_lst[idx];
        if (!inline) {
            msg = `inline shape index [${idx}] out of range`;
            throw new IndexError(msg);
        }
        return new InlineShape(inline, this);
    }
    *iter() {
        for(let  inline of this._inline_lst){
            yield new InlineShape(inline, this)
        }
    }
    get length() {
        return this._inline_lst.length;
    }
    get _inline_lst() {
        let body, xpath;
        body = this._body;
        xpath = "//w:p/w:r/w:drawing/wp:inline";
        return body.xpath(xpath);
    }
}
class InlineShape extends Parented {
    /*
    Proxy for an ``<wp:inline>`` element, representing the container for an
    inline graphical object.
    */
    constructor(inline, parent) {
        super(parent);
        this._inline = inline;
    }
    get height() {
        /*
        Read/write. The display height of this inline shape as an |Emu|
        instance.
        */
        return this._inline.extent.cy;
    }
    set height(cy) {
        this._inline.extent.cy = cy;
        this._inline.graphic.graphicData.pic.spPr.cy = cy;
    }
    get target_part(){
        if(this.type===WD_INLINE_SHAPE.PICTURE){
            let rId = this._inline.graphic.graphicData.pic.blipFill.blip.embed;
            let ref = this.part.get_rel_by_rid(rId);
            return ref.target_part;
        }
    }
    get type() {
        /*
        The type of this inline shape as a member of
        ``docx.enum.shape.WD_INLINE_SHAPE``, e.g. ``LINKED_PICTURE``.
        Read-only.
        */
        let blip, graphicData, uri;
        graphicData = this._inline.graphic.graphicData;
        uri = graphicData.uri;
        if (uri === nsmap["pic"]) {
            blip = graphicData.pic.blipFill.blip;
            if (blip.link !== null) {
                return WD_INLINE_SHAPE.LINKED_PICTURE;
            }
            return WD_INLINE_SHAPE.PICTURE;
        }
        if (uri === nsmap["c"]) {
            return WD_INLINE_SHAPE.CHART;
        }
        if (uri === nsmap["dgm"]) {
            return WD_INLINE_SHAPE.SMART_ART;
        }
        return WD_INLINE_SHAPE.NOT_IMPLEMENTED;
    }
    get width() {
        /*
        Read/write. The display width of this inline shape as an |Emu|
        instance.
        */
        return this._inline.extent.cx;
    }
    set width(cx) {
        this._inline.extent.cx = cx;
        this._inline.graphic.graphicData.pic.spPr.cx = cx;
    }
}

module.exports = {InlineShape, InlineShapes};
