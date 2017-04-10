import React from 'react';
import theme from '../../../../entity/form/entity-form.scss';
import Field from '../../../../../models/entity/definition/Field';
import EntityFieldsDropDownContainer from '../../../../../containers/EntityFieldsDropDownContainer';

// Controls
import TextField from 'chamel/lib/Input/TextField';

/**
 * Manage a workflow action that asks a request approval first to the user before executing a workflow
 */
const RequestApproval = (props) => {
  const workflowActionData = props.data;
  const additionalSelectorData = [{
    payload: 'browse',
    text: 'Specific User'
  }];

  return (
    <div className={theme.entityFormField}>
      <div>
        <div className={theme.entityFormFieldInlineBlock}>
          <TextField
            floatingLabelText='Request Approval From'
            value={workflowActionData.approval_from}
            onBlur={(e) => {
                props.onChange({approval_from: e.target.value});
              }}
          />
        </div>
        <div className={theme.entityFormFieldInlineBlock}>
          <EntityFieldsDropDownContainer
            objType={props.objType}
            firstEntryLabel="Select User"
            filterFieldSubtypes={['user']}
            hideFieldTypes={[Field.types.objectMulti]}
            fieldFormat={{prepend: '<%', append: '%>'}}
            additionalMenuData={additionalSelectorData}
            onChange={(fieldValue) => {
              if (fieldValue === '<%browse%>') {
                  console.log('not yet implemented.');
                  // TODO: Display the EntityBrowserContainer with the object type user
              } else {
                  props.onChange({approval_from: fieldValue});
              }
            }}
            showReferencedFields={1}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * The props that will be used in the request approval workflow action
 */
RequestApproval.propTypes = {

  /**
   * Callback to call when a user changes any properties of the action
   */
  onChange: React.PropTypes.func.isRequired,

  /**
   * Data from the workflow action - decoded JSON object
   */
  data: React.PropTypes.object
};

export default RequestApproval;
