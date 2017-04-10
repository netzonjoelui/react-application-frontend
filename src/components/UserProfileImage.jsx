/**
 * Profile image for a given userid
 *

 */
'use strict';
import React from 'react';
var netric = require("../base");

/**
 * User's thumbnail image
 */
var UserProfileImage = React.createClass({

    /**
     * Expected props
     */
    propTypes: {
        userId: React.PropTypes.string.isRequired,
        width: React.PropTypes.number,
    },

    /**
     * Set defaults
     */
    getDefaultProps: function() {
        return {
            width: 48,
        };
    },

    render: function() {

        var serverHost = netric.server.host;

        var path = serverHost + "/files/userimages/";
        path += this.props.userId;
        path += "/" + this.props.width + "/" + this.props.width;

        var styleProps = {
          width: this.props.width + "px",
          height:   this.props.width + "px"
        };

        return (
            <img src={path} style={styleProps} />
        );
    }

});

// Check for commonjs
if (module) {
    module.exports = UserProfileImage;
}

export default UserProfileImage;
