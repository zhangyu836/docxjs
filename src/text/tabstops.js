/*
Tabstop-related proxy types.
*/
let {ElementProxy} = require('../shared');
let {WD_TAB_ALIGNMENT, WD_TAB_LEADER} = require('../enum/text');
let {IndexError} = require('../exceptions');
let {getIndexedAccess} = require('../shared');


class TabStops extends ElementProxy {
    /*
    A sequence of |TabStop| objects providing access to the tab stops of
    a paragraph or paragraph style. Supports iteration, indexed access, del,
    and len(). It is accessed using the :attr:`~.ParagraphFormat.tab_stops`
    property of ParagraphFormat; it is not intended to be constructed
    directly.
    */
    constructor(element) {
        super(element, null);
        this._pPr = element;
        this[Symbol.iterator] = this.iter;
        return getIndexedAccess(this);
    }
    delitem(idx) {
        /*
        Remove the tab at offset *idx* in this sequence.
        */
        let tabs;
        tabs = this._pPr.tabs;
        if (tabs === null)
            throw new IndexError("tab index out of range");
        let tab_lst = tabs.tab_lst;
        if(idx>=tab_lst.length)
            throw new IndexError("tab index out of range");
        let tab = tab_lst[idx];
        tabs.remove(tab);
        if (tabs.tab_lst.length === 0) {
            this._pPr.remove(tabs);
        }
    }
    getitem(idx) {
        /*
        Enables list-style access by index.
        */
        let tab, tabs;
        tabs = this._pPr.tabs;
        if (tabs === null) {
            throw new IndexError("TabStops object is empty");
        }
        tab = tabs.tab_lst[idx];
        return new TabStop(tab);
    }
    *iter() {
        /*
        Generate a TabStop object for each of the w:tab elements, in XML
        document order.
        */
        let tabs;
        tabs = this._pPr.tabs;
        if (tabs !== null) {
            for (let tab of tabs.tab_lst) {
                yield new TabStop(tab);
            }
        }
    }
    get length() {
        let tabs;
        tabs = this._pPr.tabs;
        if (tabs === null) {
            return 0;
        }
        return tabs.tab_lst.length;
    }
    add_tab_stop(position, alignment = WD_TAB_ALIGNMENT.LEFT, leader = WD_TAB_LEADER.SPACES) {
        /*
        Add a new tab stop at *position*, a |Length| object specifying the
        location of the tab stop relative to the paragraph edge. A negative
        *position* value is valid and appears in hanging indentation. Tab
        alignment defaults to left, but may be specified by passing a member
        of the :ref:`WdTabAlignment` enumeration as *alignment*. An optional
        leader character can be specified by passing a member of the
        :ref:`WdTabLeader` enumeration as *leader*.
        */
        let tab, tabs;
        tabs = this._pPr.get_or_add_tabs();
        tab = tabs.insert_tab_in_order(position, alignment, leader);
        return new TabStop(tab);
    }
    clear_all() {
        /*
        Remove all custom tab stops.
        */
        this._pPr._remove_tabs();
    }
}

class TabStop extends ElementProxy {
    /*
    An individual tab stop applying to a paragraph or style. Accessed using
    list semantics on its containing |TabStops| object.
    */
    constructor(element) {
        super(element, null);
        this._tab = element;
    }
    get alignment() {
        /*
        A member of :ref:`WdTabAlignment` specifying the alignment setting
        for this tab stop. Read/write.
        */
        return this._tab.val;
    }
    set alignment(value) {
        this._tab.val = value;
    }
    get leader() {
        /*
        A member of :ref:`WdTabLeader` specifying a repeating character used
        as a "leader", filling in the space spanned by this tab. Assigning
        |None| produces the same result as assigning `WD_TAB_LEADER.SPACES`.
        Read/write.
        */
        return this._tab.leader;
    }
    set leader(value) {
        this._tab.leader = value;
    }
    get position() {
        /*
        A |Length| object representing the distance of this tab stop from the
        inside edge of the paragraph. May be positive or negative.
        Read/write.
        */
        return this._tab.pos;
    }
    set position(value) {
        let tab, tabs;
        tab = this._tab;
        tabs = tab.getparent();
        this._tab = tabs.insert_tab_in_order(value, tab.val, tab.leader);
        tabs.remove(tab);
    }
}


module.exports = {TabStop, TabStops}
