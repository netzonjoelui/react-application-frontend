/**
 * Entity Recurrence
 */

import React from 'react';
import theme from './entity-form.scss';
import EntityRecurrence from '../../EntityRecurrence';

const Recurrence = (props) => {

  const recurrencePattern = props.entity.getRecurrence(true);

  return (
    <EntityRecurrence
      deviceSize={props.deviceSize}
      editMode={props.editMode}
      recurrencePatternData={recurrencePattern.toData()}
      onChange={(recurrencePatternData) => {

        recurrencePattern.fromData(recurrencePatternData);

        props.entity.setRecurrence(recurrencePattern);
        props.onChange(props.entity.getData());
      }}
    />
  )
}

/**
 * The props that will be used in the recurrence
 */
Recurrence.propTypes = {

  /**
   * Entity being edited
   */
  entity: React.PropTypes.object,

  /**
   * Callback function that is called when there's a change in the recurrence
   */
  onChange: React.PropTypes.func,

  /**
   * Flag indicating if we are in edit mode or view mode
   */
  editMode: React.PropTypes.bool,

  /**
   * The current device size
   */
  deviceSize: React.PropTypes.number
};

export default Recurrence;