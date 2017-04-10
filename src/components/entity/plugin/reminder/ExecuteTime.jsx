/**
 * Plugin that will allow the Reminder Object to speficy when to execute the reminder
 */
import React from 'react';
import entityLoader from '../../../../models/entity/entityLoader';
import Field from '../../../../models/entity/definition/Field';
import DateTime from '../../../utils/DateTime';

// Chamel Controls
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import DatePicker from 'chamel/lib/Picker/DatePicker';
import TextField from 'chamel/lib/Input/TextField';

var ExecuteTime = React.createClass({

  /**
   * Expected props
   */
  propTypes: {
    entity: React.PropTypes.object,
    elementNode: React.PropTypes.object,
    editMode: React.PropTypes.bool
  },

  getInitialState: function () {
    // Get the entity data to be set as default values in the state
    var fieldName = this.props.entity.getValue("field_name");
    var interval = this.props.entity.getValue("interval");
    var intervalUnit = this.props.entity.getValue("interval_unit");
    var reminderTimestamp = this.props.entity.getValue("ts_execute");
    var reminderTsParts = [];

    if (reminderTimestamp) {
        reminderTsParts = reminderTimestamp.split(" ");
    }

    return ({
        reminderDate: reminderTsParts[0] || DateTime.getDateToday(),
        reminderTime: reminderTsParts[1] || null,
        fieldName: fieldName || 'specific_time',
        interval: (interval == null) ? 30 : interval,
        intervalUnit: intervalUnit || 'minutes'
    });
  },

  componentDidMount: function () {
    this._setInputValues();
  },

  componentDidUpdate: function () {
    this._setInputValues();
  },

  render: function () {
    var reminderTypeTitle = null;
    var reminderTypeIndex = 0;
    var intervalUnitIndex = 0;

    // Set the Specific Time as a default value in the dropdown
    var reminderTypeMenuData = [{
        id: '',
        name: 'specific_time',
        text: '@ a Specific Time'
    }];

    /*
     * We need to get the obj_reference value and get its objType so we can display the data/timestamp fields in the dropdown
     * The specific dropdown will determine how this reminder will be triggered
     */
    var objRefValue = this.props.entity.getValue('obj_reference');

    // Decode the objRefValue so we can get its objType
    var objRef = this.props.entity.decodeObjRef(objRefValue);

    // If we have an objType in our objRefValue, then we will get its entity definition so we can get the field definitions
    if (objRef.objType) {

        // Get the entity of the objtype reference
        var objRefEntity = entityLoader.factory(objRef.objType);

        // Get all date fields
        var dateFields = objRefEntity.def.getFilteredFields('type', Field.types.date);

        // Get all timestamp fields
        var timestampFields = objRefEntity.def.getFilteredFields('type', Field.types.timestamp);

        //  Merge both date and timestamp fields to use in a menu dropdown
        var fields = dateFields.concat(timestampFields);

        // Loop through combined fields and pass to dropdown menu data
        for (var idx in fields) {
            var field = fields[idx];

            reminderTypeMenuData.push({
                id: field.id,
                name: field.name,
                text: 'Before ' + field.title
            })

            /*
             * If the state.fieldName matches the field.name, then we will set the reminderTypeIndex
             * This will be used as the default selected index in our dropdown for reminder type
             */
            if (this.state.fieldName == field.name) {

                // We will increment the idx +1 since, we have a default value for reminder type which is the specific_time
                reminderTypeIndex = parseInt(idx) + 1;
                reminderTypeTitle = reminderTypeMenuData[reminderTypeIndex].text;
            }
        }
    }

    var reminderInputDisplay = null;
    var reminderDetailsDisplay = null;

    var displayTypeDropDown = (
        <div className='col-small-3'>
            <DropDownMenu
                menuItems={reminderTypeMenuData}
                selectedIndex={reminderTypeIndex}
                onChange={this._handleTypeMenuSelect}/>
        </div>
    );

    // If the selected reminderType is specific time
    if (this.state.fieldName == 'specific_time') {
        reminderInputDisplay = (
            <div className='row'>
                {displayTypeDropDown}
                <div className='col-small-2'>
                    <DatePicker
                        floatingLabelText='Date'
                        value={this.state.reminderDate}
                        type="date"
                        ref="reminderDate"
                        onChange={this._handleDateChange}/>
                </div>
                <div className='col-small-1'>
                    <TextField
                        floatingLabelText='Time'
                        ref="reminderTime"
                        onChange={this._handleInputChange.bind(this, 'reminderTime')}/>
                </div>
            </div>
        );

        reminderDetailsDisplay = (
            <div className="entity-form-field-label">{this.state.reminderDate} {this.state.reminderTime}</div>
        );
    } else {
        var intervalMenuData = []
        var intervalUnits = ['minute', 'hour', 'day', 'week', 'month', 'year'];

        for (var idx in intervalUnits) {
            var intervalUnit = intervalUnits[idx];

            intervalMenuData.push({
                unit: intervalUnit + 's',
                text: intervalUnit + '(s)',
            })

            /*
             * If state.intervalUnit matches the intervalUnit, then we will set the unitIndex
             * This will be used as the default selected index in our dropdown for interval unit
             */
            if (this.state.intervalUnit == intervalMenuData[idx].unit) {
                intervalUnitIndex = parseInt(idx);
            }
        }

        reminderInputDisplay = (
            <div className='row'>
                <div className="col-small-1">
                    <div className="entity-form-field-label">When:</div>
                </div>
                {displayTypeDropDown}
                <div className='col-small-1'>
                    <TextField
                        floatingLabelText='Interval'
                        ref='interval'
                        onChange={this._handleInputChange.bind(this, 'interval')}/>
                </div>
                <div className='col-small-1'>
                    <DropDownMenu
                        menuItems={intervalMenuData}
                        selectedIndex={intervalUnitIndex}
                        onChange={this._handleIntervalMenuSelect}/>
                </div>
            </div>
        );

        reminderDetailsDisplay = (
            <div
                className="entity-form-field-value">{this.state.interval} {this.state.intervalUnit} {reminderTypeTitle}</div>
        );
    }

    if (this.props.editMode) {
        return (
            <div className="entity-form-field ">
                {reminderInputDisplay}
            </div>
        );
    } else {
        return (
            <div className="entity-form-field ">
                <div className="entity-form-field-label">When:</div>
                {reminderDetailsDisplay}
            </div>
        );
    }
  },

  /**
   * Callback used to handle the selecting of reminder type dropdown field
   *
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @param {int} key The index of the menu clicked
   * @param {array} menuItem The object value of the menu clicked
   * @private
   */
  _handleTypeMenuSelect: function (evt, key, menuItem) {
    this.setState({fieldName: menuItem.name});

    this._setExecuteTime({fieldName: menuItem.name});
  },

  /**
   * Callback used to handle the selecting of interval unit
   *
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @param {int} key The index of the menu clicked
   * @param {array} menuItem The object value of the menu clicked
   * @private
   */
  _handleIntervalMenuSelect: function (evt, key, menuItem) {
    this.setState({intervalUnit: menuItem.unit});

    this._setExecuteTime({intervalUnit: menuItem.unit});
  },

  /**
   * Handles the changing of reminder dates
   *
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @param {date} date The date that was set by the user
   * @private
   */
  _handleDateChange: function (evt, date) {
    var reminderDate = DateTime.format(date);

    this.setState({
        reminderDate: reminderDate
    });

    this._setExecuteTime({reminderDate: reminderDate});
  },

  /**
   * Handle the changing of input text
   *
   * @param {string} inputType The input type that was change
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @private
   */
  _handleInputChange: function (inputType, evt) {

    var data = {}
    data[inputType] = evt.target.value;

    this.setState(data);

    this._setExecuteTime(data);
  },

  /**
   * Set intial values for the input text
   * @private
   */
  _setInputValues: function () {
    if (this.refs.reminderTime && this.state.fieldName == 'specific_time') {
        this.refs.reminderTime.setValue(this.state.reminderTime);
    } else if (this.refs.interval) {
        this.refs.interval.setValue(this.state.interval);
    }
  },

  /**
   * Set the entity values needed for reminder depending on the reminder type selected
   *
   * @param {object} opt_data Additional data that are needed to se the entity values
   * opt_data {
   *  intervalUnit: minutes
   * }
   * -- or --
   * opt_data {
   *  fieldName: ts_entered
   * }
   *
   * @private
   */
  _setExecuteTime: function (opt_data) {
    var data = opt_data || {}

    // If we have a data that contains fieldName, then we will use it, else we will get it from the state.fieldName
    var fieldName = data.fieldName || this.state.fieldName;

    // If fieldName is Specific Time reminder type is selected which sets the ts_execute with date and time
    if (fieldName == 'specific_time') {
      // If the user selected specific_time, then we need to set the field_name field to null
      this.props.entity.setValue('field_name', null);

      // Specifc Time reminder type uses the date and time and saves it in the ts_execute field
      var reminderDate = data.reminderDate || this.state.reminderDate;
      var reminderTime = data.reminderTime || this.state.reminderTime;

      // If we have valid date and time, we will set the ts_execute
      if (reminderDate && reminderTime) {
          this.props.entity.setValue('ts_execute', reminderDate + ' ' + reminderTime);
      }

      // Since we are using the ts_execute field, we will empty the interval and interval_unit
      this.props.entity.setValue('interval', null);
      this.props.entity.setValue('interval_unit', null);
    } else {
      this.props.entity.setValue('field_name', fieldName);

      // If we are not using Specific Time reminder type, then we will empty the ts_execute
      this.props.entity.setValue('ts_execute', null);

      // And set interval and interval_unit with user input data
      this.props.entity.setValue('interval', data.interval || this.state.interval);
      this.props.entity.setValue('interval_unit', data.intervalUnit || this.state.intervalUnit);
    }
  }

});

// Check for commonjs
if (module) {
    module.exports = ExecuteTime;
}

export default ExecuteTime;
