/**
 * Component that handles the rendering of container for Status Update
 */
import React from 'react';
import StatusUpdateContainer from '../../../containers/StatusUpdateContainer';

/**
 * Render the container for Status Update
 */
const StatusUpdate = (props) => {

  // If entity has no id, then just return a blank div
  if (!props.entity.id) {
    return (<div />);
  }

  return (
    <StatusUpdateContainer
      referencedObjType={props.entity.objType}
      referencedEntityId={props.entity.id}
    />
  );
}

/**
 * The props that will be used in the StatusUpdate
 */
StatusUpdate.propTypes = {
  /**
   * Entity being edited
   *
   * @type {entity/Entity}
   */
  entity: React.PropTypes.object,

  /**
   * Flag indicating if we are in edit mode or view mode
   *
   * @type {bool}
   */
  editMode: React.PropTypes.bool

}

export default StatusUpdate;
