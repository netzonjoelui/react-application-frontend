import React from 'react';
import definitionLoader from "../../models/entity/definitionLoader";
import Field from "../../models/entity/definition/Field";
import ObjectSelect from "./ObjectSelect.jsx";
import EntityGroupingSelectContainer from "../../containers/EntityGroupingSelectContainer";
import GroupingChip from './GroupingChip.jsx';

// Chamel Controls
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import TextField from 'chamel/lib/Input/TextField';
import IconButton from 'chamel/lib/Button/IconButton';

let boolInputMenu = [
  {payload: 'true', text: 'true'},
  {payload: 'false', text: 'false'},
];

/**
 * Create a entity field input based on the field type
 */
class FieldInput extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {
    /**
     * The object type we are querying
     *
     * @var {string}
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * Callback called when the user selects a field
     *
     * @var {function}
     */
    onChange: React.PropTypes.func,

    /**
     * The name of the field we are editing
     *
     * @var {string}
     */
    fieldName: React.PropTypes.string.isRequired,

    /**
     * Optional title of the field we are editing
     *
     * @var {string}
     */
    fieldTitle: React.PropTypes.string,

    /**
     * Current value of the field input
     *
     * @var {mixed}
     */
    value: React.PropTypes.any,

    /**
     * If the field input is an object, then it should have a value label
     *
     * @var {string}
     */
    valueLabel: React.PropTypes.string,

    /**
     * Optional. The entity definition of the object
     *
     * If we are trying to display multiple input fields, we may want to provide the entityDefinition for faster performance
     *  so the component does not have to retrieve the entityDefinition everytime we load each input fields
     *
     * @var {object}
     */
    entityDefinition: React.PropTypes.object,

    /**
     * Flag that will determine if we are going to display the grouping chip, if the field type is fkey_multi
     *
     * This only apply if the field type if fkey_multi
     * The selected value from the field input will be changed from string|int into array
     *
     * @type {bool}
     */
    implementGroupingChip: React.PropTypes.bool
  };

  /**
   * Set some sane defaults
   */
  static defaultProps = {
    valueLabel: null,
    entityDefinition: null,
    fieldTitle: null
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);

    this.state = {
      entityDefinition: this.props.entityDefinition
    };
  };

  /**
   * We have entered the DOM
   */
  componentDidMount() {

    // If the entity definition is already provided, then we do not need to get the definition again
    if (!this.state.entityDefinition) {
      // Get the definition so we can get field details
      definitionLoader.get(this.props.objType, function (def) {

        this._handleEntityDefinititionLoaded(def);
      }.bind(this));
    }
  };

  /**
   * Render the dropdown containing all fields
   */
  render() {
    if (!this.state.entityDefinition) {
      // Entity definition is loading still so return an empty div
      return (<div />);
    }

    let field = this.state.entityDefinition.getField(this.props.fieldName);
    let value = this.props.value;
    let valueLabel = this.props.valueLabel;

    let chips = [];
    let groupingSelectLabel = 'none';

    switch (field.type) {
      case Field.types.fkeyMulti:

        // If the props.value is an array then lets loop thru it to get the actual values
        if (Array.isArray(this.props.value)) {
          for (let id in this.props.value) {

            // Setup the GroupingChip
            chips.push(
              <GroupingChip
                key={id}
                id={parseInt(id)}
                onRemove={this._handleRemove}
                name={this.props.value[id]}
              />
            );
          }
        }

        // Change the label so it will not be misleading
        groupingSelectLabel = "Select " + field.title;
        value = null;

      case Field.types.fkey:
        return (
          <div>
            <EntityGroupingSelectContainer
              onChange={this._handleGroupingSelect}
              objType={this.props.objType}
              fieldName={field.name}
              allowNoSelection={false}
              label={groupingSelectLabel}
              selectedValue={value}
            />
            {chips}
          </div>
        );

      case Field.types.object:
        return (
          <ObjectSelect
            onChange={this._handleObjectSelect}
            objType={this.props.objType}
            field={field}
            value={value}
            label={valueLabel}
          />
        );

      case Field.types.bool:
        return (
          <DropDownMenu
            onChange={this._handleValueSelect}
            selectedIndex={ ( (value && value.toString()) === 'true' ? 0 : 1 )}
            menuItems={boolInputMenu}
          />
        );

      default:
        return (
          <TextField
            floatingLabelText={this.props.fieldTitle}
            onBlur={this._handleValueInputBlur}
            value={value}
          />
        );
    }
  };

  /**
   * Callback used to handle commands when user selects a field name
   *
   * @param {mixed} value  Value to send to the callback
   * @private
   */
  _handleValueChange = (value, opt_fieldName) => {
    if (this.props.onChange) {
      let fieldName = opt_fieldName || this.props.fieldName;
      this.props.onChange(fieldName, value);
    }
  };

  /**
   * Callback used to handle commands when user selects a value in the dropdown groupings input
   *
   * @param {string} payload The value of the selected menu
   * @param {string} text The text of the selected menu
   * @private
   */
  _handleGroupingSelect = (payload, text) => {

    // Get the field definition
    let field = this.state.entityDefinition.getField(this.props.fieldName);
    let data = null;

    // Check what type of field we are dealing
    switch (field.type) {
      case field.types.fkeyMulti:

        /*
         * Check if the current props.value is already an array
         * Then we do not need to create the data array, instead we just push the selected value
         */
        if (Array.isArray(this.props.value)) {
          data = this.props.value;

          // Push the selected value into the data
          data[payload] = text;
        } else {

          // Convert the data as an array, then push the selected value
          data = new Array();

          // Now let's push the selected value into the data array
          data[payload] = text;
        }

        break;
      default:
        data = payload;
        break;
    }

    this._handleValueChange(data);
  };

  /**
   * Callback used to handle commands when user selects a value in the dropdown groupings input
   *
   * @param {string} oid The id of the selected entity
   * @param {string} name The name of the selected entity
   * @private
   */
  _handleObjectSelect = (oid, name) => {
    this._handleValueChange(oid);
    this._handleValueChange(name, this.props.fieldName + '_fval');
  };

  /**
   * Callback used to handle commands when user selects a value in the dropdown if the value input is a boolean type
   *
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @param {int} key The index of the menu clicked
   * @param {array} menuItem The object value of the menu clicked
   * @private
   */
  _handleValueSelect = (e, key, menuItem) => {
    this._handleValueChange(menuItem.payload);
  };

  /**
   * Handles blur on the value input
   *
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @private
   */
  _handleValueInputBlur = (e) => {
    this._handleValueChange(e.target.value);
  };

  /**
   * Callback used when an entity definition loads (or changes)
   *
   * @param {EntityDefinition} entityDefinition The loaded definition
   */
  _handleEntityDefinititionLoaded = (entityDefinition) => {
    this.setState({
      entityDefinition: entityDefinition
    });
  };

  /**
   * Handle the removing of value from the grouping field in the props.value using the value's index
   *
   * @param {string} id The unique id of the grouping to remove
   * @param {string} name Optional name value of the id
   */
  _handleRemove = (id, name) => {
    let data = this.props.value;

    delete data[id];
    this._handleValueChange(data);
  };
}

export default FieldInput;
