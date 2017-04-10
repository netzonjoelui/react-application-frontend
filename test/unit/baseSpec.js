'use strict';

var netric = require("../../src/base");

/**
 * Check to make sure expected public varibles are set
 */
describe("Public Variables:", function() {
  it("Has a local version variable", function() {
    expect(netric.version.length).toBeGreaterThan(0);
  });
});

/**
 * Test netric namespaced public functions
 */
describe("Public Base Functions:", function() {
	/*
	 * Base URI is used to dynamically construct links
	 */
	it("Can get the local base URI", function() {
		var baseUri = netric.getBaseUri();
		expect(baseUri.length).toBeGreaterThan(0);
	});

	/**
	 * Check to make sure that getApplication calls made
	 * without first setting the application will result in
	 * an error exception.
	 */
	it ("Should throw an exception if getApplication is called early", function() {
		var error = "An instance of netric.Application has not yet been loaded.";
		expect( function(){ netric.getApplication(); } ).toThrow(new Error(error));
	});

});

/**
 * Test inherits functionality
 */
describe("Class inheritance:", function() {

	it("Can extend a base class functions", function() {
		function ParentClass(somevar) { this.someVar_ = somevar; }
 		ParentClass.prototype.getvar = function() { return this.someVar_; }

 		function ChildClass(somevar) { ParentClass.call(this, somevar); }
 		netric.inherits(ChildClass, ParentClass);

 		var child = new ChildClass("test");
 		expect(child.getvar()).toEqual("test");
	});

	it("Can override base class functions", function() {
		
		function ParentClass(somevar) { this.someVar_ = somevar; }
 		ParentClass.prototype.getvar = function() { return this.someVar_; }

 		function ChildClass(somevar) { ParentClass.call(this, somevar); }
 		netric.inherits(ChildClass, ParentClass);

 		// Override
 		ChildClass.prototype.getvar = function() { return "child"; }

 		var child = new ChildClass("test");
 		expect(child.getvar()).toEqual("child");

	});

	it("Can call base functions from child functions", function() {
		function ParentClass(somevar) { this.someVar_ = somevar; }
 		ParentClass.prototype.getvar = function() { return this.someVar_; }

 		function ChildClass(somevar) { ParentClass.call(this, somevar); }
 		netric.inherits(ChildClass, ParentClass);

 		// Override
 		ChildClass.prototype.getvar2 = function() { return this.getvar(); }

 		var child = new ChildClass("test");
 		expect(child.getvar2()).toEqual("test");
	});

	it("Can access base variables from child functions", function() {
		function ParentClass(somevar) { this.someVar_ = somevar; }

 		function ChildClass(somevar) { ParentClass.call(this, somevar); }
 		netric.inherits(ChildClass, ParentClass);
 		ChildClass.prototype.getvar = function() { return this.someVar_; }

 		var child = new ChildClass("test");
 		expect(child.getvar()).toEqual("test");
	});

});

/**
 * Test inherits functionality
 */
describe("Namespace declare:", function() {

	// This is no longer in use
	it("Can create new namespaces before they exist", function() {
		netric.declare("my.test.namespace");
		expect(typeof my.test.namespace).toEqual("object");
	});

	it("Should not override existing functions", function() {
		var testns = {};
		testns.testClass = function() {}
		netric.declare("testns.testClass");
		expect(typeof testns.testClass).toEqual("function");
	});
	
});

