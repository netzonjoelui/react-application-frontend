/**
 * Main application controller
 */
import React from 'react';
import ReactDOM from "react-dom";
import netric from "../base";
import controller from "./controller";
import AbstractController from "./AbstractController";
import EntityController from "./EntityController";
import EntityBrowserController from "./EntityBrowserController";
import GroupingManagerController from "./GroupingManagerController";
import UiModule from "../ui/Module.jsx";
import moduleLoader from "../module/loader";
import groupingLoader from "../entity/groupingLoader";

/**
 * Controller that loads modules into the applicatino
 */
var ModuleController = function() {};

/**
 * Extend base controller class
 */
netric.inherits(ModuleController, AbstractController);

/**
 * Handle to root ReactElement where the UI is rendered
 *
 * @private
 * @type {ReactElement}
 */
ModuleController.prototype.rootReactNode_ = null;

/**
 * Loaded module definition
 *
 * @type {netric.module.Module}
 */
ModuleController.prototype.module_ = null;

/**
 * Grouping loaders used for browseBy functionality of the left navigation
 *
 * @private
 * @type {Object}
 */
ModuleController.prototype.groupingLoaders_ = {};

/**
 * Contains the navigation items
 *
 * @private
 * @type {array}
 */
ModuleController.prototype.leftNavItems_ = [];

/**
 * Function called when controller is first loaded but before the dom ready to render
 *
 * @param {function} opt_callback If set call this function when we are finished loading
 */
ModuleController.prototype.onLoad = function(opt_callback) {

	// Change the type based on the device size
	switch (netric.getApplication().device.size)
	{
		case netric.Device.sizes.small:
			this.type_ = controller.types.PAGE;
			break;
		case netric.Device.sizes.medium:
		case netric.Device.sizes.large:
		case netric.Device.sizes.xlarge:
		default:
			this.type_ = controller.types.FRAGMENT;
			break;
	}

	// Add listener to update leftnav state when a child route changes
	if (this.getChildRouter()) {
		alib.events.listen(this.getChildRouter(), "routechange", function(evt) {
			this.props.leftNavSelectedRoute = evt.data.relativePath;
			this.reactRender_();
		}.bind(this));
	}

	// By default just immediately execute the callback because nothing needs to be done
	if (opt_callback) {
		moduleLoader.get(this.props.module, function(module) {
			this.module_ = module;
			opt_callback();
		}.bind(this));
	} else {
		opt_callback();
	}
};

/**
 * Render this controller into the dom tree
 */
ModuleController.prototype.render = function() {

	// Render the react components
	this.reactRender_();

	// Setup navigation items
	this.setNavigationItems_();

	// Setup navigation routes
	this.setupNavigation_();
};

/**
 * Render the react UI
 * This function will be called everytime we need to send new props or update props into react
 *
 * @private
 */
ModuleController.prototype.reactRender_ = function() {
	// Set outer application container
	var domCon = this.domNode_;

	// Initialize properties to send to the netric.ui.Module view
	var data = {
		name: this.module_.name,
		title: this.module_.title,
		deviceIsSmall: netric.getApplication().device.size == netric.Device.sizes.small,
		leftNavDocked: (netric.getApplication().device.size >= netric.Device.sizes.large),
		leftNavOpen: (this.props.leftNavOpen),
		leftNavItems: this.leftNavItems_,
		modules: moduleLoader.getModules(),
		leftNavSelectedRoute: this.props.leftNavSelectedRoute || null,
		user: netric.getApplication().getAccount().getUser(),
		onLeftNavChange: this.onLeftNavChange_.bind(this),
		onModuleChange: this.onModuleChange_.bind(this),
    onMenuClose: function () { this.props.leftNavOpen = false; this.render(); }.bind(this)
	};

	// Render application component
	this.rootReactNode_ = ReactDOM.render(
		React.createElement(UiModule, data),
		domCon
	);
};

/**
 * User selected an alternate menu item in the left navigation
 */
ModuleController.prototype.onLeftNavChange_ = function(evt, index, payload) {
	if (payload && payload.route) {
		var basePath = this.getRoutePath();
		netric.location.go(basePath + "/" + payload.route);
		this.props.leftNavOpen = false;
		this.reactRender_();
	}
}

/**
 * User selected an alternate module to laod
 */
ModuleController.prototype.onModuleChange_ = function(evt, moduleName) {
	if (moduleName) {
		netric.location.go("/" + moduleName);
	}
}

/**
 * Set navigation items for view based on module config and browseby groups
 *
 * @private
 */
ModuleController.prototype.setNavigationItems_ = function() {

	// Set left navigation
	var leftNavigation = [];
	for (var i = 0; i < this.module_.navigation.length; i++) {

		var navItem = this.module_.navigation[i];

		leftNavigation.push({
			text: navItem.title,
			route: navItem.route,
			iconClassName: "fa fa-" + navItem.icon
		});

		// Populate browseby groupings
		if (navItem.objType && navItem.browseby) {
			var groupings = null;

			// Make sure the groupings cache object is initialized for this object
			if (!this.groupingLoaders_[navItem.objType]) {
				this.groupingLoaders_[navItem.objType] = {};
			}

			if (this.groupingLoaders_[navItem.objType][navItem.browseby]) {
				groupings = this.groupingLoaders_[navItem.objType][navItem.browseby];
			} else {
				/* We really only want to setup the groupings once because we
                 * will be calling this function any time a change is made to the
                 * groupings and we do not want to add additional listeners.
                 */
				var groupings = groupingLoader.get(navItem.objType, navItem.browseby, function() {
					// Do nothing, let the onchange event listener handle freshly loaded groupings
				});

				alib.events.listen(groupings, "change", this.setNavigationItems_.bind(this));

				// Cache grouping so we do not try to set it up again with listeners
				this.groupingLoaders_[navItem.objType][navItem.browseby] = groupings;
			}

			// Get first level groupings
			if (groupings) {
				var groups = groupings.getGroupsHierarch();

				this.setBrowseByItems_(groups, leftNavigation, 1, navItem.route, navItem.browseby);
			}

		}
	}

	// Update the UI to display the left navigation items
	this.leftNavItems_ = leftNavigation;
	this.reactRender_();
}

/**
 * Traverse browseby
 *
 * @private
 */
ModuleController.prototype.setBrowseByItems_ = function(groups, leftNavigation, indentLevel, route, browseby) {

	// Loop through all groups and add to the navigation
	for (var j in groups) {
		leftNavigation.push({
			text: groups[j].name,
			route: route + "/browse/" + browseby + "/" + groups[j].id + "/" + groups[j].name,
			iconClassName: "fa fa-chevron-right",
			indent: indentLevel
		});

		// Add children
		if (groups[j].children && groups[j].children.length) {
			this.setBrowseByItems_(groups[j].children, leftNavigation, (indentLevel + 1), route, browseby)
		}
	}
}

/**
 * Setup routes and controller to work with loaded module
 *
 * @private
 */
ModuleController.prototype.setupNavigation_ = function() {

	for (var i = 0; i < this.module_.navigation.length; i++) {
		var navItem = this.module_.navigation[i];

		// Add the navigation route
		switch (navItem.type) {
			case 'entity':
			case 'object':
				this.setupEntityRoute_(navItem);
				break;
			case 'browse':
				this.setupEntityBrowseRoute_(navItem);
				break;
			case 'category':
				this.setupGroupingManagerRoute_(navItem);
				break;
		}
	}

	// Set a default route to messages
	this.getChildRouter().setDefaultRoute(this.module_.defaultRoute);
};

/**
 * Setup route data for an entity controller
 *
 * @private
 */
ModuleController.prototype.setupEntityRoute_ = function(navItem) {
	// Add route to compose a new entity
	this.addSubRoute(navItem.route,
		EntityController,
		{
			type: controller.types.FRAGMENT,
			objType: navItem.objType,
			onNavBtnClick: (netric.getApplication().device.size >= netric.Device.sizes.large) ?
				null : function(e) { this.props.leftNavOpen = !this.props.leftNavOpen; this.render(); }.bind(this)
		},
		ReactDOM.findDOMNode(this.rootReactNode_.refs.moduleMain)
	);
}

/**
 * Setup route data for an entity browser controller
 *
 * @private
 */
ModuleController.prototype.setupEntityBrowseRoute_ = function(navItem) {
	// Add route to compose a new entity
	this.addSubRoute(navItem.route, 
		EntityBrowserController, {
			type: controller.types.FRAGMENT,
			objType: navItem.objType,
			title: navItem.title,
			onNavBtnClick: (netric.getApplication().device.size >= netric.Device.sizes.large) ?
				null : function(e) { this.props.leftNavOpen = !this.props.leftNavOpen; this.render(); }.bind(this)
		},
		ReactDOM.findDOMNode(this.rootReactNode_.refs.moduleMain)
	);
}

/**
 * Setup route data for an entity manager controller
 *
 * @private
 */
ModuleController.prototype.setupGroupingManagerRoute_ = function(navItem) {
	// Add route to compose a new category
	this.addSubRoute(navItem.route,
		GroupingManagerController, {
			type: controller.types.FRAGMENT,
			objType: navItem.objType,
			title: navItem.title,
			fieldName: navItem.fieldName,
			action: "list",
			onNavBtnClick: (netric.getApplication().device.size >= netric.Device.sizes.large) ?
				null : function(e) { this.props.leftNavOpen = !this.props.leftNavOpen; this.render();  }.bind(this)
		},
		ReactDOM.findDOMNode(this.rootReactNode_.refs.moduleMain)
	);
}


module.exports = ModuleController;
