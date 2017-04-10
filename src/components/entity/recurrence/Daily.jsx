/**
 * Daily recurrence pattern.
 * This will display the input text for the interval value.
 */
import React from 'react';
import RecurrencePattern from '../../../models/entity/Recurrence';

// Chamel Controls
import GridContainer from 'chamel/lib/Grid/Container';
import GridColumn from 'chamel/lib/Grid/Column';
import GridRow from 'chamel/lib/Grid/Row';
import TextField from 'chamel/lib/Input/TextField';

// The daily recurrence component.
const Daily = (props) => {
  const columnLabelStyle = {paddingTop: "25px"};

  // Create an instance of RecurrencePattern
  const recurrencePattern = new RecurrencePattern();

  // Use the props.recurrencePatternData to populate the values of recurrencePattern
  recurrencePattern.fromData(props.recurrencePatternData);

  return (
    <GridContainer>
      <GridRow>
        <GridColumn small={1} style={columnLabelStyle}>{"Every"}</GridColumn>
        <GridColumn small={4} medium={2}>
          <TextField
            floatingLabelText='Interval'
            type='number'
            value={recurrencePattern.interval.toString()}
            onBlur={(e) => {
              props.onChange("updateProperty", {field: "interval", value: e.target.value});
            }}/>
        </GridColumn>
        <GridColumn small={1} style={columnLabelStyle}>{"days"}</GridColumn>
      </GridRow>
    </GridContainer>
  );
}

/**
 * The props that will be used in the daily recurrence
 */
Daily.propTypes = {

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

export default Daily;
