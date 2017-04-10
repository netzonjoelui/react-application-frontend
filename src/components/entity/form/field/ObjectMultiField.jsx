/**
 * Object Multi field component
 */
import React from 'react';


/**
 * Base level element for enetity forms
 */
var ObjectMultiField = React.createClass({

    /**
     * Expected props
     */
    propTypes: {
        elementNode: React.PropTypes.object.isRequired,
        entity: React.PropTypes.object,
        editMode: React.PropTypes.bool
    },

    /**
     * Render the component
     */
    render: function () {
        return (<div>ObjectList Here</div>);
    }
});

export default ObjectMultiField;
