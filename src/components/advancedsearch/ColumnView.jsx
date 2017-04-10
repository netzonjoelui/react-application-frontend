/**
 * Column View used for advanced search.
 * Pass the column object in the props and should contain the fieldName index
 *
 */
import React from 'react';
import FieldsDropDown from '../entity/FieldsDropDown';

// Chamel Controls
import GridContainer from 'chamel/lib/Grid/Container';
import GridColumn from 'chamel/lib/Grid/Column';
import GridRow from 'chamel/lib/Grid/Row';
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import FlatButton from 'chamel/lib/Button/FlatButton';
import IconButton from 'chamel/lib/Button/IconButton';

// Chamel Icons
import CancelIcon from 'chamel/lib/icons/font/CancelIcon';

/**
 * Displays the columns to view used in advanced search
 */
const ColumnView = (props) => {
  let columnToViewDisplay = [];

  if (props.fieldNamesList) {
    let fieldNamesList = props.fieldNamesList.slice();

    props.fieldNamesList.forEach((fieldName, idx) => {
      columnToViewDisplay.push(
        <GridRow key={idx}>
          <GridColumn small={5} medium={2}>
            <FieldsDropDown
              definitionData={props.definitionData}
              objType={props.objType}
              selectedField={fieldName}
              onChange={(fieldName) => {

              // This will overwrite the existing fieldname selected as a column view
              fieldNamesList[idx] = fieldName;
              props.onChange(fieldNamesList);
            }}/>
          </GridColumn>
          <GridColumn small={2} medium={1}>
            <IconButton
              onClick={() => {

              // Remove the field name from the list
              fieldNamesList.splice(idx, 1);
              props.onChange(fieldNamesList);
            }}
              tooltip={"Remove Column"}>
              <CancelIcon />
            </IconButton>
          </GridColumn>
        </GridRow>
      )
    });
  }

  return (
    <GridContainer fluid>
      {columnToViewDisplay}
      <GridRow>
        <GridColumn small={12} medium={12} style={{marginBottom: '20px'}}>
          <FlatButton
            onClick={() => {

              // Set the default column field to id
              fieldNamesList.push("id");
              props.onChange(fieldNamesList);
            }}
            label={"Add Column"}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  );
}

/**
 * The props that will be used in the column view
 */
ColumnView.propTypes = {
  /**
   * The definition data that will be used to display the fields in FieldsDropdown.
   *
   * @type {object}
   */
  definitionData: React.PropTypes.object.isRequired,

  /**
   * The type of object we are adding column view for
   *
   * @type {string}
   */
  objType: React.PropTypes.string.isRequired,

  /**
   * Array of field names that are selected as view columns for the advanced search
   *
   * @type {array}
   */
  fieldNamesList: React.PropTypes.array,

  /**
   * Event triggered any time the user makes changes to the field names list
   *
   * @type {func}
   */
  onChange: React.PropTypes.func
}

export default ColumnView;
