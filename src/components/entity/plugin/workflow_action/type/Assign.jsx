import React from 'react';
import theme from '../../../../entity/form/entity-form.scss';
import GroupingSelect from '../../../../../containers/EntityGroupingSelectContainer';
import Field from '../../../../../models/entity/definition/Field.js';
import EntityFieldsDropDownContainer from '../../../../../containers/EntityFieldsDropDownContainer';
import TextFieldAutoComplete from '../../../../mixins/TextFieldAutoComplete';

// Chamel Controls
import TextField from 'chamel/lib/Input/TextField';
import RadioButton from 'chamel/lib/Picker/RadioButton';
import RadioPicker from 'chamel/lib/Picker/RadioPicker';

/**
 * Manage a workflow action that will assign an entity to a user
 */
class Assign extends React.Component {

  /**
   * Define propTypes for this component
   */
  static propTypes = {

    /**
     * Callback to call when a user changes any properties of the action
     */
    onChange: React.PropTypes.func.isRequired,

    /**
     * The object type this action is running against
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * Data from the action - decoded JSON object
     */
    data: React.PropTypes.object
  }

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      type: 'team'
    }
  };

  /**
   * Render the advanced search container
   *
   * @returns {Object}
   */
  render() {
    const workflowActionData = this.props.data;

    let displayAssignTo = null,
      displayUserField = null,
      displayAssignField = null;

    switch (this.state.type) {
      case 'team':
        displayAssignTo = (
          <GroupingSelect
            objType='user'
            key='team'
            fieldName='team_id'
            allowNoSelection={false}
            label={'none'}
            selectedValue={workflowActionData.team_id}
            onChange={this._handleGroupingSelect.bind(this, 'team_id')}
          />
        );
        break;
      case 'group':
        displayAssignTo = (
          <GroupingSelect
            objType='user'
            key='group'
            fieldName='groups'
            allowNoSelection={false}
            label={'none'}
            selectedValue={workflowActionData.group_id}
            onChange={this._handleGroupingSelect.bind(this, 'group_id')}
          />
        );
        break;
      case 'users':
        var autoCompleteAttributes = {
          autoComplete: true,
          autoCompleteDelimiter: ',',
          autoCompleteTrigger: '@',
          autoCompleteTransform: this._handleAutoCompleteTransform,
          autoCompleteGetData: this.getAutoCompleteData
        }

        displayAssignTo = (
          <TextField
            {...autoCompleteAttributes}
            floatingLabelText="Enter user IDs separated by a comma ','. Press '@' to display the list of users as you write their name."
            ref="usersAssignTo"
            defaultValue={workflowActionData.users}
            onBlur={this._handleTextInputChange}
          />
        );
        break;
    }

    displayUserField = (
      <EntityFieldsDropDownContainer
        objType={this.props.objType}
        firstEntryLabel="Select Field"
        filterFieldSubtypes={['user']}
        hideFieldTypes={[Field.types.objectMulti]}
        selectedField={workflowActionData.field}
        onChange={this._handleMenuSelect}
      />
    );

    displayAssignField = (
      <RadioPicker
        inline={true}
        value={this.state.type}
        onChange={this._handleTypeChange}>
        <RadioButton
          value='team'
          label='Team'
        />
        <RadioButton
          value='group'
          label='Group'
        />
        <RadioButton
          value='users'
          label='Users'
        />
      </RadioPicker>
    );

    return (
      <div className={theme.entityFormField}>
        <div>
          <div className={theme.entityFormFieldLabel}>
            User Field
          </div>
          <div className={theme.entityFormFieldValue}>
            {displayUserField}
          </div>
        </div>
        <div>
          <div className={theme.entityFormFieldLabel}>
            Assign Field
          </div>
          <div className={theme.entityFormFieldValue}>
            {displayAssignField}
          </div>
        </div>
        <div>
          <div className={theme.entityFormFieldLabel}>
            Assign To
          </div>
          <div className={theme.entityFormFieldValue}>
            {displayAssignTo}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Callback used to handle the selecting of fieldname in the dropdown menu
   *
   * @param {string} fieldValue The value of the fieldname that was selected
   * @private
   */
  _handleMenuSelect = (fieldValue) => {
    this.props.onChange({ field: fieldValue });
  };

  /**
   * Callback used to handle the changing of assign type
   *
   * @param {string} newSelection The new selected value
   * @private
   */
  _handleTypeChange = (newSelection) => {
    this.props.onChange({ type: newSelection });
  };

  /**
   * Callback used to handle commands when user selects a value in the dropdown groupings input
   *
   * @param {string} property The name of the property that was changed
   * @param {string} payload The value of the selected menu
   * @param {string} text The text of the selected menu
   * @private
   */
  _handleGroupingSelect = (property, payload, text) => {

    let assignEntityData = {};

    assignEntityData[property] = payload;
    this.props.onChange(assignEntityData);
  };

  /**
   * AutoComplete function that will transform the selected data to something else
   *
   * @param {object} data The autocomplete selected data
   * @returns {string}
   * @public
   */
  _handleAutoCompleteTransform = (data) => {
    return data.payload;
  };
}

export default Assign;
