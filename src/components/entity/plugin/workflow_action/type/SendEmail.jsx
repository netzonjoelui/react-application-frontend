/**
 * Handle a send email type action
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
import Field from '../../../../../models/entity/definition/Field';
import EntityFieldsDropDownContainer from '../../../../../containers/EntityFieldsDropDownContainer';
import EntityBrowserContainer from '../../../../../containers/EntityBrowserContainer';
import PageModal from '../../../../PageModal.jsx';
import RecipientsInput from './send_email/RecipientsInput';

// Chamel Controls
import FlatButton from 'chamel/lib/Button/FlatButton';
import RadioButton from 'chamel/lib/Picker/RadioButton';
import RadioPicker from 'chamel/lib/Picker/RadioPicker';
import TextField from 'chamel/lib/Input/TextField';

const emailType = {
  COMPOSE: 'compose',
  TEMPLATE: 'template'
};

/**
 * Manage a workflow action that will send an email message when workflow is executed
 */
class SendEmail extends React.Component {
  /**
   * Define propTypes for this component
   */
  static propTypes = {
    /**
     * Callback to call when a user changes any properties of the action
     */
    onChange: React.PropTypes.func,

    /**
     * The object type this action is running against
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * Data from the action - decoded JSON object
     */
    data: React.PropTypes.object,

    /**
     * The fields available in the entity definition
     */
    entityDefinitionFields: React.PropTypes.array
  }

  static contextTypes = {
    store: React.PropTypes.object
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      emailType: (this.props.data.fid) ? emailType.TEMPLATE : emailType.COMPOSE,
      showEmailTemplateEntityBrowser: false,
    }
  };

  /**
   * Render action type form
   *
   * @returns {JSX}
   */
  render() {
    const workflowActionData = this.props.data;
    let displayEmailCompose = null;

    // If the emailType selected is Compose, then we will display elements needed to compose an email
    if (this.state.emailType == emailType.COMPOSE) {

      // Display the input fields that will be used to compose an email
      displayEmailCompose = (
        <div>
          <div>
            <div className={theme.entityFormFieldInlineBlock}>
              <TextField
                floatingLabelText='Subject'
                value={workflowActionData.subject}
                onBlur={(evt) => {
                  this.props.onChange({subject: evt.target.value});
                }}
              />
            </div>
            <div className={theme.entityFormFieldInlineBlock}>
              <EntityFieldsDropDownContainer
                objType={this.props.objType}
                fieldFormat={{prepend: '<%', append: '%>'}}
                onChange={this._handleSelectMergeField}
                menuEntryLabel="Insert Merge Field"
                showReferencedFields={1}
              />
            </div>
          </div>
          <div>
            <TextField
              floatingLabelText='Body'
              multiLine={true}
              value={workflowActionData.body}
              onBlur={(evt) => {
                  this.props.onChange({body: evt.target.value});
                }}
            />
          </div>
        </div>
      );
    } else {

      // If the emailTye selected is template, then we will display a button to let the user select an email template.
      var templateName = 'No template selected';
      var buttonLabel = 'Select';

      if (workflowActionData.fid) {
        templateName = workflowActionData.recipient || workflowActionData.fid;
        buttonLabel = 'Change';
      }

      // Display the label and button that will be used to select an email template
      displayEmailCompose = (
        <div>
          <div className={theme.entityFormFieldInlineBlock}>
            {templateName}
          </div>
          <div className={theme.entityFormFieldInlineBlock}>
            <FlatButton
              label={buttonLabel + ' Email Template'}
              onClick={() => {
                this.setState({showEmailTemplateEntityBrowser: true})
              }}
            />
          </div>
        </div>
      );
    }

    let recipientsDisplay = [];
    let emailRecipients = ['to', 'cc', 'bcc'];

    // We will loop thru the emailRecipients
    emailRecipients.map(function (recipient) {

      recipientsDisplay.push(
        <div key={recipient}>
          <div className={theme.entityFormFieldLabel}>
            {recipient.charAt(0).toUpperCase() + recipient.slice(1)}
          </div>
          <div>
            <RecipientsInput
              entityDefinitionFields={this.props.entityDefinitionFields}
              selectedField={workflowActionData[recipient]}
              onCheck={(emailRecipientTypValue, isChecked) => {
                this._handleEmailRecipientTypeSelect(recipient, emailRecipientTypValue, isChecked)
              }}
            />
            <TextField
              floatingLabelText='Other email addresses - separate with commas'
              ref="toEmailOther"
              defaultValue={workflowActionData[recipient + '_other']}
              onBlur={(evt) => {
                let sendEmailActionData = {}
                sendEmailActionData[recipient + '_other'] = evt.target.value;
                this.props.onChange(sendEmailActionData);
              }}
            />
          </div>
        </div>
      );
    }.bind(this));

    // This will be selected as a default value in the selector dropdown
    let additionalMenuData = [{
      payload: 'default',
      text: 'Default'
    }];

    let displayEmailTemplateEntityBrowser = null;

    if (this.state.showEmailTemplateEntityBrowser) {
      displayEmailTemplateEntityBrowser = (
        <PageModal
          deviceSize={this.props.deviceSize}
          title={"Select"}
          continueLabel={"Select"}
          onCancel={this._handleBrowseClick}
          onContinue={null}>
          <EntityBrowserContainer
            objType={"html_template"}
            mode={"inline"}
            hideToolbar={true}
            onSelectEntity={(objType, id, name) => {
              let sendEmailActionData = {
                fid: id,
                templateName: name
              };
              this.props.onChange(sendEmailActionData);
              this.setState({showEmailTemplateEntityBrowser: false});
            }}
          />
        </PageModal>
      );
    }

    return (
      <div className={theme.entityFormField}>
        <div>
          <div className={theme.entityFormFieldInlineBlock}>
            <TextField
              floatingLabelText='From'
              value={workflowActionData.from}
            />
          </div>
          <div className={theme.entityFormFieldInlineBlock}>
            <EntityFieldsDropDownContainer
              firstEntryLabel="Select User"
              objType={this.props.objType}
              filterFieldSubtypes={["user"]}
              hideFieldTypes={[Field.types.objectMulti]}
              fieldFormat={{prepend: '<%', append: '%>'}}
              additionalMenuData={additionalMenuData}
              onChange={this._handleMenuSelect}
              showReferencedFields={1}
            />
          </div>
        </div>
        {recipientsDisplay}
        <div className={theme.entityFormGroup}>
          <RadioPicker
            value={this.state.emailType}
            onChange={this._handleTypeChange}
            inline={true}>
            <RadioButton
              value={emailType.COMPOSE}
              label='Compose New Email '
            />
            <RadioButton
              value={emailType.TEMPLATE}
              label='Use Email Template'
            />
          </RadioPicker>
        </div>
        {displayEmailCompose}
        {displayEmailTemplateEntityBrowser}
      </div>
    );
  };

  /**
   * Callback used to handle the changing of compose email type
   *
   * @param {string} newSelection The new selected value
   * @private
   */
  _handleTypeChange = (newSelection) => {

    // If compose is selected, then we will remove the value of template id (fid)
    if (newSelection == emailType.COMPOSE) {
      this.props.onChange({fid: null});
    } else {
      this.props.onChange({subject: null});
      this.props.onChange({body: null});
    }

    this.setState({emailType: newSelection})
  };

  /**
   * Callback used to handle the selecting of user dropdown menu
   *
   * @param {string} fieldValue The value of the fieldname that was selected
   * @private
   */
  _handleMenuSelect = (fieldValue) => {
    if (fieldValue === '<%default%>') {
      this.props.onChange({from: this.context.store.account.user.email});
    } else {
      this.props.onChange({from: fieldValue});
    }
  };

  /**
   * Callback used to handle the selecting of field checkbox of emailRecipients
   *
   * @param {string} emailRecipientType The name of the emailRecipients types. These types are to, cc, and bcc
   * @param {string} emailRecipientTypValue The value of the emailRecipients type
   * @param {bool} isChecked The current state of the checkbox
   * @private
   */
  _handleEmailRecipientTypeSelect = (emailRecipientType, emailRecipientTypValue, isChecked) => {
    let sendEmailData = Object.assign({}, this.props.data);

    if (!sendEmailData.hasOwnProperty(emailRecipientType)) {
      sendEmailData[emailRecipientType] = new Array;
    }

    if (isChecked) {
      sendEmailData[emailRecipientType].push(emailRecipientTypValue)
    } else {

      // if the fieldValue is deselected, then we need to remove that fieldValue in the data array
      for (var idx in sendEmailData[emailRecipientType]) {
        if (sendEmailData[emailRecipientType][idx] == emailRecipientTypValue) {
          sendEmailData[emailRecipientType].splice(idx, 1);
        }
      }
    }

    this.props.onChange(sendEmailData);
  };

  /**
   * Callback used to handle the selecting of merge field
   *
   * @param {string} fieldValue The value of the fieldname that was selected
   * @private
   */
  _handleSelectMergeField = (fieldValue) => {
    var body = this.refs.emailBodyInput.getValue() + fieldValue;
    this.refs.emailBodyInput.setValue(body);
    this.props.onChange({body});
  };
}

export default SendEmail;
