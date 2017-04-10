/**
 * Handle a wait condition type action
 *
 * All actions have a 'data' field, which is just a JSON encoded string
 * used by the backend when executing the action.
 *
 * When the ActionDetails plugin is rendered it will decode or parse the string
 * and pass it down to the type component.
 *
 */
import React from 'react';
import ReactDOM from  'react-dom';
import theme from '../../../../entity/form/entity-form.scss';

// Controls
import TextField from 'chamel/lib/Input/TextField';
import DropDownMenu from 'chamel/lib/Picker/SelectField';

/**
 * Units of time for relative times
 *
 * @constant
 */
const timeUnits = {
  MINUTE: 1,
  HOUR: 2,
  DAY: 3,
  WEEK: 4,
  MONTH: 5,
  YEAR: 6
}

/**
 * Manage a workflow action that sets an interval before executing a workflow
 */
const WaitCondition = (props) => {
  const workflowActionData = props.data;
  let displayWaitCondition = null;
  let unitsMenuData = [];

  // Variable where we store the human description for the workflowActionData.when_unit
  let waitHumanDesc = null;

  // Loop thru timeUnits to create the unitsMenuData to be used in the dropdown
  for (let unit in timeUnits) {

    // We need to capitalize the time unit label
    let desc = unit[0] + unit.slice(1).toLowerCase() + '(s)';
    let value = parseInt(timeUnits[unit]);

    unitsMenuData.push({
      payload: value,
      text: desc
    });

    if (workflowActionData.when_unit == value) {
      waitHumanDesc = desc;
    }
  }

  let selectedFieldIndex = 0;
  for (let idx in unitsMenuData) {
    if (unitsMenuData[idx].payload == workflowActionData.when_unit) {
      selectedFieldIndex = idx;
      break;
    }
  }

  // Setup the wait condition inputs
  displayWaitCondition = (
    <div>
      <div className={theme.entityFormFieldInlineBlock}>
        <TextField
          floatingLabelText='Interval'
          type="number"
          value={workflowActionData.when_interval}
          onBlur={(evt) => {
            props.onChange({when_interval: evt.target.value});
          }}
        />
      </div>
      <div className={theme.entityFormFieldInlineBlock}>
        <DropDownMenu
          menuItems={unitsMenuData}
          selectedIndex={parseInt(selectedFieldIndex)}
          onChange={(e, key, data) => {
            props.onChange({when_unit: data.payload});
          }}
        />
      </div>
    </div>
  );

  return (
    <div className={theme.entityFormField}>
      <div className={theme.entityFormFieldLabel}>
        Wait Condition
      </div>
      {displayWaitCondition}
    </div>
  );
}

/**
 * The props that will be used in the workflow action wait condition
 */
WaitCondition.propTypes = {
  /**
   * Callback to call when a user makes changes to the interval inputs
   */
  onChange: React.PropTypes.func.isRequired,

  /**
   * Data from the action - decoded JSON object
   */
  data: React.PropTypes.object
};

export default WaitCondition;
