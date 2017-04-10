/**
 * Plugin for managing the custom fields for an entity
 *
 */
import React from 'react';
import definitionLoader from '../../../../models/entity/definitionLoader';
import Field from '../../../../models/entity/definition/Field';

// Chamel Controls
import IconButton from 'chamel/lib/Button/IconButton';
import RaisedButton from 'chamel/lib/Button/RaisedButton';
import TextField from 'chamel/lib/Input/TextField';
import Dialog from 'chamel/lib/Dialog/Dialog';
import DropDownMenu from 'chamel/lib/Picker/SelectField';

/**
 * Handles the creating of custom field for an entity
 */
var CustomFields = React.createClass({

    /**
     * Expected props
     */
    propTypes: {

        /**
         * Current element node level
         *
         * @type {elementNode}
         */
        elementNode: React.PropTypes.object,

        /**
         * The entity that we want to follow-up
         *
         * @type {Entity}
         */
        entity: React.PropTypes.object
    },

    /**
     * Return the starting state of this component
     *
     * @returns {{}}
     */
    getInitialState: function () {
        return {
            removeField: {},
            removeFieldStatus: null,
            selectedFieldType: null,
            errorStatus: null,
            entityDefinition: null
        };
    },

    componentDidMount: function () {
        let elementNode = this.props.elementNode;
        let objType = elementNode.getAttribute('objType');

        /*
         * If the objType specified in the xml does not match with the current props.entity.objType
         *  then we need to get the definition of the objType speficied in the xml
         */
        if (this.props.entity.objType != objType) {

            definitionLoader.get(objType, function (def) {
                this._handleEntityDefinititionLoaded(def);
            }.bind(this));
        } else {

            // We can readily use the props.entity.def as our entity definition of objType from xml and entity's objType matched
            this._handleEntityDefinititionLoaded(this.props.entity.def);
        }
    },

    render: function () {

        // Add field dialog action buttons
        let addFieldActions = [
            {text: 'Cancel'},
            {text: 'Submit', onClick: this._handleCreateField}
        ];

        // Remove field dialog action buttons
        let removeFieldActions = [
            {text: 'Cancel'},
            {text: 'Continue', onClick: this._handleRemoveField}
        ];

        // Types of field that will be used in the dropdown menu data
        let fieldTypeData = [
            {payload: '', text: 'Select Field Type'},
            {payload: 'text', text: 'Text'},
            {payload: 'date', text: 'Date'},
            {payload: 'number', text: 'Number'},
            {payload: 'object', text: 'File', subtype: 'file'}
        ]

        // If we do not have customFields to use yet, then we just return an empty div for now
        if (this.state.entityDefinition === null) {
            return (
                <div />
            )
        }

        let elementNode = this.props.elementNode;
        let refField = elementNode.getAttribute('ref_field');

        // Get the custom fields by filtering the fields using the useWhen field attribute
        let customFields = this.state.entityDefinition.getFilteredFields('useWhen', refField + ':' + this.props.entity.id);

        // Map thru the customFields and display the custom customFields for this entity
        let customFieldsDisplay = [];
        customFields.map(function (field, idx) {

            let fieldType = this._getSelectedFieldType(fieldTypeData, field.type);
            let removeFieldDisplay = (
                <IconButton
                    onClick={this._handleShowDialog.bind(this, 'removeFieldDialog', field)}
                    tooltip={"Remove"}
                    className="cfi cfi-close entity-form-remove-button"
                />
            );

            // If we are removing the field from the definition, then lets display the status
            if (this.state.removeFieldStatus && this.state.removeField.name == field.name) {
                removeFieldDisplay = this.state.removeFieldStatus;
            }

            customFieldsDisplay.push(
                <div className="row entity-form-group" key={idx}>
                    <div className="col-small-3">
                        {field.title}
                    </div>
                    <div className="col-small-3">
                        {field.name}
                    </div>
                    <div className="col-small-2">
                        {fieldType.text}
                    </div>
                    <div className="col-small-1">
                        {removeFieldDisplay}
                    </div>
                </div>
            );
        }.bind(this));

        let dialogErrorDisplay = null;
        if(this.state.errorStatus) {
            dialogErrorDisplay = (
                <div className="entity-form-error-status">
                    {this.state.errorStatus}
                </div>
            )
        }

        let selectedFieldType = (this.state.selectedFieldType) ?
            this._getSelectedFieldType(fieldTypeData, this.state.selectedFieldType.payload) : {index: 0};

        return (
            <div className='entity-form'>
                <div className="row entity-form-group">
                    <div className="col-small-12">
                        <RaisedButton
                            onClick={this._handleShowDialog.bind(this, 'addFieldDialog')}
                            label='Add Custom Field'
                        />
                    </div>
                </div>
                {customFieldsDisplay}
                <Dialog
                    ref="addFieldDialog"
                    title="Add Custom Field"
                    actions={addFieldActions}
                    modal={true}
                >
                    {dialogErrorDisplay}
                    <TextField
                        floatingLabelText='Custom Field Name'
                        ref="fieldInput"/>
                    <DropDownMenu
                        menuItems={fieldTypeData}
                        selectedIndex={parseInt(selectedFieldType.index)}
                        onChange={this._handleFieldTypeChange}
                    />
                </Dialog>
                <Dialog
                    ref='removeFieldDialog'
                    title={'Remove Custom Field: ' + this.state.removeField.name}
                    actions={removeFieldActions}
                    modal={true}
                >
                    {"Are you sure you want to permanantly remove the '" + this.state.removeField.title + "' field?"}
                </Dialog>
            </div>
        );
    },

    /**
     * Callback used to handle commands when user selects a field type
     *
     * @param {DOMEvent} e Reference to the DOM event being sent
     * @param {int} key The index of the menu clicked
     * @param {Object} data The object value of the menu clicked
     * @private
     */
    _handleFieldTypeChange: function (e, key, data) {
        this.setState({selectedFieldType: data});
    },

    /**
     * Remove the custom field from the entity defintion
     *
     * @private
     */
    _handleRemoveField: function () {

      // Get the xml data
      let elementNode = this.props.elementNode;
      let objType = elementNode.getAttribute('objType');

      this.setState({removeFieldStatus: 'Removing...'});

      // Remove the custom field from the entity definition
      this.state.entityDefinition.removeField(this.state.removeField.name);

      // Update the entity definition
      throw 'definition update needs to be handled in an action';
      // TODO: This should be hanled through an action, and in a container not a component
      //definitionSaver.update(this.state.entityDefinition, this._handleEntityDefinititionLoaded);

      this.refs.removeFieldDialog.dismiss();
    },

    /**
     * Callback used to handle commands when user submits to create the new custom field
     *
     * @private
     */
    _handleCreateField: function () {

      // Get the xml data
      let elementNode = this.props.elementNode;
      let refField = elementNode.getAttribute('ref_field');

      // get the user input data
      let fieldName = this.refs.fieldInput.getValue();
      let fieldType = this.state.selectedFieldType;
      let regexAlpha = new RegExp("^[a-zA-Z]+$"); // This expression checks if the string contains letters only

      if (fieldName === '') {
          this.setState({errorStatus: 'Field name is not provided.'});
          return;
      } else if(!regexAlpha.test(fieldName.charAt(0))) { // Make sure that the first letter is an alphabet
          this.setState({errorStatus: 'Field name must start with a letter.'});
          return;
      } else if (fieldType === '' || fieldType === null) {
          this.setState({errorStatus: 'Please select a field type.'});
          return;
      }

      // Create a new instance of /entity/definition/Field
      let fieldObj = new Field();

      // Store the field data
      fieldObj.name = fieldName.replace(/ /g, '_').replace(/[\W]+/g, " ");
      fieldObj.title = fieldName;
      fieldObj.type = fieldType.payload;
      fieldObj.useWhen = refField + ':' + this.props.entity.id;

      // Setup the subtype if it is available
      if(fieldType.subtype) {
          fieldObj.subtype = fieldType.subtype;
      }

      // Add the new custom field in the entity definition
      this.state.entityDefinition.addField(fieldObj);

      // Update the entity definition
      throw 'definition update needs to be handled in an action';
      // TODO: This should be hanled through an action, and in a container not a component
      //definitionSaver.update(this.state.entityDefinition, this._handleEntityDefinititionLoaded);

      // Clear the dialog input
      this.refs.fieldInput.clearValue();
      this.refs.addFieldDialog.dismiss();
    },

    /**
     * Callback used to handle commands when user wants to add a custom field.
     *
     * @params {string} type The type of dialog to show
     * @params {entity/definition/Field} field The field that we are going to remove. This is only applicable in 'removeFieldDialog'
     * @private
     */
    _handleShowDialog: function (type, field) {
        this.refs[type].show();

        /*
         * If field is provided and the type of dialog shown is removeFieldDialog
         *  then lets set the state that we are about to remove a field
         */
        if (field && type === 'removeFieldDialog') {
            this.setState({removeField: field});
        }
    },

    /**
     * Callback used when an entity definition loads (or changes)
     *
     * @param {EntityDefinition} entityDefinition The loaded definition
     */
    _handleEntityDefinititionLoaded: function (entityDefinition) {
        this.setState({
            entityDefinition: entityDefinition,
            removeField: {},
            removeFieldStatus: null,
            selectedFieldType: null,
            errorStatus: null
        })
    },

    /**
     * Gets the selected field type data including the index value
     *
     * @param {Array} data Array of data that will be mapped to get the index of the saved field/operator/blogic value
     * @param {string} value The value that will be used to get the index
     * @return {object} The field data (including the index) that was selected
     * @private
     */
    _getSelectedFieldType: function (data, value) {
        let field = null;

        for (var idx in data) {
            if (data[idx].payload == value) {
                field = data[idx];
                field.index = idx;
                break;
            }
        }

        return field;
    }
});

// Check for commonjs
if (module) {
    module.exports = CustomFields;
}

export default CustomFields;
