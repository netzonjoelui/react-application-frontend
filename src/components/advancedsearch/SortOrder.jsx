/**
 * Sort By used for advance search.
 * Pass the orderBy object in the props and should contains the fieldName and direction data
 *
 */
import React from 'react';
import FieldsDropDown from '../entity/FieldsDropDown';
import OrderBy from '../../models/entity/OrderBy';

// Chamel Controls
import GridContainer from 'chamel/lib/Grid/Container';
import GridRow from 'chamel/lib/Grid/Row';
import GridColumn from 'chamel/lib/Grid/Column';
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import IconButton from 'chamel/lib/Button/IconButton';
import FlatButton from 'chamel/lib/Button/FlatButton';

// Chamel Icons
import CancelIcon from 'chamel/lib/icons/font/CancelIcon';

const directionMenuData = [
  {payload: 'asc', text: 'Ascending'},
  {payload: 'desc', text: 'Descending'},
];

/**
 * Function that will get the index of the selected order by
 *
 * @param value The order by value that is currently selected
 * @returns {int} The index of the selected order by
 */
const _getSelectedIndex = (value) => {

  let selectedIndex = 0;

  directionMenuData.forEach((direction, index) => {
    if (direction.payload == value) {
      selectedIndex = index;
    }
  });

  return selectedIndex;
};

/**
 * Displays the sort order used in the advanced search.
 */
const SortOrder = (props) => {
  let sortOrderDisplay = [];
  let orderByDataList = (props.orderByDataList) ? props.orderByDataList.slice() : [];

  props.orderByDataList.forEach((orderByData, idx) => {

    const orderBy = new OrderBy(orderByData);

    // Get the index of the selected order by direction
    const directionIndex = _getSelectedIndex(orderBy.getDirection());

    sortOrderDisplay.push(
      <GridRow key={idx}>
        <GridColumn small={6} medium={4}>
          <FieldsDropDown
            definitionData={props.definitionData}
            objType={props.objType}
            selectedField={orderBy.getFieldName()}
            onChange={(fieldName) => {

              // Update the filed name of the order by
              orderBy.setFieldName(fieldName);
              orderByDataList[idx] = orderBy.toData();
              props.onChange(orderByDataList);
            }}/>
        </GridColumn>
        <GridColumn small={4} medium={2}>
          <DropDownMenu
            menuItems={directionMenuData}
            selectedIndex={parseInt(directionIndex)}
            onChange={(e, key, menuItem) => {

              // Update the direction of the order by
              orderBy.setDirection(menuItem.payload);
              orderByDataList[idx] = orderBy.toData();
              props.onChange(orderByDataList);
            }}/>
        </GridColumn>
        <GridColumn small={1} medium={1}>
          <IconButton
            tooltip={"Remove Order By"}
            onClick={() => {

              // Remove the order by data in the list
              orderByDataList.splice(idx, 1);
              props.onChange(orderByDataList);
            }}>
            <CancelIcon />
          </IconButton>
        </GridColumn>
      </GridRow>
    )
  });

  return (
    <GridContainer fluid>
      {sortOrderDisplay}
      <GridRow>
        <GridColumn small={12} medium={12} style={{marginBottom: '20px'}}>
          <FlatButton
            onClick={() => {

              // Setup a new order by
              const orderBy = new OrderBy({field_name: "id"});

              orderByDataList.push(orderBy.toData());
              props.onChange(orderByDataList);
            }}
            label={"Add Sort Order"}/>
        </GridColumn>
      </GridRow >
    </GridContainer>
  );
}

/**
 * The props that will be used in the sort order view
 */
SortOrder.propTypes = {
  /**
   * The definition data that will be used to display the fields in FieldsDropdown.
   *
   * @type {object}
   */
  definitionData: React.PropTypes.object.isRequired,

  /**
   * The type of object we are adding orderBy for
   *
   * @type {string}
   */
  objType: React.PropTypes.string.isRequired,

  /**
   * Array of orderBy data to pre-populate
   *
   * @type {array}
   */
  orderByDataList: React.PropTypes.array,

  /**
   * Event triggered any time the user makes changes to the order by data list
   *
   * @type {func}
   */
  onChange: React.PropTypes.func
}

export default SortOrder;
