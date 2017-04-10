import React from 'react';
import theme from './entity/form/entity-form.scss';
import RecurrencePattern from '../models/entity/Recurrence';
import PageModalComponent from './PageModal';
import RecurrenceFormComponent from './entity/recurrence/RecurrenceForm.jsx';

/**
 * Entity recurrence will diplay the human description of the props.recurrencePatternData
 * If props.editMode is set to true, then the human description will be linkable
 *  and if clicked, it will display the recurrence form components.
 */
class EntityRecurrence extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {

    /**
     * The recurrence pattern data we are currently working with
     *
     * @type {object}
     */
    recurrencePatternData: React.PropTypes.object.isRequired,

    /**
     * Callback function that is called when there are any changes made to the recurrence pattern
     *
     * @type {func}
     */
    onChange: React.PropTypes.func,

    /**
     * Flag indicating if we are in edit mode or view mode
     *
     * @type {bool}
     */
    editMode: React.PropTypes.bool,

    /**
     * The current device size
     *
     * @type {int}
     */
    deviceSize: React.PropTypes.number
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      showRecurrenceFormFlag: false,
      recurrencePatternData: this.props.recurrencePatternData
    };
  };

  /**
   * Render the applicatoin
   *
   * @returns {Object}
   */
  render() {

    let displayRecurrenceForm = null;

    if (this.state.showRecurrenceFormFlag) {
      displayRecurrenceForm = (
        <PageModalComponent
          deviceSize={this.props.deviceSize}
          title={"Recurrence"}
          continueLabel={"Done"}
          onCancel={this.hideRecurrence}
          onContinue={null}>
          <RecurrenceFormComponent
            recurrencePatternData={this.state.recurrencePatternData}
            onChange={this.handleRecurrenceChange}
          />
        </PageModalComponent>
      );
    }

    const recurrencePattern = new RecurrencePattern();
    recurrencePattern.fromData(this.state.recurrencePatternData);

    if (this.props.editMode) {
      return (
        <div>
          <div className={theme.entityFormField}>
            <a href='javascript: void(0)' onClick={this.showRecurrence}>{recurrencePattern.getHumanDesc()}</a>
          </div>
          {displayRecurrenceForm}
        </div>
      );
    }

    return (
      <div>
        <div className={theme.entityFormField}>
          <div className={theme.entityFormFieldLabel}>{"Repeats"}</div>
          <div className={theme.entityFormFieldValue}>{recurrencePattern.getHumanDesc()}</div>
        </div>
        {displayRecurrenceForm}
      </div>
    );
  };

  /**
   * Update the flag in the state that will show the recurrence form
   */
  showRecurrence = () => {
    this.setState({showRecurrenceFormFlag: true});
  }

  /**
   * Update the flag in the state that will hide the recurrence form
   */
  hideRecurrence = () => {
    this.setState({showRecurrenceFormFlag: false});
  }

  /**
   * Handles the changing of recurrence pattern data
   *
   * @param {string} action The type of action we will execute to update the recurrence pattern data
   * @param {object} data Contains the needed info to update the recurrence pattern.
   *                      Sample data {field: "type", value: 1}. This data will update the recurrence type to 1 (Daily Recurrence)
   */
  handleRecurrenceChange = (action, data) => {
    const recurrencePattern = new RecurrencePattern();
    recurrencePattern.fromData(this.state.recurrencePatternData);

    switch (action) {
      case "setBitMask":

        // This will update the day of week of the recurrence pattern
        recurrencePattern.setDayOfWeek(data.bitmask, data.isInputChecked);
        break;
      case "updateProperty":
      default:

        // Update the recurrence property
        Object.defineProperty(recurrencePattern, data.field, {value: data.value});

        // If we are changing the recurrence type, then we will set the default values
        if (data.field === "type") {
          recurrencePattern.setDefaultValues();
        }
        break;
    }

    // Update the recurrence state
    this.setState({recurrencePatternData: recurrencePattern.toData()});
    this.props.onChange(recurrencePattern.toData());
  }
}

export default EntityRecurrence;
