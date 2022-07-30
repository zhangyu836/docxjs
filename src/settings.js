
/* Settings object, providing access to document-level settings */
let {ElementProxy} = require('./shared');


class Settings extends ElementProxy {
    /*Provides access to document-level settings for a document.

    Accessed using the :attr:`.Document.settings` property.
    */
    get odd_and_even_pages_header_footer() {
        /*True if this document has distinct odd and even page headers and footers.

        Read/write.
        */
        return this._element.evenAndOddHeaders_val;
    }
    set odd_and_even_pages_header_footer(value) {
        this._element.evenAndOddHeaders_val = value;
    }
}


module.exports = {Settings};
