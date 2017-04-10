/**
 * Monthly recurrence pattern.
 * This will display the Monthly and MonthNth type.
 * Monthly will accept dayOfMonth and interval input values.
 * MonthlyNth will accept instance, dayOfWeek, and interval input values.
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

// The monthly recurrence component.
const Monthly = (props) => {

  // Create an instance of RecurrencePattern
  const recurrencePattern = new RecurrencePattern();

  // Use the props.recurrencePatternData to populate the values of recurrencePattern
  recurrencePattern.fromData(props.recurrencePatternData);

  const recurrenceTypes = recurrencePattern.getRecurrenceTypes();
  const columnLabelStyle = {paddingTop: "25px"};
  const columnDropdownStyle = {paddingTop: "20px"};
  let displayType = null;

  if (recurrencePattern.type == recurrenceTypes.MONTHLY) {
    displayType = (
      <GridRow>
        <GridColumn small={2}>
          <TextField
            floatingLabelText="Day"
            type='number'
            onBlur={(e) => {
              props.onChange("updateProperty", {field: "dayOfMonth", value: e.target.value});
            }}
            value={recurrencePattern.dayOfMonth.toString()}/>
        </GridColumn>

        <GridColumn small={3} style={columnLabelStyle}>
          <label>{"of every"}</label>
        </GridColumn>

        <GridColumn small={2}>
          <TextField
            floatingLabelText="Month(s)"
            type='number'
            onBlur={(e) => {
              props.onChange("updateProperty", {field: "interval", value: e.target.value});
            }}
            value={recurrencePattern.interval.toString()}/>
        </GridColumn>
      </GridRow>
    );
  } else { // This will display the Month-Nth Recurrence type
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

        <GridColumn small={3} style={columnLabelStyle}>
          <label>{"of every"}</label>
        </GridColumn>

        <GridColumn small={2}>
          <TextField
            floatingLabelText="Month(s)"
            type='number'
            onBlur={(e) => {
              props.onChange("updateProperty", {field: "interval", value: e.target.value});
            }}
            value={recurrencePattern.interval.toString()}
          />
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
            value={recurrenceTypes.MONTHLY}
            label='Monthly'/>

          <RadioButton
            value={recurrenceTypes.MONTHNTH}
            label='Month-nth'/>
        </RadioPicker>
      </GridRow>
      {displayType}
    </GridContainer>
  );
}

/**
 * The props that will be used in the Monthly recurrence
 */
Monthly.propTypes = {
  /**
   * The recurrence pattern we are currently working with
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

export default Monthly;
