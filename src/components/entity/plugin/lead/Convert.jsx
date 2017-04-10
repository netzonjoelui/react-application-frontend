/**
 * Plugin for converting a lead
 */
import React from 'react';
import Where from '../../../../models/entity/Where';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import Checkbox from 'chamel/lib/Toggle/Checkbox';
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import FlatButton from 'chamel/lib/Button/FlatButton';
import IconButton from 'chamel/lib/Button/IconButton';
import RadioButton from 'chamel/lib/Picker/RadioButton';
import RadioPicker from 'chamel/lib/Picker/RadioPicker';
import TextField from 'chamel/lib/Input/TextField';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import BorderColorIcon from 'chamel/lib/icons/font/BorderColorIcon';

/**
 * Constants used to determine which customer type will be used as reference when converting the lead
 *
 * @type {Object}
 */
var customerTypes = {
    PERSON: {type: 1, label: 'Person', text: 'Person / Contact'},
    ORGANIZATION: {type: 2, label: 'Organization', text: 'Organization / Account'}
}

var Convert = React.createClass({

    /**
     * Expected props
     */
    propTypes: {

        /**
         * The lead entity being converted
         *
         * @type {Entity}
         */
        entity: React.PropTypes.object,

        /**
         * Function that will get an existing entity using objType and entityId as arguments
         *
         * @type {function}
         */
        loadEntity: React.PropTypes.func,

        /**
         * Function that will create a new entity
         *
         * @type {function}
         */
        createEntity: React.PropTypes.func,

        /**
         * Function that will save an entity
         *
         * @type {function}
         */
        saveEntity: React.PropTypes.func,

        /**
         * Function that should be called when we are finished converting a lead
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

    /**
     * We need to set the intial state values.
     *
     * For customerType: since it is either PERSON or ORGANIZATION, we need to evaulate if the lead has a name
     */
    getInitialState: function () {

        // Get the Lead's first/last name so we can evaulate if we are setting the customerType as PERSON or ORGANIZATION
        var first_name = this.props.entity.getValue('first_name');
        var last_name = this.props.entity.getValue('last_name');
        var customerType = null;

        // Determine which customer type will be set as default.
        if (first_name || last_name) {
            customerType = customerTypes.PERSON;
        } else {
            customerType = customerTypes.ORGANIZATION;
        }

        return ({
            /**
             * This customer entity will contain either existing or new data.
             *
             * If the user selects an existing customer, then we will load the customer entity and save it to this state
             *
             * @type {Entity}
             */
            customerEntity: null,

            /**
             * If the user decides to create an opportunity, then we will save that entity to the state.opportunityEntity
             *
             * @type {Entity}
             */
            opportunityEntity: null,

            /**
             * This will determine what type of customer to reference
             *
             * This will contain one of the values of the customerTypes
             * Please refer to customerTypes object
             *
             * @type {Object/customerTypes}
             */
            customerType: customerType,

            /**
             * Flag that will tell the plugin if we will create an opportunity or not
             *
             * @type {Bool}
             */
            createOpportunity: true,

            /**
             * This will contain the details of the selected existing customer
             * Selected existing customer will be referenced to new opportunity (if created)
             *  and will be referenced also to this lead entity (this.props.entity)
             *
             * @type {Object}
             */
            selectedExisting: {id: null, name: null}
        });
    },

    componentDidMount: function () {
        this._setInputValues();
    },

    componentDidUpdate: function () {
        this._setInputValues();
    },

    render: function () {

        var displayTypeDropDown = null;
        var customerType = this.state.customerType;
        var first_name = this.props.entity.getValue('first_name');
        var last_name = this.props.entity.getValue('last_name');
        var company = this.props.entity.getValue('company');

        // If the lead has both first/last name and a company name, then we need to let the user pick which info to use (organization or person)
        if ((first_name || last_name) && company) {
            var menuItems = [
                {
                    type: customerTypes.PERSON,
                    text: customerTypes.PERSON.text
                },
                {
                    type: customerTypes.ORGANIZATION,
                    text: customerTypes.ORGANIZATION.text
                }
            ];

            /*
             * This will display the dropdown for convert type
             *
             * We need to decrement the customerType.type by 1 since we are not using zero-index in our customerType.type
             * While DropDownMenu is using a zero-index.
             */
            var displayTypeDropDown = (
                <DropDownMenu
                    menuItems={menuItems}
                    selectedIndex={customerType.type-1}
                    onChange={this._handleTypeMenuSelect}/>
            );
        }

        // Specify the labels of the radiobuttons depending on what covert type is selected
        var newLabel = null;
        if (customerType === customerTypes.ORGANIZATION) {
            newLabel = 'Create a new organization from from company name in lead';
        } else {
            newLabel = 'Create a new person from lead';
        }

        // If create opportunity is checked, then we will display the opportunity name
        var displayOpportunityName = null;
        if (this.state.createOpportunity) {
            displayOpportunityName = (
                <TextField
                    ref='opportunityName'
                    floatingLabelText='Opportunity Name'/>
            );
        }

        // Determine if we need to display the toolbar or just the icon button
        var toolBar = null;
        if (!this.props.hideToolbar) {
            var elementLeft = (
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

        // If we have an existing organization/person selected, then we will display it
        var displaySelectedExisting = null;
        if (this.state.selectedExisting.id) {
            displaySelectedExisting = (
                <div className='entity-form-group-label-selected'>
                    {this.state.selectedExisting.name}
                    <IconButton
                        tooltip='Change'
                        onClick={this._handleSelectExisting}>
                        <BorderColorIcon />
                    </IconButton>
                </div>
            )
        }

        return (
            <div className='entity-form'>
                {toolBar}
                <div className="entity-form-header-label">
                    Once you have qualified a lead as a potential customer, it can be converted to an
                    organziation/account, a contact, and an optional sales opportunity.
                </div>
                <div className='entity-form-group'>
                    {displayTypeDropDown}
                    <RadioPicker
                        name='inputMonthly'
                        ref='radioActionType'
                        defaultSelected='new'
                        onChange={this._handleRadioChange}>
                        <RadioButton
                            value='new'
                            label={newLabel}/>
                        <RadioButton
                            value='existing'
                            label={'Select existing ' + customerType.label.toLowerCase()}/>
                    </RadioPicker>
                    {displaySelectedExisting}
                </div>
                <div className='entity-form-group'>
                    <Checkbox
                        ref='createOpportunity'
                        value='create'
                        label='Create Sales Opportunity'
                        defaultSwitched={this.state.createOpportunity}
                        onCheck={this._handleCheckboxToggle}/>
                    {displayOpportunityName}
                </div>
                <div className='entity-form-group'>
                    <FlatButton label='Convert' onClick={this._handleConvertLead}/>
                </div>
            </div>
        );
    },

    /**
     * Respond when the user clicks the back button
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
     * Callback used to handle the selecting of convert type dropdown field
     *
     * @param {DOMEvent} evt Reference to the DOM event being sent
     * @param {int} key The index of the menu clicked
     * @param {array} menuItem The object value of the menu clicked
     * @private
     */
    _handleTypeMenuSelect: function (evt, key, menuItem) {
        this.setState({customerType: menuItem.type});
    },

    /**
     * Handles the toggling of sales opportunity checkbox
     *
     * @param {DOMEvent} e Reference to the DOM event being sent
     * @param {bool} isChecked The current state of the checkbox
     * @private
     */
    _handleCheckboxToggle: function (e, isChecked) {
        this.setState({createOpportunity: isChecked})
    },

    /**
     * Set intial values for the input text for opportunityName
     * @private
     */
    _setInputValues: function () {
        var opportunityName = null;

        if (this.state.customerType === customerTypes.ORGANIZATION) {
            opportunityName = this.props.entity.getValue('company');
        } else {
            opportunityName = this.props.entity.getName();
        }

        if (this.refs.opportunityName) {
            this.refs.opportunityName.setValue(opportunityName);
        }
    },

    /**
     * Callback used to handle the changing of radio button between create new and select existing
     *
     * @param {DOMEvent} e Reference to the DOM event being sent
     * @param {string} newSelection The new selected value
     * @private
     */
    _handleRadioChange: function (e, newSelection) {

        if (newSelection === 'existing') {
            this._handleSelectExisting();
        } else {
            this._handleExistingSelected(null, null);
        }
    },

    /**
     * Callback used to display the entity browser and let the user select an existing customer
     *
     * @private
     */
    _handleSelectExisting: function () {

        // Create a filter for customer type (organization or person)
        var filter = new Where('type_id');
        filter.equalTo(this.state.customerType.type);

        console.error("Not yet implemented");

        /*
         * We require it here to avoid a circular dependency where the
         * controller requires the view and the view requires the controller
         *
        var BrowserController = require('../../../../controller/EntityBrowserController');
        var browser = new BrowserController();
        browser.load({
            type: controller.types.DIALOG,
            title: 'Select ' + this.state.customerType.label,
            objType: 'customer',
            filters: [filter],
            onSelect: function (objType, id, name) {
                this._handleExistingSelected(id, name);
            }.bind(this)
        });
        */
    },

    /**
     * Callback used to handle the selecting of existing customer and saving it to the state
     *
     * @param {int} id The selected customer id
     * @param {string} name The selected customer name
     * @private
     */
    _handleExistingSelected: function (id, name) {
        var selectedExisting = {
            id: id,
            name: name
        }
        this.setState({selectedExisting: selectedExisting})
    },

    /**
     * Function that will be called when converting a lead is finished
     * @private
     */
    _handleFinishedConvert: function () {
        if (this.props.onActionFinished) this.props.onActionFinished();
    },

    /**
     * Handles the converting of lead
     *
     * @private
     */
    _handleConvertLead: function () {

        var customerEntity = null;

        // If the user has selected an existing customer then we will just load that customer entity using the customer id
        if (this.refs.radioActionType.getSelectedValue() === 'existing' && this.state.selectedExisting.id) {
            customerEntity = this.props.loadEntity('customer', this.state.selectedExisting.id);
        } else {

            // If the selected radio button is to create new customer, then we will create a new customer entity
            customerEntity = this.props.createEntity('customer');
            customerEntity.setValue('type_id', this.state.customerType.type);

            if (this.state.customerType === customerTypes.ORGANIZATION) {

                // Set the value of the company
                customerEntity.setValue('company', this.props.entity.getValue('company'));
            } else {

                // Set the values of the firstname and last name
                customerEntity.setValue('first_name', this.props.entity.getValue('first_name'));
                customerEntity.setValue('last_name', this.props.entity.getValue('last_name'));
            }
        }

        var callbackFunction = null;

        /*
         * If create opportunity checkbox is checked
         *  then lets set a callback function that will create the opportunity
         */
        if (this.state.createOpportunity) {
            callbackFunction = this._createOpportunityEntity;
        } else {

            // If we are not going to create an opportunity entity, then lets update the lead entity after saving the customer
            callbackFunction = this._updateLeadEntity;
        }

        // Save the customer entity and set the callback to update the referenced objects
        this.props.saveEntity(customerEntity, callbackFunction);

        // Set the customerEntity state to be used later when updating the lead entity (this.props.entity)
        this.setState({customerEntity: customerEntity});
    },

    /**
     * Creates the opportunity entity
     *
     * @private
     */
    _createOpportunityEntity: function () {

        var opportunityEntity = this.props.createEntity('opportunity');
        opportunityEntity.setValue('name', this.refs.opportunityName.getValue());

        var customer_id = null;

        if (this.state.selectedExisting.id) {

            // The user has selected an existing customer to link with the opportunity
            customer_id = this.state.selectedExisting.id;
        } else if (this.state.customerEntity) {

            // If we have a customerEntity created, then lets use its customer id
            customer_id = this.state.customerEntity.id;
        }

        opportunityEntity.setValue('customer_id', customer_id);
        this.props.saveEntity(opportunityEntity, this._updateLeadEntity);

        // Set the opportunityEntity state to be used later when updating the lead entity (this.props.entity)
        this.setState({opportunityEntity: opportunityEntity});
    },

    /**
     * Updates the lead entity (this.props.entity) references
     *
     * @private
     */
    _updateLeadEntity: function () {

        // Make sure that we have a customerEntity before we update the customer_id reference
        if (this.state.customerEntity) {
            this.props.entity.setValue('converted_customer_id', this.state.customerEntity.id);
        }

        // Only update the lead's opportunity if the user decides to create an opportunity
        if (this.state.opportunityEntity) {
            this.props.entity.setValue('converted_opportunity_id', this.state.opportunityEntity.id);
        }

        this.props.entity.setValue('f_converted', true);

        // Save the lead entity and set the callback function
        this.props.saveEntity(this.props.entity, this._handleFinishedConvert);
    }
});

// Check for commonjs
if (module) {
    module.exports = Convert;
}

export default Convert;
