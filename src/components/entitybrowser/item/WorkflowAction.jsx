/**
 * List Item used where object type is 'workflow_action'
 */
import React from 'react';
import theme from './_workflow-action.scss';
import classnames from 'classnames';
import WorkflowAction from '../../WorkflowAction';
import EntityModel from '../../../models/entity/Entity';

// Chamel Controls
import IconButton from 'chamel/lib/Button/IconButton';
import DropDownIcon from 'chamel/lib/DropDownIcon';
import RaisedButton from 'chamel/lib/Button/RaisedButton';

// Chamel Icons
import SettingsIcon from 'chamel/lib/icons/font/SettingsIcon';
import MoreVertIcon from 'chamel/lib/icons/font/MoreVertIcon';

// Setup Drop-down menu items
const menuItems = [
  {payload: 'create', text: 'Add Child Action'},
  {payload: 'delete', text: 'Delete'}
];

/**
 * List item for an WorkflowAction
 */
const WorkflowActionItem = (props) => {
  let entity = props.entity;
  let name = entity.getValue("name");
  let notes = entity.getValue("notes");
  let type = entity.getValue("type_name");

  // Convert type from lower_case to "Upper Case"
  type = type.replace("_", " ");
  type = type.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
    function ($1) {
      return $1.toUpperCase();
    });

  // Set the classes for div container
  let divClasses = classnames(theme.entityBrowserItem, theme.entityBrowserItemCmp);

  return (
    <div>
      <div className={divClasses}>
        <div className={theme.entityBrowserItemCmpIcon}>
          <SettingsIcon />
        </div>
        <div className={theme.entityBrowserItemCmpBody}
             onClick={() => {props.onEntityListClick('workflow_action', props.entity.id)}}>
          <div className={theme.entityBrowserItemCmpHeader}>
            {name}
          </div>
          <div className={theme.entityBrowserItemCmpSubheader}>
            {type}
          </div>
          <div className={theme.entityBrowserItemCmpCaption}>
            {notes}
          </div>
        </div>
        <div className={theme.entityBrowserItemCmpRight}>
          <DropDownIcon
            menuItems={menuItems}
            onChange={(evt, index, data) => {
              if (data.payload === 'create') {
                props.onCreateNewEntity(props.entity.id);
              } else if (data.payload === 'delete') {
                props.onRemoveEntity(props.entity.id);
              }
              }}>
            <MoreVertIcon />
          </DropDownIcon>
        </div>
      </div>
      <WorkflowAction
        workflowId={props.entity.getValue("workflow_id")}
        parentWorkflowActionId={props.entity.id}
      />
    </div>
  );
}

/**
 * The props that will be used in the workflow action item
 */
WorkflowActionItem.propTypes = {
  /**
   * The workflow entity that is being worked on
   *
   * @type {Entity}
   */
  entity: React.PropTypes.instanceOf(EntityModel),

  /**
   * Function that will handle the clicking of object reference link
   *
   * @var {function}
   */
  onEntityListClick: React.PropTypes.func,

  /**
   * Callback used when an individual entity is removed
   *
   * @type {function}
   */
  onRemoveEntity: React.PropTypes.func,

  /**
   * Callback called when a new entity is created
   *
   * @type {function}
   */
  onCreateNewEntity: React.PropTypes.func
}

export default WorkflowActionItem;
