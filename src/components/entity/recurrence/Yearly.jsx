/**
 * Yearly recurrence pattern.
 * This will display the Yearly and YearNth type.
 * Yearly will accept monthOfYear and dayOfMonth input values.
 * YearlyNth will accept instance, monthOfYear, and dayOfWeek input values.
 */
import React from 'react';
import RecurrencePattern from '../../../models/entity/Recurrence';

// Chamel Controls
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import GridContainer from 'chamel/lib/Grid/Container';
import GridColumn from 'chamel/lib/Grid/Column';
import GridRow from 'chamel/lib/Grid/Row';
import RadioButton from 'chamel/lib/Picker/RadioButton';
import RadioPicker from 'chamel/lib/Picker/RadioPicker';
import TextField from 'chamel/lib/Input/TextField';

/**
 * Function that will get the index of the selected value from the menu items provided
 *
 * @param menuItems The menu items that are displayed in the dropdown
 * @param value The value that is currently selected
 * @returns {int} The index of the selected value
 */
const _getSelectedIndex = (menuItems, value) => {

  let selectedIndex = 0;
  menuItems.forEach((item, index) => {
    if (item.value == value) {
      selectedIndex = index;
    }
  });

  return selectedIndex;
};

// The yearly recurrence component.
const Yearly = (props) => {

  // Create an instance of RecurrencePattern
  const recurrencePattern = new RecurrencePattern();

  // Use the props.recurrencePatternData to populate the values of recurrencePattern
  recurrencePattern.fromData(props.recurrencePatternData);

  const recurrenceTypes = recurrencePattern.getRecurrenceTypes();
  const columnLabelStyle = {paddingTop: "25px"};
  const columnDropdownStyle = {paddingTop: "20px"};
  let displayType = null;

  if (recurrencePattern.type == recurrenceTypes.YEARLY) {
    displayType = (
      <GridRow>
        <GridColumn small={1} style={columnLabelStyle}>
          <label>{"Every"}</label>
        </GridColumn>

        <GridColumn small={2} style={columnDropdownStyle}>
          <DropDownMenu
            selectedIndex={_getSelectedIndex(recurrencePattern.getMonths(), recurrencePattern.monthOfYear)}
            onChange={(e, key, menuItem) => {
              props.onChange("updateProperty", {field: "monthOfYear", value: menuItem.value});
            }}
            menuItems={recurrencePattern.getMonths()}/>
        </GridColumn>

        <GridColumn small={2}>
          <TextField
            floatingLabelText="Day"
            type='number'
            onBlur={(e) => {
              props.onChange("updateProperty", {field: "dayOfMonth", value: e.target.value});
            }}
            value={recurrencePattern.dayOfMonth.toString()}/>
        </GridColumn>
      </GridRow>
    );
  } else { // This will display the Year-Nth Recurrence type

    displayType = (
      <GridRow>
        <GridColumn small={2} style={columnDropdownStyle}>
          <DropDownMenu
            menuItems={recurrencePattern.getInstance()}
            selectedIndex={_getSelectedIndex(recurrencePattern.getInstance(), recurrencePattern.instance)}
            onChange={(e, key, menuItem) => {
              props.onChange("updateProperty", {field: "instance", value: menuItem.value});
            }}/>
        </GridColumn>

        <GridColumn small={2} style={columnDropdownStyle}>
          <DropDownMenu
            menuItems={recurrencePattern.getDayOfWeekMenuData()}
            selectedIndex={recurrencePattern.getSelectedDay()[0].index}
            onChange={(e, key, menuItem) => {
              props.onChange("updateProperty", {field: "dayOfWeekMask", value: menuItem.value});
            }}/>
        </GridColumn>

        <GridColumn small={1} style={columnLabelStyle}>
          <label>{"of"}</label>
        </GridColumn>

        <GridColumn small={2} style={columnDropdownStyle}>
          <DropDownMenu
            menuItems={recurrencePattern.getMonths()}
            selectedIndex={_getSelectedIndex(recurrencePattern.getMonths(), recurrencePattern.monthOfYear)}
            onChange={(e, key, menuItem) => {
              props.onChange("updateProperty", {field: "monthOfYear", value: menuItem.value});
            }}/>
        </GridColumn>
      </GridRow>
    );
  }

  return (
    <GridContainer fluid>
      <GridRow>
        <RadioPicker
          inline={true}
          value={recurrencePattern.type}
          onChange={(newSelection) => {
            props.onChange("updateProperty", {field: "type", value: newSelection});
          }}>

          <RadioButton
            value={recurrenceTypes.YEARLY}
            label='Yearly'/>

          <RadioButton
            value={recurrenceTypes.YEARNTH}
            label='Year-nth'/>
        </RadioPicker>
      </GridRow>
      {displayType}
    </GridContainer>
  );
}

/**
 * The props that will be used in the Yearly recurrence
 */
Yearly.propTypes = {
  /**
   * The recurrence pattern data we are currently working with
   *
   * @type {object}
   */
  recurrencePatternData: React.PropTypes.object.isRequired,

  /**
   * Callback function that is called when there are any changes made to the recurrence pattern
   *
   * @type {func}
   */
  onChange: React.PropTypes.func
}

export default Yearly;
