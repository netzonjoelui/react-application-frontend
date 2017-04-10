import React from 'react';
import EntityContainer from '../../containers/EntityContainer';

// Chamel Controls
import Snackbar from 'chamel/lib/Snackbar/Snackbar';

/**
 * Handle the displaying of time log component
 */
const TimeLog = (props) => {
  return (
    <EntityContainer
      usePageModalFlag={true}
      forceEditModeFlag={true}
      id={null}
      objType={"time"}
      onClose={props.onCompleted}
      initEntityData={{
          task_id: props.entityIds[0],
          task_id_fval: props.entityNames[0]
        }}
    />
  );
}

/**
 * The props that will be used in the time log
 */
TimeLog.propTypes = {

  /**
   * Array of entity IDs to act on
   */
  entityIds: React.PropTypes.array.isRequired,

  /**
   * Array of entity names based on the entity IDs to act on
   */
  entityNames: React.PropTypes.array,

  /**
   * Callback function that is called when the creating of timelog is completed
   */
  onCompleted: React.PropTypes.func.isRequired,

};

export default TimeLog;
