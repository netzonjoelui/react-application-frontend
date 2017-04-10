import React from 'react';
import Checkbox from 'chamel/lib/Toggle/Checkbox';

/**
 * Displays the checbox for each user/email field with type=object
 */
const RecipientsInput = (props) => {
  let fields = props.entityDefinitionFields;
  let checkboxDisplay = [];

  // Loop through fields and prepare the checkbox inputs
  for (var idx in fields) {
    let field = fields[idx];

    /*
     * We will only consider a field as an email recipient if the field has an email subtype
     *  or user subtype with field.type equals to object
     */
    if (field.subtype == "email" || (field.type == "object" && field.subtype == "user")) {
      let isChecked = false;
      let value = '<%' + field.name + '%>';

      // Make sure the selectedField is an array, and it contains the currentFieldData then we set the checkbox to checked
      if (props.selectedField instanceof Array && props.selectedField.indexOf(value) > -1) {
        isChecked = true;
      }

      checkboxDisplay.push(
        <Checkbox
          key={idx}
          value={value}
          label={field.title}
          onChange={(e, isInputChecked) => {
            props.onCheck(value, isInputChecked);
          }}
          checked={isChecked}/>
      );

      /*
       * Every user can have a manager listed in a field called 'manager_id' so we add it here
       * as an option to email the selected user's manager.
       */
      let valueManager = '<%' + field.name + ".manager_id" + '%>';
      let isCheckedManager = false;

      // Make sure the selectedField is an array, and it contains the currentFieldData then we set the checkbox to checked
      if (props.selectedField instanceof Array && props.selectedField.indexOf(valueManager) > -1) {
        isCheckedManager = true;
      }

      checkboxDisplay.push(
        <Checkbox
          key={'manager' + idx}
          value={valueManager}
          label={field.title + '.Manager'}
          onChange={(e, isInputChecked) => {
            props.onCheck(valueManager, isInputChecked);
          }}
          checked={isCheckedManager}/>
      );
    }
  }

  return (
    <div>
      {checkboxDisplay}
    </div>
  );
}

/**
 * The props that will be used in the Recipients Input for send_email workflow action
 */
RecipientsInput.propTypes = {
  /**
   * The fields available in the entity definition
   *
   * @var {string}
   */
  entityDefinitionFields: React.PropTypes.array.isRequired,

  /**
   * The field that was selected
   *
   * @var {string}
   */
  selectedField: React.PropTypes.any,

  /**
   * Callback called when the user selects a field (Applicable only with checkbox)
   *
   * @var {function}
   */
  onCheck: React.PropTypes.func
};

export default RecipientsInput;
