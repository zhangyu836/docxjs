/*
The :mod:`pptx.packaging` module coheres around the concerns of reading and
writing presentations to and from a .pptx file.
*/

class CoreProperties  {
    /*
    Corresponds to part named ``/docProps/core.xml``, containing the core
    document properties for this document package.
    */
    constructor(element) {
        this._element = element;
    }
    get author() {
        return this._element.author_text;
    }
    set author(value) {
        this._element.author_text = value;
    }
    get category() {
        return this._element.category_text;
    }
    set category(value) {
        this._element.category_text = value;
    }
    get comments() {
        return this._element.comments_text;
    }
    set comments(value) {
        this._element.comments_text = value;
    }
    get content_status() {
        return this._element.contentStatus_text;
    }
    set content_status(value) {
        this._element.contentStatus_text = value;
    }
    get created() {
        return this._element.created_datetime;
    }
    set created(value) {
        this._element.created_datetime = value;
    }
    get identifier() {
        return this._element.identifier_text;
    }
    set identifier(value) {
        this._element.identifier_text = value;
    }
    get keywords() {
        return this._element.keywords_text;
    }
    set keywords(value) {
        this._element.keywords_text = value;
    }
    get language() {
        return this._element.language_text;
    }
    set language(value) {
        this._element.language_text = value;
    }
    get last_modified_by() {
        return this._element.lastModifiedBy_text;
    }
    set last_modified_by(value) {
        this._element.lastModifiedBy_text = value;
    }
    get last_printed() {
        return this._element.lastPrinted_datetime;
    }
    set last_printed(value) {
        this._element.lastPrinted_datetime = value;
    }
    get modified() {
        return this._element.modified_datetime;
    }
    set modified(value) {
        this._element.modified_datetime = value;
    }
    get revision() {
        return this._element.revision_number;
    }
    set revision(value) {
        this._element.revision_number = value;
    }
    get subject() {
        return this._element.subject_text;
    }
    set subject(value) {
        this._element.subject_text = value;
    }
    get title() {
        return this._element.title_text;
    }
    set title(value) {
        this._element.title_text = value;
    }
    get version() {
        return this._element.version_text;
    }
    set version(value) {
        this._element.version_text = value;
    }
}

module.exports = {CoreProperties};
