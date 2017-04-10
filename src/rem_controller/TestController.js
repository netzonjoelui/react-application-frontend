/**
 * @fileoverview This is a test controller used primarily for unit tests
 */
'use strict';

var netric = require("../base");
var AbstractController = require("./AbstractController");

/**
 * Test controller
 */
var TestController = function() { /* Should have details */ }

/**
 * Extend base controller class
 */
netric.inherits(TestController, AbstractController);

/**
 * Function called when controller is first loaded
 */
TestController.prototype.onLoad = function(opt_callback) { 
	if (opt_callback) {
		opt_callback();
	}
}

/**
 * Render the contoller into the dom
 */
TestController.prototype.render = function() { }

module.exports = TestController;
