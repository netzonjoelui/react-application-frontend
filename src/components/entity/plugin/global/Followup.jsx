/**
 * Plugin for following up a customer or opportunity
 *
 */
import React from 'react';
import Chamel from 'chamel';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import FlatButton from 'chamel/lib/Button/FlatButton';
import IconButton from 'chamel/lib/Button/IconButton';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';


var Followup = React.createClass({

    /**
     * Expected props
     */
    propTypes: {

        /**
         * The entity that we want to follow-up
         *
         * @type {Entity}
         */
        entity: React.PropTypes.object,

        /**
         * Function that will display a new entity form
         *
         * @type {function}
         */
        displayNewEntity: React.PropTypes.func,

        /**
         * Function that should be called when the user selects an action
         *
         * @type {function}
         */
        onActionFinished: React.PropTypes.func,

        /**
         * Function that is called when clicking the back button
         *
         * @type {function}
         */
        onNavBtnClick: React.PropTypes.func
    },

    render: function () {

        // Determine if we need to display the toolbar or just the icon button
        let toolBar = null;
        if (!this.props.hideToolbar) {
            let elementLeft = (
                <IconButton
                    onClick={this._handleBackButtonClicked}>
                    <ArrowBackIcon />
                </IconButton>
            );

            toolBar = (
                <AppBar
                    iconElementLeft={elementLeft}
                    title={this.props.title}>
                </AppBar>
            );
        }

        return (
            <div className='entity-form'>
                {toolBar}
                <div className="row entity-form-group">
                    <div className="col-small-3">
                        <FlatButton label='Create Task' onClick={this._handleFollowupAction.bind(this, 'task')}/>
                    </div>
                    <div className="col-small-7">
                        Create a task to be completed by you or someone else in your organization.
                    </div>
                </div>
                <div className="row entity-form-group">
                    <div className="col-small-3">
                        <FlatButton label='Schedule Event'
                                    onClick={this._handleFollowupAction.bind(this, 'calendar_event')}/>
                    </div>
                    <div className="col-small-7">
                        Create a future calendar event that is associated with this customer.
                    </div>
                </div>
                <div className="row entity-form-group">
                    <div className="col-small-3">
                        <FlatButton label='Create Reminder'
                                    onClick={this._handleFollowupAction.bind(this, 'reminder')}/>
                    </div>
                    <div className="col-small-7">
                        Create a reminder that will send the future you a notification
                    </div>
                </div>
            </div>
        );
    },

    /**
     * Function that is called when the back back button is clicked
     *
     * @param evt
     * @private
     */
    _handleBackButtonClicked: function (evt) {
        if (this.props.onNavBtnClick) {
            this.props.onNavBtnClick();
        }
    },

    /**
     * Handles the follow-up actions depending on which type of button is clicked (task, event, or activity)
     *
     * @param objType The type of action that is clicked
     * @private
     */
    _handleFollowupAction: function (objType) {

        if (this.props.displayNewEntity) {
            let params = [];

            params['obj_reference'] = this.props.entity.objType + ':' + this.props.entity.id;
            params['obj_reference_fval'] = encodeURIComponent(this.props.entity.getName());

            let data = {
                objType: objType,
                params: params
            }
            this.props.displayNewEntity(data);
        }

        this.props.onActionFinished();
    }
});

// Check for commonjs
if (module) {
    module.exports = Followup;
}

export default Followup;
