
/* Theme object, providing access to document-level theme */
let {ElementProxy} = require('./shared');


class Theme extends ElementProxy {
    /*Provides access to document-level theme for a document.

    Accessed using the :attr:`.Document.theme` property.
    */
    get majorFont() {
        let {themeElements} = this.element;
        if(themeElements){
            let {fontScheme} = themeElements;
            if(fontScheme)
                return fontScheme.majorFont;
        }

    }
    get minorFont() {
        let {themeElements} = this.element;
        if(themeElements){
            let {fontScheme} = themeElements;
            if(fontScheme)
                return fontScheme.minorFont;
        }
    }
}


module.exports = {Theme};
