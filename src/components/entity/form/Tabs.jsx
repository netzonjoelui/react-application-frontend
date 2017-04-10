/**
 * Tabs parent component
 *
 */

import React from 'react';
var Chamel = require('chamel');
var Tabs = Chamel.Tabs;

/**
 * Top level element for tabs
 */
var FormTabs = React.createClass({

    render: function() {
        return (
        	<Tabs>
        		{this.props.children}
        	</Tabs>
        );
    }
});

export default FormTabs;