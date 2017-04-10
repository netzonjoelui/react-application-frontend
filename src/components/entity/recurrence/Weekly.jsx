/**
 * Weekly recurrence pattern.
 * This will display the interval and days of week.
 */
import React from 'react';
import RecurrencePattern from '../../../models/entity/Recurrence';

// Chamel Controls
import Checkbox from 'chamel/lib/Toggle/Checkbox';
import GridContainer from 'chamel/lib/Grid/Container';
import GridColumn from 'chamel/lib/Grid/Column';
import GridRow from 'chamel/lib/Grid/Row';
import TextField from 'chamel/lib/Input/TextField';

// The weekly recurrence component.
const Weekly = (props) => {

  // Create an instance of RecurrencePattern
  const recurrencePattern = new RecurrencePattern();

  // Use the props.recurrencePatternData to populate the values of recurrencePattern
  recurrencePattern.fromData(props.recurrencePatternData);

  const daysOfWeek = recurrencePattern.getDaysOfWeek();
  const columnLabelStyle = {paddingTop: "25px"};

  let displayDays = [];
  for (let day in daysOfWeek) {

    /*
     * We are setting day.toUpperCase() because weekdays are set to as constants
     * We are trying to get the value of each weekday to set it in the checkbox
     * weekdays constants are: SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY
     */
    const weekday = recurrencePattern.weekdays[day.toUpperCase()].toString();
    const bitmask = parseInt(weekday);

    let checked = false;
    if (daysOfWeek[day] && daysOfWeek[day] == weekday) {
      checked = true;
    }

    displayDays.push(<Checkbox
      key={day}
      value={weekday}
      label={day}
      checked={checked}
      onChange={(e, isInputChecked) => {
        props.onChange("setBitMask", {bitmask, isInputChecked});
      }}/>)
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn small={1} style={columnLabelStyle}>{"Every"}</GridColumn>
        <GridColumn small={3} medium={1}>
          <TextField
            floatingLabelText='Interval'
            type='number'
            value={recurrencePattern.interval.toString()}
            onBlur={(e) => {
              props.onChange("updateProperty", {field: "interval", value: e.target.value});
            }}/>
        </GridColumn>
      </GridRow>
      <div>{"Week(s) on:"}</div>
      <div>
        {displayDays}
      </div>
    </GridContainer>
  );
}

/**
 * The props that will be used in the Weekly recurrence
 */
Weekly.propTypes = {

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
};

export default Weekly;
