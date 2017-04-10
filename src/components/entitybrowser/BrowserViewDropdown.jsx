import React from 'react';
import BrowserView from '../../models/entity/BrowserView';

// Chamel Controls
import SelectButton from 'chamel/lib/Picker/SelectButton';

// Chamel Icons
import FilterListIcon from 'chamel/lib/icons/font/FilterListIcon';

/**
 * Displays the dropdown that contains the browser views
 */
export const BrowserViewDropdown = (props) => {

  if (!props.browserViewDataList) {
    return (<div />);
  }

  let viewMenuItems = [];
  let selectedBrowserViewIndex = 0;
  const browserView = new BrowserView();

  // Import the browser view data
  browserView.fromData(props.currentBrowserViewData);

  props.browserViewDataList.forEach((viewData, index) => {
    viewMenuItems.push({
      payload: viewData.id,
      text: viewData.name
    });

    // Check if we have props.currentBrowserView and if it matches a view, then we set the selected index
    if (browserView.id == viewData.id) {

      // Update the selected index to be used in <SelectButton> for browser views
      selectedBrowserViewIndex = index;
    }
  });

  return (
    <SelectButton
      menuItems={viewMenuItems}
      onChange={props.onSelectBrowserView}
      selectedIndex={parseInt(selectedBrowserViewIndex)}>
      <FilterListIcon />
    </SelectButton>
  )
}

/**
 * Properties this component accepts
 */
BrowserViewDropdown.propTypes = {
  /**
   * Callback function that is called when selecting a browserview
   */
  onSelectBrowserView: React.PropTypes.func,

  /**
   * The current Browser View Data used to display the entity browser
   */
  currentBrowserViewData: React.PropTypes.object,

  /**
   * Collection of Browser Views Data that will be displayed as select dropdown to filter the displaying of entities
   */
  browserViewDataList: React.PropTypes.array
}

export default BrowserViewDropdown;
