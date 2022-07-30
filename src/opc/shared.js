/*
Objects shared by opc modules.
*/

class CaseInsensitiveDict extends Map {
    /*
    Mapping type that behaves like dict except that it matches without respect
    to the case of the key. E.g. cid['A'] == cid['a']. Note this is not
    general-purpose, just complete enough to satisfy opc package needs. It
    assumes str keys, and that it is created empty; keys passed in constructor
    are not accounted for
    */
    has(key) {
        return super.has(key.toLowerCase());
    }
    get(key) {
        return super.get(key.toLowerCase());
    }
    set(key, value) {
        return super.set(key.toLowerCase(), value);
    }
}
//function lazyproperty(f) {
    /*
    @lazyprop decorator. Decorated method will be called only on first access
    to calculate a cached property value. After that, the cached value is
    returned.
    */

//}

module.exports = {CaseInsensitiveDict};
