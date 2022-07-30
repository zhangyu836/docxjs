
/*Custom element classes related to document settings
*/
let {BaseOxmlElement, ZeroOrOne} = require('./xmlchemy');

let _tag_seq = [
    "w:writeProtection", "w:view", "w:zoom", "w:removePersonalInformation",
        "w:removeDateAndTime", "w:doNotDisplayPageBoundaries",
        "w:displayBackgroundShape", "w:printPostScriptOverText",
        "w:printFractionalCharacterWidth", "w:printFormsData", "w:embedTrueTypeFonts",
        "w:embedSystemFonts", "w:saveSubsetFonts", "w:saveFormsData", "w:mirrorMargins",
        "w:alignBordersAndEdges", "w:bordersDoNotSurroundHeader",
        "w:bordersDoNotSurroundFooter", "w:gutterAtTop", "w:hideSpellingErrors",
        "w:hideGrammaticalErrors", "w:activeWritingStyle", "w:proofState",
        "w:formsDesign", "w:attachedTemplate", "w:linkStyles",
        "w:stylePaneFormatFilter", "w:stylePaneSortMethod", "w:documentType",
        "w:mailMerge", "w:revisionView", "w:trackRevisions", "w:doNotTrackMoves",
        "w:doNotTrackFormatting", "w:documentProtection", "w:autoFormatOverride",
        "w:styleLockTheme", "w:styleLockQFSet", "w:defaultTabStop", "w:autoHyphenation",
        "w:consecutiveHyphenLimit", "w:hyphenationZone", "w:doNotHyphenateCaps",
        "w:showEnvelope", "w:summaryLength", "w:clickAndTypeStyle",
        "w:defaultTableStyle", "w:evenAndOddHeaders", "w:bookFoldRevPrinting",
        "w:bookFoldPrinting", "w:bookFoldPrintingSheets",
        "w:drawingGridHorizontalSpacing", "w:drawingGridVerticalSpacing",
        "w:displayHorizontalDrawingGridEvery", "w:displayVerticalDrawingGridEvery",
        "w:doNotUseMarginsForDrawingGridOrigin", "w:drawingGridHorizontalOrigin",
        "w:drawingGridVerticalOrigin", "w:doNotShadeFormData", "w:noPunctuationKerning",
        "w:characterSpacingControl", "w:printTwoOnOne", "w:strictFirstAndLastChars",
        "w:noLineBreaksAfter", "w:noLineBreaksBefore", "w:savePreviewPicture",
        "w:doNotValidateAgainstSchema", "w:saveInvalidXml", "w:ignoreMixedContent",
        "w:alwaysShowPlaceholderText", "w:doNotDemarcateInvalidXml",
        "w:saveXmlDataOnly", "w:useXSLTWhenSaving", "w:saveThroughXslt",
        "w:showXMLTags", "w:alwaysMergeEmptyNamespace", "w:updateFields",
        "w:hdrShapeDefaults", "w:footnotePr", "w:endnotePr", "w:compat", "w:docVars",
        "w:rsids", "m:mathPr", "w:attachedSchema", "w:themeFontLang",
        "w:clrSchemeMapping", "w:doNotIncludeSubdocsInStats",
        "w:doNotAutoCompressPictures", "w:forceUpgrade", "w:captions",
        "w:readModeInkLockDown", "w:smartTagType", "sl:schemaLibrary",
        "w:shapeDefaults", "w:doNotEmbedSmartTags", "w:decimalSymbol", "w:listSeparator"
]
class CT_Settings extends BaseOxmlElement {
    /* `w:settings` element, root element for the settings part */

    evenAndOddHeaders = new ZeroOrOne("w:evenAndOddHeaders", _tag_seq.slice(48));
    //del _tag_seq
    get evenAndOddHeaders_val() {
        /* value of `w:evenAndOddHeaders/@w:val` or |None| if not present. */
        let evenAndOddHeaders;
        evenAndOddHeaders = this.evenAndOddHeaders;
        if (evenAndOddHeaders === null) {
            return false;
        }
        return evenAndOddHeaders.val;
    }
    set evenAndOddHeaders_val(value) {
        if (value === null || value === false) {
            this._remove_evenAndOddHeaders();
        } else {
            this.get_or_add_evenAndOddHeaders().val = value;
        }
    }
}

module.exports = {CT_Settings};
