import React from 'react';
import DefinitionModel from '../../models/entity/Definition';

// Chamel Controls
import TextField from 'chamel/lib/Input/TextField';
import IconButton from 'chamel/lib/Button/IconButton';
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import MenuItem from 'chamel/lib/Menu/MenuItem';
import Menu from 'chamel/lib/Menu/Menu';
import RaisedButton from 'chamel/lib/Button/RaisedButton';
import Popover from 'chamel/lib/Popover/Popover';
import Popover from 'chamel/lib/Popover/Popover';

/**
 * Create a DropDown that shows all fields for an object type
 */
/**
 * Displays the sort order used in the advanced search.
 */
class FieldsDropDown extends React.Component {

  static propTypes = {

    /**
     * The definition data that will be used to display the fields in FieldsDropdown.
     *
     * @type {object}
     */
    definitionData: React.PropTypes.object.isRequired,

    /**
     * Callback called when the user selects a field
     *
     * @var {function}
     */
    onChange: React.PropTypes.func,

    /**
     * Callback called when the user selects the child field
     *
     * This is only used when we have a submenu
     *
     * @var {function}
     */
    onChildClick: React.PropTypes.func,

    /**
     * Option to show one level deep of referenced entity fields
     *
     * This is useful if working with things like an entity index
     * that can query across entity types. For example, lead.owner.name
     *
     * @var {int}
     */
    showReferencedFields: React.PropTypes.number,

    /**
     * Flag to indicate if we should include read-only fields
     *
     * If we are querying fields then of course we would want to
     * but if we are setting anything then we probably don't want
     * read-only fields to even show up in the list.
     *
     * @var {bool}
     */
    showReadOnlyFields: React.PropTypes.bool,

    /**
     * Optional list of field types to exclude from the list
     *
     * @var {array}
     */
    hideFieldTypes: React.PropTypes.array,

    /**
     * Optional list of field subtypes to include from the list
     *
     * If left blank, this means that we are displaying all subtypes
     *
     * @var {array}
     */
    filterFieldSubtypes: React.PropTypes.array,

    /**
     * The field that was selected
     *
     * @var {string}
     */
    selectedField: React.PropTypes.string,

    /**
     * Optional data that will be added in the menu data.
     *
     * If we need a custom data added in the dropdown that is not available in the entity fields
     *  then we will specify them in this variable.
     *
     * For this example, if want to display an option to select a specific user then we set it here
     * data[0]: {
         *  value: browse,
         *  text: select specific user
         * }
     *
     * @var {array}
     */
    additionalMenuData: React.PropTypes.array,

    /**
     * Optional This will transform/format the selected field value.
     *
     * The normal/unformatted selected field value is field.name (e.g. customer_id)
     * If fieldFormat is available based on our example, the selected field value value will be <%customer_id%>
     *
     * fieldFormat = {
         *  prepend: '<%',
         *  append: '%>'
         * }
     *
     * @var {array}
     */
    fieldFormat: React.PropTypes.object,

    /**
     * This will determine that we are dealing with referenced entity.
     *
     * parentField will be used if the showReferencedFields value is greater than zero
     * This means that we are displaying a submenu.
     * Submenu will always have a parentField since we need to append the parentField.name to the submenu field value
     *
     * @type {entity/definition/Field}
     */
    parentField: React.PropTypes.object,

    /**
     * The label of the first entry of the dropdown
     *
     * Sample: 'Select User Field'
     *
     * @type {string}
     */
    firstEntryLabel: React.PropTypes.string
  };

  static defaultProps = {
    showReadOnlyFields: true,
    filterFieldSubtypes: [],
    hideFieldTypes: [],
    firstEntryLabel: 'Select Field',
    showReferencedFields: 0,
    fieldFormat: {
      prepend: '',
      append: ''
    }
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      openMenu: false
    };
  };

  /**
   * Render the dropdown containing all fields
   */
  render() {
    let fieldData = this._getFieldData();

    if (!fieldData) {
      // Field definition is not provided or error while retrieving the fields
      return (
        <div>{"No fields to display."}</div>
      );
    }

    // If showReferencedFields is 0 and we dont have props.parentField then we will just show the dropdown
    if (!this.props.parentField && this.props.showReferencedFields == 0) {
      let selectedFieldIndex = (this.props.selectedField) ?
        this._getSelectedIndex(fieldData, this.props.selectedField) : 0;

      return (
        <DropDownMenu
          menuItems={fieldData}
          selectedIndex={parseInt(selectedFieldIndex)}
          onChange={this._handleFieldChange}
        />
      );
    } else {

      // Since showReferencedFields is greater than 0, then we will display a menu
      let menuItems = [];

      // Loop thru the fieldData to get the entity fields for this objType
      for (let idx in fieldData) {
        let field = fieldData[idx];
        let fieldText = field.text;

        // If the field has a prefix, then we will prepend it in the fieldText
        if (field.prefix) {
          fieldText = field.prefix + ' - ' + fieldText;
        }

        // Just push the menuItem in the menuItems array
        menuItems.push(
          <MenuItem
            key={idx + 'main'}
            index={parseInt(idx)}
            onClick={this._handleSelectMenuItem.bind(this, field)}>
            {fieldText}
          </MenuItem>
        );

        /*
         * If the current field is an object and has a subtype and the showReferencedFields is greater than zero
         *  then we will use this field as a parent and get the fields and reference it
         *  We will use this field's subtype as the objType
         */
        if (field.details
          && field.details.subtype
          && field.details.type == field.details.types.object
          && this.props.showReferencedFields > 0) {

          // Transfer the props to the child props
          let {...childProps} = this.props;

          // Override the props to determine that this is a referenced field (child field)
          childProps.parentField = field;
          childProps.objType = field.details.subtype;

          // We will decrement the showReferencedFields to determine that we have searched 1 level deep
          childProps.showReferencedFields = (this.props.showReferencedFields - 1);

          // When clicking the submenu field, we need to let the parent know to hide the menu
          childProps.onChildClick = this._handlePopoverRequestClose;

          menuItems.push(
            <FieldsDropDown
              {...childProps}
              key={idx + 'child'}
            />
          );
        }
      }

      // If we have props.parentField this means that we are dealing a subMenu field so we will return the child <MenuItem/>
      if (this.props.parentField) {
        return (
          <div>
            {menuItems}
          </div>
        );
      } else {
        return (
          <div>
            <RaisedButton
              onClick={this._handlePopoverDisplay}
              label={this.props.firstEntryLabel}
            />
            <Popover
              open={this.state.openMenu}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this._handlePopoverRequestClose}>
              <Paper zDepth={1}>
                <div>
                  <Menu>
                    {menuItems}
                  </Menu>
                </div>
              </Paper>
            </Popover>
          </div>
        );
      }
    }
  };

  /**
   * Callback used to handle commands when user clicks the button to display the menu in the popover
   *
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @private
   */
  _handlePopoverDisplay = (e) => {

    // This prevents ghost click.
    e.preventDefault();

    this.setState({
      openMenu: this.state.openMenu ? false : true,
      anchorEl: e.currentTarget
    });
  };

  /**
   * Callback used to close the popover
   *
   * @private
   */
  _handlePopoverRequestClose() {
    this.setState({openMenu: false});
  };

  /**
   * Callback used to handle commands when user selects a field name
   *
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @param {int} key The index of the menu clicked
   * @param {Object} data The object value of the menu clicked
   * @private
   */
  _handleFieldChange = (e, key, data) => {
    if (this.props.onChange) {
      let value = this.props.fieldFormat.prepend + data.payload + this.props.fieldFormat.append;
      this.props.onChange(value);
    }
  };

  /**
   * Callback used to handle commands when user selects a field name
   *
   * @param {Object} data The object value of the menu clicked
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @param {int} key The index of the menu clicked
   * @private
   */
  _handleSelectMenuItem = (data, e, key) => {
    if (this.props.onChange) {
      let value = this.props.fieldFormat.prepend + data.payload + this.props.fieldFormat.append;
      this.props.onChange(value);
    }

    if (this.props.onChildClick) {
      this.props.onChildClick();
    } else {
      this.setState({openMenu: false});
    }
  };

  /**
   * Gets the index of a field based on the name
   *
   * @param {Array} data Array of data that will be mapped to get the index of the saved field/operator/blogic value
   * @param {string} value The value that will be used to get the index
   * @private
   */
  _getSelectedIndex = (data, value) => {
    let index = 0;
    for (let idx in data) {
      if (data[idx].payload == value) {
        index = idx;
        break;
      }
    }

    return index;
  };

  /**
   * Prepares the field menu data to be used in a dropdown menu
   *
   * @private
   */
  _getFieldData = () => {

    if (!this.props.definitionData) {
      return null;
    }

    const definition = new DefinitionModel(this.props.definitionData);
    let fields = definition.getFields();

    // Set list of fields to Load
    let data = [];

    // If no field name has been selected, enter a first explanation entry
    if (!this.props.selectedField
      && !this.props.parentField
      && this.props.showReferencedFields == 0) {
      data.push({
        payload: "",
        text: this.props.firstEntryLabel
      });
    }

    for (let idx in fields) {
      let field = fields[idx];

      // Skip read-only fields if not set to be displayed
      if (!this.props.showReadOnlyFields && field.readonly) {
        continue;
      }

      // Skip fields with types that have been hidden
      if (this.props.hideFieldTypes.indexOf(field.type) !== -1) {
        continue;
      }

      /*
       * Skip fields with subtypes that have been set as filtered
       * If we have not specified any filterFieldSubtypes, then we assume that we will dispaly all subtypes
       */
      if (this.props.filterFieldSubtypes.length && this.props.filterFieldSubtypes.indexOf(field.subtype) === -1) {
        continue;
      }

      let prefix = '',
        childPrefix = '',
        parentNamePrepend = '',
        fieldTitle = field.title;

      // If we have props.parentField, then we will prepend it in the field.name
      if (this.props.parentField) {
        parentNamePrepend = this.props.parentField.payload + '.';

        // Setup the prefix to specify that we are displaying a child field
        prefix = this.props.parentField.prefix + "\u00A0\u00A0\u00A0\u00A0";
        fieldTitle = this.props.parentField.details.title + '.' + fieldTitle;
      }

      data.push({
        payload: parentNamePrepend + field.name,
        text: fieldTitle,
        prefix: prefix,
        details: field
      });
    }

    // If we have additional custom menu data, then lets add it in our field data
    if (this.props.additionalMenuData && !this.props.parentField) {
      this.props.additionalMenuData.map(function (additionalData) {
        data.push(additionalData);
      })
    }

    return data;
  };
}

export default FieldsDropDown;
