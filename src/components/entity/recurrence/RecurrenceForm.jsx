/**
 * Recurrence Form component.
 *
 * This will display the different recurrence pattern types.
 * The recurrence pattern will depend on what type is currently selected.
 *
 * DailyComponent will display the input for interval per day.
 * WeeklyComponent will display the input for interval per day and checkbox selection for days of week.
 *
 * MonthlyComponent will have 2 types (Monthly and MonthNth).
 * Monthly will display the inputs for interval per month and the day of the month.
 * MonthNth will display the dropdown for instance and day of week, and input for interval per month.
 *
 * YearlyComponent will have 2 types (Yearly and YearNth).
 * Yearly will display the dropdowns for month of year and input for day of the month.
 * YearNth will display the dropdowns for instance, day of the week, and  month of year.
 *
 */
import React from 'react';
import theme from './_recurrence.scss';
import RecurrencePattern from '../../../models/entity/Recurrence';
import Controls from '../../Controls';

// Recurrence Pattern Sub Components
import DailyComponent from './Daily';
import WeeklyComponent from './Weekly';
import MonthlyComponent from './Monthly';
import YearlyComponent from './Yearly';

// Chamel Controls
import Checkbox from 'chamel/lib/Toggle/Checkbox';
import DatePicker from 'chamel/lib/Picker/DatePicker';
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import IconButton from 'chamel/lib/Button/IconButton';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import CheckIcon from 'chamel/lib/icons/font/CheckIcon';

// Create an instance of RecurrencePattern so we can get the its constants
const RecurrencePatternModel = new RecurrencePattern();

// Get the types of recurrence
const recurrenceTypes = RecurrencePatternModel.getRecurrenceTypes();

// Get the types of recurrence that will be used as menu data
const recurrenceTypeMenuData = RecurrencePatternModel.getTypeMenuData();

// Specify the sub components that will be used based on the recurrence type
const SubRecurrenceComponents = {};
SubRecurrenceComponents[recurrenceTypes.DONOTREPEAT] = null;
SubRecurrenceComponents[recurrenceTypes.DAILY] = DailyComponent;
SubRecurrenceComponents[recurrenceTypes.WEEKLY] = WeeklyComponent;
SubRecurrenceComponents[recurrenceTypes.MONTHLY] = MonthlyComponent;
SubRecurrenceComponents[recurrenceTypes.MONTHNTH] = MonthlyComponent;
SubRecurrenceComponents[recurrenceTypes.YEARLY] = YearlyComponent;
SubRecurrenceComponents[recurrenceTypes.YEARNTH] = YearlyComponent;

/**
 * Gets the index of the selected recurrence type
 *
 * @param {array} data Array of data that will be mapped to get the index of the selected recurrence type
 * @param {string} value The value that will be used to get the index
 * @private
 */
const _getSelectedIndex = (data, value) => {
  let index = 0;
  let checkValue = value;

  /*
   * Since MONTHNTH and YEARNTH are not in the recurrenceTypeMenuData
   * then we need to change the check value to MONTHLY or YEARLY
   * so we can get the correct selected index.
   */
  if (value == recurrenceTypes.MONTHNTH) {
    checkValue = recurrenceTypes.MONTHLY;
  }

  if (value == recurrenceTypes.YEARNTH) {
    checkValue = recurrenceTypes.YEARLY;
  }

  for (let idx in data) {
    if (data[idx].value == checkValue) {
      index = idx;
      break;
    }
  }

  return index;
};

/**
 * Determine what type of recurrence to display
 *
 * @param {object} recurrencePatternData Contains the recurrence pattern data which will be used to display the sub component
 * @return {RecurrenceSubComponent} Returns the react component to display depending on the type argument
 * @private
 */
const _displayRecurrenceSubComponent = (recurrencePatternData) => {
  let displayPattern = null;

  const recurrencePattern = new RecurrencePattern();
  recurrencePattern.fromData(props.recurrencePatternData);

  switch (recurrencePattern.type) {
    case recurrenceTypes.DAILY:
      return (
        <DailyComponent
          recurrencePatternData={recurrencePattern.toData()}
          onChange={props.onChange}
        />
      );
      break;
    case recurrenceTypes.WEEKLY:
      return (
        <WeeklyComponent
          recurrencePatternData={recurrencePattern.toData()}
          onChange={props.onChange}
        />
      );
      break;
    case recurrenceTypes.MONTHLY:
    case recurrenceTypes.MONTHNTH:
      return (
        <MonthlyComponent
          recurrencePatternData={recurrencePattern.toData()}
          onChange={props.onChange}
        />
      );
      break;
    case recurrenceTypes.YEARLY:
    case recurrenceTypes.YEARNTH:
      return (
        <YearlyComponent
          recurrencePatternData={recurrencePattern.toData()}
          onChange={props.onChange}
        />
      );
      break;
    default: // Does not repeat
      return null;
      break;
  }
};

// Displays the recurrence form depending on what type of recurrence is set
const RecurrenceForm = (props) => {

  // Create an instance of RecurrencePattern
  const recurrencePattern = new RecurrencePattern();

  // Use the props.recurrencePatternData to populate the values of recurrencePattern
  recurrencePattern.fromData(props.recurrencePatternData);

  let displayEndDate = null;
  let neverEnds = true;

  // Display the end date input
  if (recurrencePattern.dateEnd) {
    neverEnds = false;
    displayEndDate = (
      <DatePicker
        floatingLabelText='End Date'
        value={recurrencePattern.getDateEnd()}
        type="date"
        onChange={(evt, date) => {
          props.onChange("updateProperty", {field: 'dateEnd', value: date});
        }}/>
    );
  }

  const selectedIndex = _getSelectedIndex(recurrenceTypeMenuData, recurrencePattern.type);
  const SubComponent = SubRecurrenceComponents[recurrencePattern.type];

  let displayPattern = null;
  if (SubComponent) {
    displayPattern = (
      <SubComponent
        recurrencePatternData={recurrencePattern.toData()}
        onChange={props.onChange}
      />
    );
  }

  return (
    <div>
      <div className={theme.recurrence}>
        <fieldset>
          <legend>{"Recurrence Pattern"}</legend>
          <div className={theme.recurrenceType}>
            <DropDownMenu
              selectedIndex={parseInt(selectedIndex)}
              menuItems={recurrenceTypeMenuData}
              onChange={(e, key, menuItem) => {
                props.onChange("updateProperty", {field: "type", value: menuItem.value});
              }}/>
          </div>
          <div className={theme.recurrencePattern}>
            {displayPattern}
          </div>
        </fieldset>

        <fieldset>
          <legend>Range of Recurrence</legend>

          <DatePicker
            floatingLabelText='Start Date'
            value={recurrencePattern.getDateStart()}
            type="date"
            onChange={(evt, date) => {
              props.onChange("updateProperty", {field: 'dateStart', value: date});
            }}/>

          {displayEndDate}

          <Checkbox
            value="default"
            label="Never Ends"
            checked={neverEnds}
            onChange={(evt, isChecked) => {
              if (isChecked) {
                props.onChange("updateProperty", {field: "dateEnd", value: null});
              } else {
                props.onChange("updateProperty", {field: "dateEnd", value: recurrencePattern.getDateEnd()});
              }
            }}/>
        </fieldset>
      </div>
    </div>
  );
}

/**
 * The props that will be used in the daily recurrence
 */
RecurrenceForm.propTypes = {

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
};

export default RecurrenceForm;
