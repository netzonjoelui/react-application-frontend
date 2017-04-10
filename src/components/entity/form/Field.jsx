import theme from './entity-form.scss';
import React from 'react';

// Form elements used in the UIML
var TextField = require("./field/TextField.jsx");
var BoolField = require("./field/BoolField.jsx");
var GroupingField = require("./field/GroupingField.jsx");
var ObjectField = require("./field/ObjectField.jsx");
var ObjectMultiField = require("./field/ObjectMultiField.jsx");
var StatusUpdate = require("./StatusUpdate.jsx");
var NumberField = require("./field/NumberField.jsx");
var DateField = require("./field/DateField.jsx");
var Comments = require("./Comments.jsx");
var Activity = require("./Activity.jsx");
var Image = require("./Image.jsx");

/**
 * Base level element to represent an entity field in an entity form
 */
const Field = (props) => {
  var elementNode = props.elementNode;
  var fieldName = elementNode.getAttribute('name');
  var classes = theme.entityFormField;
  if (elementNode.getAttribute('class')) {
    classes += " " + theme["entityForm" + elementNode.getAttribute('class')];
  } else if (!props.editMode) {
    classes += " " + theme.entityFormbody;
  }

  var fieldContent = null;
  var field = props.entity.def.getField(fieldName);

  // If we have an invalid field, then let's throw an error.
  if (!field) {
    throw 'Trying to render an invalid field. Check the field name: ' + fieldName;
  }

  switch (field.type) {
    case field.types.bool:
      fieldContent = (<BoolField {...props} />);
      break;
    case field.types.fkey:
    case field.types.fkeyMulti:
      fieldContent = (<GroupingField {...props} />);
      break;
    case field.types.text:
      fieldContent = (<TextField {...props} />);
      break;
    case field.types.timestamp:
    case field.types.date:
      fieldContent = (<DateField {...props} />);
      break;
    case field.types.integer:
    case field.types.number:
      fieldContent = (<NumberField {...props} />);
      break;
    case field.types.object:

      // If the file object is used as profile image
      if (field.subtype == "file" && elementNode.getAttribute('profile_image') == "t") {
        fieldContent = (<Image {...props} label="Upload New Image"/>);
      } else {
        fieldContent = (<ObjectField {...props} />);
      }
      break;
    case field.types.objectMulti:

      // We do not need to display the objectMulti if we do not have an entity id yet
      if (props.entity.id) {

        // Print object browser based on subtype
        switch (field.subtype) {
          case "comment":
            fieldContent = (<Comments {...props} />);
            break;
          case "activity":
            fieldContent = (<Activity {...props} />);
            break;
          case "status_update":
            fieldContent = (<StatusUpdate {...props} />);
            break;
          default:
            fieldContent = (<ObjectMultiField {...props} />)
        }
      } else if (field.subtype != 'comment') {

        // Display information for comment subtype if the entity is not yet saved.
        fieldContent = (<div>Please save changes to view more details.</div>);
      }

      break;
    default:
      var fieldValue = props.entity.getValue(fieldName);
      fieldContent = <div>Field ToDo: {field.type} - {fieldName}:{fieldValue}</div>;
      break;
  }

  return (
    <div>
      <div className={classes}>
        {fieldContent}
      </div>
    </div>
  );
};

/**
 * Expected props
 */
Field.propTypes = {
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
  entity: React.PropTypes.object,

  /**
   * Flag indicating if we are in edit mode or view mode
   *
   * @type {bool}
   */
  editMode: React.PropTypes.bool,

  /**
   * Handle when a value changes
   */
  onChange: React.PropTypes.func,

  /**
   * Optional children passed to the field
   */
  children: React.PropTypes.node
};

export default Field;