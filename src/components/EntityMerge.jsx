/**
 * Render the ui for Entity Merge
 */
import React from 'react';
import theme from './entity-merge.scss';
import GroupingChip from './entity/GroupingChip.jsx';
import events from '../util/events';
import entityLoader from '../models/entity/entityLoader';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import IconButton from 'chamel/lib/Button/IconButton';
import Paper from 'chamel/lib/Paper/Paper';
import Popover from 'chamel/lib/Popover/Popover';
import RaisedButton from 'chamel/lib/Button/RaisedButton';
import TextField from 'chamel/lib/Input/TextField';
import Snackbar from 'chamel/lib/Snackbar/Snackbar';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import CheckIcon from 'chamel/lib/icons/font/CheckIcon';

/**
 * Displays the ui for Entity Merge
 */
var EntityMerge = React.createClass({

    propTypes: {

        /**
         * The object type where we will do the merging of entities
         *
         * @type {string}
         */
        objType: React.PropTypes.string.isRequired,

        /**
         * Contains the selected entity ids that will be used for merging
         *
         * @type {array}
         */
        selectedEntities: React.PropTypes.array.isRequired,

        /**
         * The entity definition of the object
         *
         * @type {object}
         */
        entityDefinition: React.PropTypes.object,

        /**
         * Callback function to merge the entities
         *
         * @type {function}
         */
        onMerge: React.PropTypes.func.isRequired,

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
         * Object used for handling custom events through the entity form
         *
         * @type {object}
         */
        eventsObj: React.PropTypes.object,

        /**
         * Message that will be displayed in the appbar
         *
         * @type {string}
         */
        snackBarMessage: React.PropTypes.string,
    },

    getInitialState: function () {

        // Return the initial state
        return {
            entities: [],
            mergeData: [],
            snackBarMessage: this.props.snackBarMessage
        };
    },

    componentDidMount: function () {

        // Event listener for saving the mass edit
        events.listen(this.props.eventsObj, "mergeEntities", function (evt) {
            this._handleMergeEntities();
        }.bind(this));
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({snackBarMessage: nextProps.snackBarMessage});
    },

    render: function () {

        // Set the snackbar
        let snackbar = null;
        snackbar = <Snackbar ref="snackbar" message={this.state.snackBarMessage}/>;

        // Show the AppBar if this.props.showAppBar is true (not in a dialog)
        let appBar = null;
        if (this.props.showAppBar) {
            let elementLeft = null;
            if (this.props.onNavBtnClick) {
                elementLeft = (
                    <div>
                        <IconButton
                            key="back"
                            onClick={this._handleBackClick}>
                            <ArrowBackIcon />
                        </IconButton>
                    </div>
                );
            }
            let appBarMergeIcon = (
                <div>
                    <IconButton
                        key="apply"
                        onClick={this._handleSave}>
                        <CheckIcon />
                    </IconButton>
                </div>
            );

            appBar = <AppBar
                fixed={true}
                key="Merge"
                title={"Merge"}
                zDepth={0}
                iconElementLeft={elementLeft}>
                {appBarMergeIcon}
            </AppBar>
        }

        // Set the dropdown menu data with first entry label
        let dropdownMenuData = [{payload: null, text: 'Select Entity Id'}];

        // Loop thru the selected entities and build the dropdown menu data
        for (let idx in this.props.selectedEntities) {

            let entityId = this.props.selectedEntities[idx];
            dropdownMenuData.push(
                {
                    payload: entityId,
                    text: this.props.objType + ' Id: ' + entityId
                }
            )
        }

        let displayFields = [];
        let fields = this.props.entityDefinition.getFields();

        // Loop thru the entity fields and display the fields that can be merged
        for (let idx in fields) {

            let field = fields[idx];

            // Skip read-only fields
            if (field.readonly) {
                continue;
            }

            let selectedIndex = 0;
            let fieldValue = null;

            // If we have a selected entity id for this specific field, then let's load the field data using the entity id selected
            if (this.state.mergeData.hasOwnProperty(field.name)) {

                // Get the selected index that will be set in the <DropDownMenu>
                selectedIndex = this._getSelectedIndex(dropdownMenuData, this.state.mergeData[field.name]);

                // Since our dropdownMenuData contains a firstEntryLabel, then we need to -1 the selected index
                let entityId = this.props.selectedEntities[selectedIndex - 1];

                // If we have loaded the entity for this entityId, then let's get the field value
                if (this.state.entities.hasOwnProperty(entityId)) {
                    fieldValue = this._getFieldValue(field, field.name, entityId);
                }
            }

            displayFields.push(
                <div key={idx} className="entity-form-field">
                    <div className="entity-form-field-label">
                        {field.title}
                    </div>
                    <div className="entity-form-field-value">
                        <div className="entity-form-field-inline-block">
                            <DropDownMenu
                                selectedIndex={parseInt(selectedIndex)}
                                ref='dropdown'
                                menuItems={dropdownMenuData}
                                onChange={this._handleOnChange.bind(this, field.name)}/>
                        </div>
                        <div className="entity-form-field-inline-block">
                            {fieldValue}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="entity-form">
                {appBar}
                <div>
                    <p>{"Select which record you would like to use for each value."}</p>
                </div>
                {displayFields}
                <div>
                    <p>{"WARNING: This cannot be undone so use caution to assure you intended to permanantly merge all the data."}</p>
                </div>
                {snackbar}
            </div>
        )
    },

    /**
     * Handle when a user selects an entity id from the dropdown menu
     *
     * @private
     * @param {string} fieldName The name of the field where we will merge the value of the selected entity
     * @param {Event} e
     * @param {int} selectedIndex The index of the item selected
     * @param {Object} menuItem The menu item clicked on
     */
    _handleOnChange: function (fieldName, e, selectedIndex, menuItem) {

        let entityId = menuItem.payload;
        let mergeData = this.state.mergeData;

        if (entityId === null) {
            delete mergeData[fieldName];
        } else {
            mergeData[fieldName] = entityId;
        }

        this.setState({mergeData: mergeData});
        this._loadEntity(entityId);
    },

    /**
     * Handle event where the user commits the changes in the field
     *
     * @private
     */
    _handleMergeEntities: function () {

        let data = {};

        /*
         * Build the data using the selected entities as our index
         * This will make sure that all selected entities will be updated
         * Even if there were no fields selected from them
         */
        for (let idx in this.props.selectedEntities) {

            let entityId = this.props.selectedEntities[idx];

            data[entityId] = new Array();
        }

        // Build the merge data
        for (let fieldName in this.state.mergeData) {

            let entityId = this.state.mergeData[fieldName];

            data[entityId].push(fieldName);
        }

        // Call the action finished function and pass the state data
        this.props.onMerge(data);

        // Display a status that the changes are being saved
        this.setState({snackBarMessage: 'Merging the entities...'});
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
    },

    /**
     * Gets the index of the selected entity id
     *
     * @param {Array} data Array of data that will be mapped to get the index of the selected entity
     * @param {string} value The value that will be used to get the index
     * @private
     */
    _getSelectedIndex: function (data, value) {
        let index = 0;
        for (let idx in data) {
            if (data[idx].payload == value) {
                index = idx;
                break;
            }
        }

        return index;
    },

    /**
     * Get the field value and evaulate the field on how to display its value
     *
     * @param {obj} field field The definition of field that we are going to merge
     * @param {string} fieldName The selected field that will be merged
     * @param {int} entityId The selected entityId where we will get the field value of the entity
     *
     * @returns {string|int|array} If the field type is multi, then it will return an array of chips containing the field value
     *                              Otherwise, it will just return the field value directly (string or int)
     * @private
     */
    _getFieldValue: function (field, fieldName, entityId) {

        // We need to make sure that entity is already cached in the state.entities
        if (!this.state.entities.hasOwnProperty(entityId)) {
            return null;
        }

        // Get the selected entity
        let entity = this.state.entities[entityId];
        let fieldValue = null;

        // If field type is multi, then we will display the field value in chips
        if (field.type == field.types.objectMulti || field.type == field.types.fkeyMulti) {

            fieldValue = []
            let fieldValues = entity.getValueName(fieldName);

            // If the fieldValues is an array then lets loop thru it to get the actual values
            if (Array.isArray(fieldValues)) {
                for (let idx in fieldValues) {

                    // Setup the GroupingChip
                    fieldValue.push(
                        <GroupingChip
                            key={idx}
                            id={parseInt(fieldValues[idx].key)}
                            name={fieldValues[idx].value}
                        />
                    );
                }
            } else if (typeof fieldValues === 'object') {

                for (let idx in fieldValues) {

                    /*
                     * If fieldValues is an object, then let's use the idx as the id
                     *  and use the fieldValue[idx] as the name
                     */
                    fieldValue.push(
                        <GroupingChip
                            key={idx}
                            id={parseInt(idx)}
                            name={fieldValues[idx]}
                        />
                    );
                }
            } else {

                // Let's just get the field value directly
                fieldValue = entity.getValue(fieldName);
            }
        } else {

            // Just get the field value
            fieldValue = entity.getValue(fieldName);
        }

        if (fieldValue && !Array.isArray(fieldValue) && fieldValue.length > 30) {
            fieldValue = (
                <div>
                    <RaisedButton
                        onClick={this._handlePopoverDisplay}
                        label={'View Value'}
                    />
                    <Popover
                        open={this.state.openMenu}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={this._handlePopoverRequestClose}>
                        <Paper zDepth={0} className={theme.mergeEntityFieldValuePopup}>
                            <div>
                                {fieldValue}
                            </div>
                        </Paper>
                    </Popover>

                </div>
            );
        }


        return fieldValue;
    },

    /**
     * Callback used to handle commands when user clicks the button to display the menu in the popover
     *
     * @param {DOMEvent} e Reference to the DOM event being sent
     * @private
     */
    _handlePopoverDisplay: function (e) {

        // This prevents ghost click.
        e.preventDefault();

        this.setState({
            openMenu: this.state.openMenu ? false : true,
            anchorEl: e.currentTarget
        });
    },

    /**
     * Callback used to close the popover
     *
     * @private
     */
    _handlePopoverRequestClose: function () {
        this.setState({openMenu: false});
    },

    /**
     * Determine if we are going to show or hide the snackbar
     *
     * @param snackbarMessage The current snackbar message
     * @private
     */
    _showHideSnackbar: function (snackBarMesasge) {

        if (snackBarMesasge == '') {
            this.refs.snackbar.hide();
        } else {
            this.refs.snackbar.show();
        }
    },

    /**
     * Loads the entity using entityLoader. After loading the entity, it will be cached by updating the state.entities
     *
     * @param entityId The id of the entity that will be loaded
     * @private
     */
    _loadEntity: function (entityId) {

        let entities = this.state.entities;

        // If we have already cached the entity, there is no need to load the entity
        if (entities.hasOwnProperty(entityId)) {
            return;
        }

        // Load the entity and cache it
        entityLoader.get(this.props.objType, entityId, function (entity) {

            entities[entityId] = entity;

            this.setState({entities: entities});
        }.bind(this));
    }
});

export default EntityMerge;
