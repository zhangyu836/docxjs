/*
Exceptions used with python-docx.
*/
function NodeDocxError(message) {
    this.name = "NodeDocxError";
    this.message = message || "Custom error NodeDocxError";
    if ((typeof Error.captureStackTrace) === "function") {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(message).stack;
    }
}
NodeDocxError.prototype = Object.create(Error.prototype);
NodeDocxError.prototype.constructor = NodeDocxError;

function InvalidSpanError(message) {
    this.name = "InvalidSpanError";
    this.message = message || "Custom error InvalidSpanError";
    if ((typeof Error.captureStackTrace) === "function") {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(message).stack;
    }
}
InvalidSpanError.prototype = Object.create(Error.prototype);
InvalidSpanError.prototype.constructor = InvalidSpanError;

function InvalidXmlError(message) {
    this.name = "InvalidXmlError";
    this.message = message || "Custom error InvalidXmlError";
    if ((typeof Error.captureStackTrace) === "function") {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(message).stack;
    }
}
InvalidXmlError.prototype = Object.create(Error.prototype);
InvalidXmlError.prototype.constructor = InvalidXmlError;

function NotImplementedError(message) {
    this.name = "NotImplementedError";
    this.message = message || "Custom error NotImplementedError";
    if ((typeof Error.captureStackTrace) === "function") {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(message).stack;
    }
}
NotImplementedError.prototype = Object.create(Error.prototype);
NotImplementedError.prototype.constructor = NotImplementedError;

function XmlchemyError(message) {
    this.name = "XmlchemyError";
    this.message = message || "Custom error XmlchemyError";
    if ((typeof Error.captureStackTrace) === "function") {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(this.message).stack;
    }
}
XmlchemyError.prototype = Object.create(Error.prototype);
XmlchemyError.prototype.constructor = XmlchemyError;


function KeyError(message) {
    this.name = "KeyError";
    this.message = message || "Custom error KeyError";
    if (((typeof Error.captureStackTrace) === "function")) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(message).stack;
    }
}
KeyError.prototype = Object.create(Error.prototype);
KeyError.prototype.constructor = KeyError;

function IndexError(message) {
    this.name = "IndexError";
    this.message = message || "Custom error IndexError";
    if (((typeof Error.captureStackTrace) === "function")) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(message).stack;
    }
}
IndexError.prototype = Object.create(Error.prototype);
IndexError.prototype.constructor = IndexError;

function ValueError(message) {
    this.name = "ValueError";
    this.message = message || "Custom error ValueError";
    if (((typeof Error.captureStackTrace) === "function")) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(message).stack;
    }
}
ValueError.prototype = Object.create(Error.prototype);
ValueError.prototype.constructor = ValueError;

function OpcError(message) {
    this.name = "OpcError";
    this.message = message || "Custom error OpcError";
    if (((typeof Error.captureStackTrace) === "function")) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(message).stack;
    }
}
OpcError.prototype = Object.create(Error.prototype);
OpcError.prototype.constructor = OpcError;

function PackageNotFoundError(message) {
    this.name = "PackageNotFoundError";
    this.message = message || "Custom error PackageNotFoundError";
    if (((typeof Error.captureStackTrace) === "function")) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error(message).stack;
    }
}
PackageNotFoundError.prototype = Object.create(Error.prototype);
PackageNotFoundError.prototype.constructor = PackageNotFoundError;


module.exports = {NodeDocxError, InvalidXmlError, InvalidSpanError,
    NotImplementedError, XmlchemyError, KeyError, IndexError,
    ValueError, OpcError, PackageNotFoundError};
