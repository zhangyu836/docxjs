let {Run} = require('./run');
let {Parented} = require('../shared');

class Hyperlink extends Parented {
    /*
    Proxy object wrapping ``<w:hyperlink>`` element.
    */
    constructor(hyperlink, parent) {
        super(parent);
        this._hyperlink = this._element = hyperlink;
    }
    add_run(text = null, style = null) {
        let r, run;
        r = this._hyperlink.add_r();
        run = new Run(r, this);
        if (text) {
            run.text = text;
        }
        if (style) {
            run.style = style;
        }
        return run;
    }
    get runs() {
        let a = [];
        for(let r of this._hyperlink.r_lst){
            a.push(new Run(r, this));
        }
        return a;
    }
    runIter() {
        let runs = this._hyperlink.findallIter("w:r");
        let parent = this;
        function *iter() {
            for(let run of runs) {
                yield new Run(run, parent);
            }
        }
        return iter();
    }
    get target_ref(){
        let rId = this._hyperlink.rId;
        let rel = this.part.get_rel_by_rid(rId);
        return rel.target_ref;
    }
    get text() {
        let text;
        text = "";
        for (let run of this.runs) {
            text += run.text;
        }
        return text;
    }
    set text(text) {
        this._hyperlink.clear();
        this.add_run(text);
    }
}

module.exports = {Hyperlink};
