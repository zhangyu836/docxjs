/*
Sub-package module for docx.styles sub-package.*/

let internal_style_names = {
    'Caption': 'caption',
    'Footer': 'footer',
    'Header': 'header',
    'Heading 1': 'heading 1',
    'Heading 2': 'heading 2',
    'Heading 3': 'heading 3',
    'Heading 4': 'heading 4',
    'Heading 5': 'heading 5',
    'Heading 6': 'heading 6',
    'Heading 7': 'heading 7',
    'Heading 8': 'heading 8',
    'Heading 9': 'heading 9',
}
let ui_style_names = {};
for( let [key,value] of Object.entries(internal_style_names)) ui_style_names[value] = key;

class BabelFish {
    /*
    Translates special-case style names from UI name (e.g. Heading 1) to
    internal/styles.xml name (e.g. heading 1) and back.
    */
    static ui2internal(ui_style_name) {
        /*
        Return the internal style name corresponding to *ui_style_name*, such
        as 'heading 1' for 'Heading 1'.
        */
        return internal_style_names[ui_style_name] || ui_style_name;
    }
    static internal2ui(internal_style_name) {
        /*
        Return the user interface style name corresponding to
        *internal_style_name*, such as 'Heading 1' for 'heading 1'.
        */
        return ui_style_names[internal_style_name] || internal_style_name;
    }
}

module.exports = BabelFish;
