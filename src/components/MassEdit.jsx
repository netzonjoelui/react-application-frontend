/**
 * Render the ui for Mass Edit
 */
import React from 'react';
import theme from './mass-edit.scss';
import formTheme from './entity/form/entity-form.scss';
import FieldInput from './entity/FieldInput';
import EntityFieldsDropDownContainer from '../containers/EntityFieldsDropDownContainer';
import events from '../util/events';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import IconButton from 'chamel/lib/Button/IconButton';
import Snackbar from 'chamel/lib/Snackbar/Snackbar';
import TextField from 'chamel/lib/Input/TextField';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import CheckIcon from 'chamel/lib/icons/font/CheckIcon';

/**
 * Displays the ui for Mass Edit to update a field of multiple entities
 */
var MassEdit = React.createClass({

    propTypes: {

        /**
         * The type of object we are doing the mass edit
         *
         * @type {string}
         */
        objType: React.PropTypes.string.isRequired,

        /**
         * Callback function to commit the changes
         *
         * @type {func}
         */
        onSave: React.PropTypes.func.isRequired,

        /**
         * Navigation back button - left arrow to the left of the title
         *
         * @type {function}
         */
        onNavBtnClick: React.PropTypes.func,

        /**
         * Determine if we should display the appbar which probably means we are not in dialog mode
         *
         * @type {bool}
         */
        showAppBar: React.PropTypes.bool,

        /**
         * Message that will be displayed in the appbar
         *
         * @type {string}
         */
        snackBarMessage: React.PropTypes.string,

        /**
         * Object used for handling custom events through the entity form
         *
         * @type {object}
         */
        eventsObj: React.PropTypes.object
    },

    getInitialState: function () {

        // Return the initial state
        return {
            fieldName: null,
            fieldValue: null,
            snackBarMessage: this.props.snackBarMessage
        };
    },

    componentDidMount: function () {

        // Event listener for saving the mass edit
        events.listen(this.props.eventsObj, "saveMassEdit", function (evt) {
            this._handleSave();
        }.bind(this));
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({snackBarMessage: nextProps.snackBarMessage})
    },

    componentDidUpdate: function () {

        // Hide the snackbar if the component did re-render
        if (this.state.snackBarMessage === '') {
            this.refs.snackbar.dismiss();
        }
    },

    render: function () {

        // Show the AppBar if this.props.showAppBar is true (not in a dialog)
        let appBar = null;

        if (this.props.showAppBar) {
            let elementLeft = null;
            if (this.props.onNavBtnClick) {
                elementLeft = (
                    <IconButton
                        key="back"
                        onClick={this._handleBackClick}>
                        <ArrowBackIcon />
                    </IconButton>
                );
            }

            appBar = <AppBar
                fixed={true}
                key="Save"
                title={"Save"}
                zDepth={0}
                iconElementLeft={elementLeft}>
                <div>
                    <IconButton
                        key="apply"
                        onClick={this._handleSave}>
                        <CheckIcon />
                    </IconButton>
                </div>
            </AppBar>

        }

        let displayFieldValueInput = null;

        // If field name is selected, then let's display the input field
        if (this.state.fieldName) {
            displayFieldValueInput = (
                <div className={formTheme.entityFormField + " " + theme.massEditForm}>
                    <div className={formTheme.entityFormFieldLabel}>
                        {'Field Value'}
                    </div>
                    <div className={formTheme.entityFormFieldValue}>
                        <div className={formTheme.entityFormFieldInlineBlock}>
                            <FieldInput
                                objType={this.props.objType}
                                fieldName={this.state.fieldName}
                                value={this.state.fieldValue}
                                onChange={this._handleValueChange}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        // Set the snackbar
        let snackbar = null;
        snackbar =
            <Snackbar ref="snackbar" message={this.state.snackBarMessage}/>
        ;

        return (
            <div className={formTheme.entityFormField + " " + theme.massEditForm}>
                {appBar}
                <div className={formTheme.entityFormField}>
                    <div className={formTheme.entityFormFieldLabel}>
                        {'Field to Update'}
                    </div>
                    <div className={formTheme.entityFormFieldValue}>
                        <div className={formTheme.entityFormFieldInlineBlock}>
                            <EntityFieldsDropDownContainer
                                objType={this.props.objType}
                                onChange={this._handleFieldChange}
                                showReadOnlyFields={false}
                                selectedField={this.state.fieldName}
                            />
                        </div>
                    </div>
                </div>
                {displayFieldValueInput}
                {snackbar}
            </div>
        )
    },

    /**
     * Handle event where the user selects a field name
     *
     * @param {string} fieldName The field name that was selected by the user
     * @private
     */
    _handleFieldChange: function (fieldName) {
        this.setState({
            fieldName: fieldName
        });
    },

    /**
     * When a property changes send an event so it can be handled
     *
     * @param {string} property The name of the property that was changed
     * @param {string|int|Object} value Whatever we set the property to
     * @private
     */
    _handleValueChange: function (property, value) {
        this.setState({
            fieldValue: value
        });
    },

    /**
     * Handle event where the user commits the changes in the field
     *
     * @private
     */
    _handleSave: function () {

        // Make sure that we have a fieldName
        if (this.state.fieldName === null) {
            this.setState({snackBarMessage: 'Please select a field to update.'});
            this.refs.snackbar.show();
            return;
        }

        let data = {};

        // If the props.value is an array then lets loop thru it to get the actual values
        if (Array.isArray(this.state.fieldValue)) {

            // Setup the data to accommodate multi values
            data[this.state.fieldName] = new Array();
            data[this.state.fieldName + "_fval"] = {};

            // Loop thru the state.fieldValue and assign the values into the array
            for (let id in this.state.fieldValue) {
                let valueName = this.state.fieldValue[id];

                data[this.state.fieldName].push(id);
                data[this.state.fieldName + "_fval"][id] = valueName;
            }

        } else {
            data[this.state.fieldName] = this.state.fieldValue;
        }

        // Call the action finished function and pass the state data
        this.props.onSave(data);

        // Display a status that the changes are being saved
        this.setState({snackBarMessage: 'Saving the changes...'});
        this.refs.snackbar.show();
    },

    /**
     * The user clicked back in the toolbar/appbar
     *
     * @param {DOMEvent} evt
     * @private
     */
    _handleBackClick: function (evt) {
        if (this.props.onNavBtnClick) {
            this.props.onNavBtnClick();
        }
    }
});

// Check for commonjs
if (module) {
    module.exports = MassEdit;
}

export default MassEdit;
