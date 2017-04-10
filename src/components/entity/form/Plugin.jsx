import React from 'react';
import log from '../../../log';
import plugins from '../../../models/entity/plugins';
import Entity from '../../../models/entity/Entity';

/**
 * Base level element to represent a plugin field in an entity form
 */
const Plugin = (props) => {

  let elementNode = props.elementNode;
  let pluginName = elementNode.getAttribute('name');
  let componentName = props.entity.def.objType + "." + pluginName;
  let componentGlobal = "global." + pluginName; // Try to get the plugin in the global folder

  // Check if there is a specific plugin for objType or a global plugin for all entities
  let component = netric.getObjectByName(componentName, null, plugins.List) || netric.getObjectByName(componentGlobal, null, plugins.List);

  if (!component) {
    throw "Plugin named " + componentName + " does not exist";
  }

  let reactElement;

  try {
    reactElement = React.createElement(component, {
      elementNode: props.elementNode,
      entity: props.entity,
      initEntityData: props.initEntityData,
      editMode: props.editMode,
      onChange: props.onChange,
      deviceSize: props.deviceSize
    });
  } catch (e) {
    log.error("Could not create plugin component: " + componentName + ":" + e);
  }

  return reactElement;
}

/**
 * The props that will be used in the plugin field
 */
Plugin.propTypes = {

  /**
   * Current element node level
   *
   * @type {entity/form/FormNode}
   */
  elementNode: React.PropTypes.object.isRequired,

  /**
   * Entity being edited
   *
   * @type {Entity}
   */
  entity: React.PropTypes.instanceOf(Entity),

  /**
   * Flag indicating if we are in edit mode or view mode
   *
   * @type {bool}
   */
  editMode: React.PropTypes.bool,

  /**
   * Callback function that is called when there's a change in the plugin
   */
  onChange: React.PropTypes.func,

  /**
   * Current device size is passed to all form elements
   */
  deviceSize: React.PropTypes.number
};

export default Plugin;