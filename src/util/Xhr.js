/**
 * @fileOverview Wrapper for XMLHttpRequest
 *
 * Right now this mostly encapsulates the jquery implementation of ajax but is
 * designed to later become independent or even use another library. For that reason
 * the $.ajax should never be returned or exposed.
 *
 * @author:	Sky Stebnicki, sky.stebnicki@aereus.com;
 * 			Copyright (c) 2015 Aereus Corporation. All rights reserved.
 */

// TODO: I believe we are now using fetch inside actions so this will become obsolete

var events = require("./events");
var log = require("../log");

/**
 * Class for handling XMLHttpRequests
 *
 * @constructor
 */
var Xhr = function() {};

/**
 * Handle to ajax xhr
 *
 * @private
 * @type {$.ajax}
 */
Xhr.prototype.ajax_ = null;

/**
 * What kind of data is being returned
 *
 * Can be xml, json, script, text, or html
 *
 * @private
 * @type {string}
 */
Xhr.prototype.returnType_ = "json";

/**
 * Determine whether or not we will send async or hang the UI until request returns (yikes)
 *
 * @private
 * @type {bool}
 */
Xhr.prototype.isAsync_ = true;

/**
 * Flag to inidicate if request is in progress
 *
 * @private
 * @type {bool}
 */
Xhr.prototype.isInProgress_ = false;

/**
 * Number of seconds before the request times out
 *
 * 0 means no timeout
 *
 * @private
 * @type {int}
 */
Xhr.prototype.timeoutInterval_ = 0;

/**
 * Buffer for response
 *
 * @private
 * @type {bool}
 */
Xhr.prototype.response_ = null;

/**
 * Add headers
 *
 * @private
 * @type {Object}
 */
Xhr.prototype.headers_ = {};

/**
 * True if we are sending raw form data
 *
 * @private
 * @type {bool}
 */
Xhr.prototype._dataIsForm = false;

/**
 * Static send that creates a short lived instance.
 *
 * @param {string} url Uri to make request to.
 * @param {Function=} opt_callback Callback function for when request is complete.
 * @param {string=} opt_method Send method, default: GET.
 * @param {Object|Array} opt_content Body data if POST.
 * @param {number=} opt_timeoutInterval Number of milliseconds after which an
 *     incomplete request will be aborted; 0 means no timeout is set.
 */
Xhr.send = function(url, opt_callback, opt_method, opt_content, opt_timeoutInterval) {
    // Set defaults
    if (typeof opt_method == "undefined")
        opt_method = "GET";
    if (typeof opt_content == "undefined")
        opt_content = null;

    // Crete new Xhr instance and send
    var xhr = new Xhr();
    if (opt_callback)
        events.listen(xhr, "load", function(evt) { evt.data.cb(this.getResponse); }, {cb:opt_callback});
    if (opt_timeoutInterval)
        xhr.setTimeoutInterval(opt_timeoutInterval);
    xhr.send(url, opt_method, opt_content);
    return xhr;
};

/**
 * Instance send that actually uses XMLHttpRequest to make a server call.
 *
 * @param {string|goog.Uri} urlPath Uri to make request to.
 * @param {string=} opt_method Send method, default: GET.
 * @param {Array|Object|string=} opt_content Body data.
 */
Xhr.prototype.send = function(urlPath, opt_method, opt_content) {
    var method = opt_method || "GET";
    var xhr = this;

    // Indicate a request is in progress
    xhr.isInProgress_ = true;

    // Check if we need to put a prefix on the request
    if (alib.net.prefixHttp != "")
        urlPath = alib.net.prefixHttp + urlPath;

    var sendSettings = {
        type: method,
        url: urlPath,
        dataType: this.returnType_,
        async: this.isAsync_,
        headers: this.headers_,
        cache: false,
        data: opt_content || null,
        success: function(data) {
            // Store response in buffer
            xhr.response_ = data;

            // Trigger load events for any listeners
            events.triggerEvent(xhr, "load");

            // No longer in progress of course
            xhr.isInProgress_ = false;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Clear response
            xhr.response_ = null;

            var error = {
                textStatus: textStatus,
                errorThrown: errorThrown,
            }

            // Make sure that we will not send an error if the request was aborted by the user
            if(textStatus && textStatus.toLowerCase() !== "abort") {

                // Trigger load events for any listeners
                events.triggerEvent(xhr, "error", error);
            }


            // No longer in progress of course
            xhr.isInProgress_ = false;
        },
        xhr: function() {
            // This is a hacky workaround since jquery does not support progress
            var myXhr = $.ajaxSettings.xhr();

            if(myXhr.upload){
                events.listen(myXhr.upload, "progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = (evt.loaded / evt.total) * 100;

                        // Trigger load events for any listeners
                        events.triggerEvent(xhr, "progress", {
                            percentComplete: Math.round(percentComplete),
                            loaded: evt.loaded,
                            total: evt.total
                        });
                    }
                });
            } else {
                log.warning("Uploadress is not supported.")
            }
            return myXhr;
        }
    };

    // If we are sending a raw form then do not let jquery process it
    if (this._dataIsForm) {
        sendSettings.processData = false;
        sendSettings.contentType = false;
    }

    this.ajax_ = $.ajax(sendSettings);
}

/**
 * Set what kind of data is being returned
 *
 * @param {string} type Can be "xml", "json", "script", "text", or "html"
 */
Xhr.prototype.setReturnType = function(type) {
    this.returnType_ = type;
}

/**
 * Set a header
 *
 * @param {string} Name of the header to set
 * @param {string} Value of the header
 */
Xhr.prototype.setHeader = function(name, value) {
    this.headers_[name] = value;
}

/**
 * Sets whether or not this request will be made asynchronously
 *
 * Warning: if set to false the UI will hang until the request completes which is annoying
 *
 * @param {bool} asyc If true then set request to async
 */
Xhr.prototype.setAsync = function(async) {
    this.isAsync_ = async;
}

/**
 * Sets the number of seconds before timeout
 *
 * @param {int} seconds Number of seconds
 */
Xhr.prototype.setTimeoutInterval = function(seconds) {
    this.timeoutInterval_ = seconds;
}

/**
 * Flag to indicate we are sending form data
 *
 * @param {bool} isFormData true if we do not want to send raw form data
 */
Xhr.prototype.setDataIsForm = function(isFormData) {
    this._dataIsForm = isFormData;
}

/**
 * Abort the request
 */
Xhr.prototype.abort = function() {
    if (this.ajax_)
        this.ajax_.abort();
}

/**
 * Check if a request is in progress
 *
 * @return bool True if a request is in progress
 */
Xhr.prototype.isInProgress = function() {
    return this.isInProgress_;
}

/**
 * Get response text from xhr object
 */
Xhr.prototype.getResponseText = function() {
    return this.ajax_.responseText;
}

/**
 * Get response text from xhr object
 */
Xhr.prototype.getResponseXML = function() {
    return this.ajax_.responseXML;
}

/**
 * Get the parsed response
 */
Xhr.prototype.getResponse = function() {
    return this.response_;
}

module.exports = Xhr;