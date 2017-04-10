/**
 * Render a single Where condition row
 */
import React from 'react';
import Where from '../../models/entity/Where';
import definitionLoader from '../../models/entity/definitionLoader';
import Field from '../../models/entity/definition/Field';
import ObjectSelect from './ObjectSelect.jsx';
import EntityGroupingSelectContainer from '../../containers/EntityGroupingSelectContainer';

// Chamel Controls
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import GridContainer from 'chamel/lib/Grid/Container';
import GridRow from 'chamel/lib/Grid/Row';
import GridColumn from 'chamel/lib/Grid/Column';
import IconButton from 'chamel/lib/Button/IconButton';
import TextField from 'chamel/lib/Input/TextField';

// Chamel Icons
import CancelIcon from 'chamel/lib/icons/font/CancelIcon';

let bLogicMenu = [
    {payload: 'and', text: 'And'},
    {payload: 'or', text: 'Or'},
];

let boolInputMenu = [
    {payload: 'true', text: 'true'},
    {payload: 'false', text: 'false'},
];

/**
 * Display a UI representation of a single Where model for entity conditions
 */
var WhereComponent = React.createClass({

    propTypes: {
        /**
         * The current offset in a list of Where objects (conditions)
         *
         * @var {int}
         */
        index: React.PropTypes.number.isRequired,

        /**
         * The object type we are querying
         *
         * @var {string}
         */
        objType: React.PropTypes.string,

        /**
         * Callback called when the user removes this where condition
         *
         * @var {function}
         */
        onRemove: React.PropTypes.func,

        /**
         * Callback called when the user changes this where condition
         *
         * @var {function}
         */
        onChange: React.PropTypes.func,

        /**
         * Where condition being modified
         *
         * @var {entity/Where}
         */
        where: React.PropTypes.object.isRequired,
    },

    /**
     * Setup the starting place for the state
     */
    getInitialState: function () {
        // Return the initial state
        return {
            entityDefinition: null,
        };
    },

    /**
     * We have entered the DOM
     */
    componentDidMount: function () {
        definitionLoader.get(this.props.objType, function (def) {
            this._handleEntityDefinititionLoaded(def);
        }.bind(this));
    },

    /**
     * Render the Where condition row
     */
    render: function () {

        if (!this.state.entityDefinition) {
            // Entity definition is loading still so return an empty div
            return (<div />);
        }

        let bLogicComponent = null;
        let operators = null;
        let selectedOperatorIndex = 0;

        let field = null;
        let seletedFieldIndex = 0;
        let operatorsComponent = null;
        let valueComponent = null;

        // If this is not the first where condition, print the boolean logic operator
        if (this.props.index !== 0) {
            let bLogicSelectedIndex = this._getSelectedIndex(bLogicMenu, this.props.where.bLogic);
            bLogicComponent = (
                <DropDownMenu
                    menuItems={bLogicMenu}
                    selectedIndex={parseInt(bLogicSelectedIndex)}
                    onChange={this._handleBlogicClick}
                />
            );
        }

        if (this.props.where.fieldName) {
            field = this.state.entityDefinition.getField(this.props.where.fieldName);
        }

        // Set list of fields to Load
        let fieldData = [];

        // If no field name has been selected, enter a first explanation entry
        if (!field) {
            fieldData.push({
                payload: "",
                text: "Select Field"
            });
        }

        // TOOD: We should add sub-fields for cross entity reference
        let fields = this.state.entityDefinition.getFields();
        for (let i in fields) {
            fieldData.push({
                payload: fields[i].name,
                text: fields[i].title
            });
        }
        seletedFieldIndex = this._getSelectedIndex(fieldData, this.props.where.fieldName);

        // Get operators data
        if (field) {
            operators = this._getConditionOperators(field.type);
            selectedOperatorIndex = this._getSelectedIndex(operators, this.props.where.operator);

            // Construct operator we have operator data
            operatorsComponent = (
                <DropDownMenu
                    menuItems={operators}
                    selectedIndex={parseInt(selectedOperatorIndex)}
                    onChange={this._handleOperatorClick}
                />
            );
        }

        // Get the value input
        if (field) {
            valueComponent = this._getConditionValueInput(field, this.props.where.value);
        }

        return (
            <GridRow>
                <GridColumn small={12} medium={1}>
                    {bLogicComponent}
                </GridColumn>
                <GridColumn small={12} medium={3}>
                    <DropDownMenu
                        menuItems={fieldData}
                        selectedIndex={parseInt(seletedFieldIndex)}
                        onChange={this._handleFieldClick}/>
                </GridColumn>
                <GridColumn small={12} medium={3}>
                    {operatorsComponent}
                </GridColumn>
                <GridColumn small={6} medium={4}>
                    {valueComponent}
                </GridColumn>
                <GridColumn small={6} medium={1}>
                    <IconButton
                        onClick={this._handleRemoveCondition}
                        tooltip="Remove Condition">
                        <CancelIcon />
                    </IconButton>
                </GridColumn>
            </GridRow>
        );
    },

    /**
     * Callback used to handle commands when user selects the a value in bLogic dropdown
     *
     * @param {DOMEvent} e          Reference to the DOM event being sent
     * @param {int} key             The index of the menu clicked
     * @param {array} menuItem      The object value of the menu clicked
     * @private
     */
    _handleBlogicClick: function (e, key, menuItem) {

        // Copy original where
        let where = new Where(this.props.where.fieldName);

        where.bLogic = menuItem.payload;

        // Send new where to parent
        if (this.props.onChange) {
            this.props.onChange(this.props.index, where);
        }
    },

    /**
     * Callback used to handle commands when user selects the a value in operator dropdown
     *
     * @param {DOMEvent} e          Reference to the DOM event being sent
     * @param {int} key             The index of the menu clicked
     * @param {array} menuItem      The object value of the menu clicked
     * @private
     */
    _handleOperatorClick: function (e, key, menuItem) {

        // Create a new where and copy it from the previous
        let where = new Where(this.props.where.fieldName);
        where.fromData(this.props.where.toData());

        // Set the new operator
        where.operator = menuItem.payload;

        // Send new where to parent
        if (this.props.onChange) {
            this.props.onChange(this.props.index, where);
        }
    },

    /**
     * Handles blur on the value input
     *
     * @param {DOMEvent} e      Reference to the DOM event being sent
     * @private
     */
    _handleValueInputBlur: function (e) {

        // Create a new where and copy it from the previous
        let where = new Where(this.props.where.fieldName);
        where.fromData(this.props.where.toData());

        // Set the new value
        where.value = e.target.value;

        // Send new where to parent
        if (this.props.onChange) {
            this.props.onChange(this.props.index, where);
        }
    },

    /**
     * Callback used to handle commands when user selects a value in the dropdown groupings input
     *
     * @param {string} payload  The value of the selected menu
     * @param {string} text     The text of the selected menu
     * @private
     */
    _handleGroupingSelect: function (payload, text) {

        // Create a new where and copy it from the previous
        let where = new Where(this.props.where.fieldName);
        where.fromData(this.props.where.toData());

        // Set the new value
        where.value = payload;

        // Send new where to parent
        if (this.props.onChange) {
            this.props.onChange(this.props.index, where);
        }
    },

    /**
     * Callback used to handle commands when user selects a value in the dropdown if the value input is a boolean type
     *
     * @param {DOMEvent} e          Reference to the DOM event being sent
     * @param {int} key             The index of the menu clicked
     * @param {array} menuItem      The object value of the menu clicked
     * @private
     */
    _handleValueSelect: function (e, key, menuItem) {

        // Create a new where and copy it from the previous
        let where = new Where(this.props.where.fieldName);
        where.fromData(this.props.where.toData());

        // Set the new value
        where.value = menuItem.payload;

        // Send new where to parent
        if (this.props.onChange) {
            this.props.onChange(this.props.index, where);
        }
    },

    /**
     * Callback used to handle commands when user selects a field name in the condition search
     *
     * @param {DOMEvent} e        Reference to the DOM event being sent
     * @param {int} key        The index of the menu clicked
     * @param {array} field    The object value of the menu clicked
     * @private
     */
    _handleFieldClick: function (e, key, data) {

        // Create a new where and copy from original but overwrite the fieldName
        let where = new Where(data.payload);
        where.bLogic = this.props.where.bLogic;

        /*
         * We do not copy operator or value since we cannot assume
         * the new field type supports the same operator and value type
         * as was previously set
         */
        if (this.props.onChange) {
            this.props.onChange(this.props.index, where);
        }
    },

    /**
     * Callback used to handle commands when user selects a value in the object select
     *
     * @param {int} oid The unique id of the entity selected
     * @param {string} title The human readable title of the entity selected
     * @private
     */
    _handleSetValue: function (oid, title) {

        // Create a new where and copy from original but overwrite the fieldName
        let where = new Where(this.props.where.fieldName);
        where.value = oid;

        // Send new where to parent
        if (this.props.onChange) {
            this.props.onChange(this.props.index, where);
        }
    },

    /**
     * Removes the contidion
     *
     * @private
     */
    _handleRemoveCondition: function () {
        if (this.props.onRemove) {
            this.props.onRemove(this.props.index);
        }
    },

    /**
     * Get the search condition input type based on the field type selected
     *
     * @param {array} field                Collection of the field selected information
     * @param {string} value           The default value or initial value
     * @private
     */
    _getConditionValueInput: function (field, value) {
        let valueInput = null;

        switch (field.type) {
            case Field.types.fkey:
            case Field.types.fkeyMulti:
                valueInput = (
                  <EntityGroupingSelectContainer
                    onChange={this._handleGroupingSelect}
                    objType={this.props.objType}
                    fieldName={field.name}
                    allowNoSelection={false}
                    label={'none'}
                    selectedValue={value}
                  />
                );
                break;

            case Field.types.object:

                let label = null;

                // Since <ObjectSelect> is accepting value as string, we need to convert the value to string.
                if (value !== null) {
                    value = value.toString();
                }

                valueInput = (
                    <ObjectSelect
                        onChange={this._handleSetValue}
                        objType={this.props.objType}
                        subType={field.subtype}
                        field={field}
                        value={value}/>
                );
                break;

            case Field.types.bool:
                if (null === value) {
                    value = boolInputMenu[0].payload;
                }

                valueInput = (
                    <DropDownMenu
                        onChange={this._handleValueSelect}
                        selectedIndex={ ( value.toString() === 'true' ? 0 : 1 )}
                        menuItems={boolInputMenu}/>
                );
                break;

            default:
                valueInput = (
                    <TextField
                        onBlur={this._handleValueInputBlur}
                        hintText="Search" value={value}/>
                );
                break;
        }

        return valueInput;
    },

    /**
     * Get the search condition operator based on the field type selected
     *
     * @param {string} fieldType    The type of the field
     * @private
     */
    _getConditionOperators: function (fieldType) {
        let fieldOperators = this.props.where.getOperatorsForFieldType(fieldType)
        let operators = [];

        for (let idx in fieldOperators) {
            operators.push({
                payload: idx,
                text: fieldOperators[idx]
            });
        }

        return operators;
    },

    /**
     * Gets the index of the saved field/operator/blogic value
     *
     * @param {array} data      Array of data that will be mapped to get the index of the saved field/operator/blogic value
     * @param {string} value    The value that will be used to get the index
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
     * Callback used when an entity definition loads (or changes)
     *
     * @param {EntityDefinition} def The loaded definition
     */
    _handleEntityDefinititionLoaded: function (entityDefinition) {
        this.setState({
            entityDefinition: entityDefinition
        });
    }
});

// Check for commonjs
if (module) {
    module.exports = WhereComponent;
}

export default WhereComponent;
