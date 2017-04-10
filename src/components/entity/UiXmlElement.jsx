/**
 * Render an entity form from UIML
 *

 */
import React from 'react';
import netric from '../../base.js';
import log from '../../log';
import EntityModel from '../../models/entity/Entity';

// Controls
import Tab from 'chamel/lib/Tabs/Tab';

// Form elements used in the UIML
const formElements = {
  Column: require("./form/Column.jsx"),
  Field: require("./form/Field.jsx"),
  Fieldset: require("./form/Fieldset.jsx"),
  Form: require("./form/Form.jsx"),
  Objectsref: require("./form/Objectsref.jsx"),
  Row: require("./form/Row.jsx"),
  Tab: require("./form/Tab.jsx"),
  Tabs: require("./form/Tabs.jsx"),
  Helptour: require("./form/Helptour.jsx"),
  AllAdditional: require("./form/AllAdditional.jsx"),
  Recurrence: require("./form/Recurrence.jsx"),
  Attachments: require("./form/Attachments.jsx"),
  Comments: require("./form/Comments.jsx"),
  Plugin: require("./form/Plugin.jsx"),
  Header: require("./form/Header.jsx"),
  StatusUpdate: require("./form/StatusUpdate.jsx"),
  Text: require("./form/Text.jsx"),
  Workflow: require("./form/Workflow.jsx")
};

/**
 * Convert UIML into a UI Form
 */
const UiXmlElement = (props) => {
  // We will store all the child element of props.elementNode to this variable
  let childElements = [];

  // Get the child node of the props.elementNode
  let elementChildNodes = props.elementNode.getChildNodes();

  // Process through the child nodes of the elementNode
  elementChildNodes.map(function (childNode, idx) {
    /*
     * If we are in a 'tabs' element, then children should be a tab and
     * not another UiXmlElement because Chamel tabs only support a chamel.Tab
     * as children of a chamel.Tabs container.
     */
    if (props.elementNode.getName() === "tabs") {
      let label = childNode.getAttribute('name');

      childElements.push(
        <Tab key={idx} label={label}>
          <UiXmlElement
            key={idx}
            elementNode={childNode}
            entity={props.entity}
            deviceSize={props.deviceSize}
            editMode={props.editMode}
            onChange={props.onChange}
          />
        </Tab>
      );
    } else {
      childElements.push(
        <UiXmlElement
          key={idx}
          elementNode={childNode}
          entity={props.entity}
          editMode={props.editMode}
          onChange={props.onChange}
          deviceSize={props.deviceSize}
        />
      );
    }
  }.bind(this));

  /*
   * Try to render the dynamic component and pass childElements,
   * but if the component is not defined for the given element
   * then throw an exception because this should never happen.
   */
  let component = netric.getObjectByName(props.elementNode.generateElementClassName(), null, formElements);
  let reactElement;
  if (component != null) {
    try {
      reactElement = React.createElement(component, props, childElements);
    } catch (e) {
      log.error("Could not create component: " + componentName + ":" + e);
    }
  } else {

    // Let client know we have a problem with the UIML
    throw 'Unsupported element type in UIML: ' + props.elementNode.getName();
  }

  return reactElement;
}

/**
 * The props that will be used in the UiXmlElement
 */
UiXmlElement.propTypes = {
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
  entity: React.PropTypes.instanceOf(EntityModel),

  /**
   * Flag indicating if we are in edit mode or view mode
   *
   * @type {bool}
   */
  editMode: React.PropTypes.bool,

  /**
   * Callback when we edit a value
   */
  onChange: React.PropTypes.func,

  /**
   * Current device size is passed to all form elements
   */
  deviceSize: React.PropTypes.number
}

export default UiXmlElement;
