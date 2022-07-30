/*
Provides Python 2/3 compatibility objects*/

function is_string(obj) {
    /*
    Return True if *obj* is a string, False otherwise.
    */
    return (typeof obj === "string") || (obj instanceof String);
}


module.exports = {is_string}
