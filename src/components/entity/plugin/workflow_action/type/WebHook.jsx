/**
 * Handle a web hook type action
 *
 * All actions have a 'data' field, which is just a JSON encoded string
 * used by the backend when executing the action.
 *
 * When the ActionDetails plugin is rendered it will decode or parse the string
 * and pass it down to the type component.
 *
 */
import React from 'react';
import theme from '../../../../entity/form/entity-form.scss';

// Chamel Controls
import TextField from 'chamel/lib/Input/TextField';

/**
 * Manage a workflow action that loads the webhook url when executed
 */
const WebHook = (props) => {

  const workflowActionData = props.data;

  return (
    <div className={theme.entityFormField}>
      <TextField
        floatingLabelText='Url'
        value={workflowActionData.url}
        onBlur={(evt) => {
          props.onChange({url: evt.target.value});
        }}
      />
    </div>
  );
}

/**
 * The props that will be used in the workflow action webhook
 */
WebHook.propTypes = {
  /**
   * Callback to call when a user makes changes to the webhook url input
   */
  onChange: React.PropTypes.func.isRequired,

  /**
   * Data from the action - decoded JSON object
   */
  data: React.PropTypes.object
};

export default WebHook;
