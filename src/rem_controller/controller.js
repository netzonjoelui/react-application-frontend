/**
 * @fileoverview controller namespace
 */
'use strict';

/**
 * Create controller object
 */
var controller = {};

/**
 * Set controller types
 */
controller.types = {
	/*
	 * Pages will hide their parent when they are brought to the foreground or hidden
	 * to make sore that only one page in the stack is visible at once.
	 */
	PAGE: 'page',

	/*
	 * A fragment is meant to be embedded inside a page controller like in the case of
	 * a desktop devicec where you might want to keep an application view present while
	 * routing to inner fragments within the application view.
	 * If a fragment has a sub-controller that is a page, the fragment will be hidden
	 * when the page gets displayed, but the fragment will not cascade up and hide its parent.
	 */
	FRAGMENT: 'fragment',
	
	/*
	 * A dialog controller simply renders its content into a (usually modal) dialog. It is a
	 * special case in that it will not make any modifications to parent PAGE or FRAGMENT
	 * controllers. However, dialog controllers can be nested in the case where a dialog
	 * invokes another dialog, then they will behave shomewhat like a PAGE in that only
	 * the currently visible dialog will be displayed at once (or moved to the foreground).
	 */
	DIALOG: 'dialog'
}

module.exports = controller;