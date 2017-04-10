/**
* @fileOverview Proxy to handle errors and logging
*
* @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
* 			Copyright (c) 2014-2015 Aereus Corporation. All rights reserved.
*/

/**
 * Create global namespace for logging
 */
var log = {}

/**
 * Available levels
 *
 * @const
 */
log.levels = {

    /*
     * critical:
     * System is unstable and unusable and MUST be addressed immediately.
     */
	critical: 10,

    /*
     * alert:
     * A problem was encountered that SHOULD be fixed immediately.
     */
	alert: 20,

    /*
     * error:
     * A problem occurred that should not have. The system is still running
     * but this needs to be addressed.
     */
	error: 30,

    /*
     * warning:
     * You are doing something wrong and it is very likely to cause errors
     * in the future, so please fix it.
     */
	warning: 40,

    /*
     * notice:
     * You probably shouldn't be doing what you're doing
     */
	notice: 50,

    /*
     * info:
     * Something/anything happened
     */
	info: 60,

    /*
     * debug:
     * Used to debug code and very verbose
     */
	debug: 70
}

/**
 * Set the current level
 *
 * By default (and in production) we will only log warnings and below
 *
 * @var int
 * @public
 */
log.level = log.levels.warning;

// If we are in development change this to debug
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
	log.level = log.levels.debug;
}

/**
 * Get trace details
 *
 * @private
 * @return {Object} {method, path, line, pos}
 */
function _getStackData() {
    var error = new Error();

    // .stack is vendor specific (chrome and firefox), so degrade gracefully
    if (!error.stack) {
        return {
            method: "unknown",
            path: "unknown",
            line: "unknown",
            pos: "unknown"
        };
    }

	// get call stack, and analyze it
	// get all file,method and line number
	var stacklist = error.stack.split('\n').slice(3);

    // Stack trace format :
	// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	// DON'T Remove the regex expresses to outside of method, there is a BUG in node.js!!!
	var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
	var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

	var data = {};
	var s = stacklist[0],
		sp = stackReg.exec(s) || stackReg2.exec(s);
	if (sp && sp.length === 5) {
		data.method = sp[1];
		data.path = sp[2];
		data.line = sp[3];
		data.pos = sp[4];
		//data.file = path.basename(data.path);
		//data.stack = stacklist.join('\n');
	}
	return data;
}

/**
 * Compose a log arguments array to be passed to either console or logged to the server
 *
 * @param {Object} stackData Trace/stack data to forward
 * @param {Array} origArgs The original arguments passed to the function
 * @private
 */
function _setLogArgs(stackData, origArgs) {

    // Add first two arguments which are the method and the line
    var logArgs = [
        stackData.method,
        stackData.line
    ];

    // Add all passed arguments
    for (var i = 0; i < origArgs.length; i++) {
        logArgs.push(origArgs[i]);
    }

    return logArgs;
}

/**
 * Write a log to the server
 *
 * @param {int} level The log level of the event
 * @param {Array} Array of arguments to pass down
 * @private
 */
function _writeLog(level, args) {

    //var module = args[0];
    //var line = args[1];

    // TODO: send to the server at some interval

    // TODO: Make sure we json encode any objects
    //  and normalize functions and stuff for text-based logs
}

/**
 * Write an error to the log
 *
 * @param Will be called with n number of arguments to log
 * @public
 */
log.error = function() {

    // Check if log level has is watching this message
    if (log.level < log.levels.error) {
        return;
    }

    var args = _setLogArgs(_getStackData(), arguments);

	if (process.env.NODE_ENV === "test") {
		console.error.apply(null, args);
	} else {
		// TODO: send to the server
	}

}

/**
 * If we are in development mode then assume the user
 * has a browser console open and we'd rather just call
 * the console functions directly since they place line number
 * correctly and allow the developer to better trace messages.
 * NOTE: This overrides the above function compvarely.
 */
if (process.env.NODE_ENV === "development") {
    log.error = console.error.bind(window.console);
}


/**
 * Write a warning event to the log
 *
 * @public
 * @var {string} message
 */
log.warning = function(message) {

    // Check if log level has is watching this message
    if (log.level < log.levels.warning) {
        return;
    }

    var data = _getStackData();

    // Add first two arguments which are the method and the line
    var logArgs = [
        data.method,
        data.line
    ];

    // Add all passed arguments
    for (var i = 0; i < arguments.length; i++) {
        logArgs.push(arguments[i]);
    }

    if (process.env.NODE_ENV === "test") {
        console.warn.apply(null, logArgs);
    } else {
        //log.writeLog()
        // TODO: send to the server
    }
}

/**
 * If we are in development mode then assume the user
 * has a browser console open and we'd rather just call
 * the console functions directly since they place line number
 * correctly and allow the developer to better trace messages.
 * NOTE: This overrides the above function compvarely.
 */
if (process.env.NODE_ENV === "development") {
    log.warning = console.warn.bind(window.console);
}

/**
 * Write a notice that something might have gone wrong
 *
 * @public
 * @param Will be called with n number of arguments to log
 */
log.notice = function() {

    // Check if log level has is watching this message
    if (log.level < log.levels.notice) {
        return;
    }

    var args = _setLogArgs(_getStackData(), arguments);

    if (process.env.NODE_ENV === "test") {
        console.log.apply(null, args);
    } else {
        // TODO: send to the server
    }
}

/**
 * If we are in development mode then assume the user
 * has a browser console open and we'd rather just call
 * the console functions directly since they place line number
 * correctly and allow the developer to better trace messages.
 * NOTE: This overrides the above function compvarely.
 */
if (process.env.NODE_ENV === "development") {
    log.notice = console.log.bind(window.console);
}

/**
 * Write an info event to the log
 *
 * @public
 * @param Will be called with n number of arguments to log
 */
log.info = function(message) {

    // Check if log level has is watching this message
    if (log.level < log.levels.info) {
        return;
    }

    var args = _setLogArgs(_getStackData(), arguments);

    if (process.env.NODE_ENV === "test") {
        console.log.apply(null, args);
    } else {
        _writeLog(log.levels.info, args);
    }
}

/**
 * If we are in development mode then assume the user
 * has a browser console open and we'd rather just call
 * the console functions directly since they place line number
 * correctly and allow the developer to better trace messages.
 * NOTE: This overrides the above function compvarely.
 */
if (process.env.NODE_ENV === "development") {
    log.info = console.log.bind(window.console);
}

module.exports = log;
