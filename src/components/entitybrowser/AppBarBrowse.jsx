/**
 * AppBar used for browse mode
 */
import React from 'react';
import KeyCodes from '../utils/KeyCode';
import BrowserViewDropdown from './BrowserViewDropdown';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import IconButton from 'chamel/lib/Button/IconButton';
import TextField from 'chamel/lib/Input/TextField';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import FilterListIcon from 'chamel/lib/icons/font/FilterListIcon';
import MenuIcon from 'chamel/lib/icons/font/MenuIcon';
import MoreVertIcon from 'chamel/lib/icons/font/MoreVertIcon';
import SearchIcon from 'chamel/lib/icons/font/SearchIcon';

class AppBarBrowse extends React.Component {

  static propTypes = {

    /**
     * The current Browser View Data used to display the entity browser
     */
    currentBrowserViewData: React.PropTypes.object,

    /**
     * Collection of Browser Views Data that will be displayed as select dropdown to filter the displaying of entities
     */
    browserViewDataList: React.PropTypes.array,

    /**
     * The title to display in the appbar header
     */
    title: React.PropTypes.string,

    /**
     * Collection of entities that were selected by clicking the entity's checkbox
     */
    selectedEntities: React.PropTypes.array,

    /**
     * Actions that the user can perform on this entity
     */
    actions: React.PropTypes.object,

    /**
     * The size of the device as defined by /Device.js
     */
    deviceSize: React.PropTypes.number,

    /**
     * Action performed when the icon left of the title gets clicked
     */
    onLeftIconClick: React.PropTypes.func,

    /**
     * Icon to use for the icon to the left of the title
     */
    leftIcon: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.element
    ]),

    /**
     * Callback function that is called when search keyword is changed
     */
    onSearchChange: React.PropTypes.func,

    /**
     * Callback function that is called when doing an advanced search
     */
    onAdvancedSearch: React.PropTypes.func,

    /**
     * Callback function that is called performing an action
     */
    onPerformAction: React.PropTypes.func,

    /**
     * Callback function that is called clicking the select all checkbox
     */
    onSelectAll: React.PropTypes.func,

    /**
     * Callback function that is called when a browser view is selected
     */
    onSelectBrowserView: React.PropTypes.func
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);

    this.state = {
      searchMode: false,
      autoFocus: false,
    }
  }

  /**
   * Render our component
   *
   * @returns {Object} React component
   */
  render() {
    let elementRight = null;
    let elemmentLeft = null;
    let elementCenter = null;
    let title = this.props.title;

    if (this.props.selectedEntities && this.props.selectedEntities.length) {

      // Create exit button for select mode
      elemmentLeft = (
        <IconButton
          key="back"
          onClick={this._deSelectAll}>
          <ArrowBackIcon />
        </IconButton>
      );

      // Create right actions
      elementRight = [];
      for (let name in this.props.actions) {
        let act = this.props.actions[name];
        elementRight.push(
          <IconButton
            key={name}
            onClick={(evt) => { this.props.onPerformAction(name); } }>
            <act.icon />
          </IconButton>
        );
      }
      title = this.props.selectedEntities.length + "";

    } else if (this.state.searchMode) {

      // Create exit search mode button
      elemmentLeft = (
        <IconButton
          key="searchLeft"
          onClick={this.toggleSearchMode}>
          <ArrowBackIcon />
        </IconButton>
      );

      elementCenter = (
        <TextField
          hintText="Search"
          ref='searchInput'
          autoFocus={this.state.autoFocus}
          onBlur={this.handleSearchBlur}
          onKeyDown={this.handleSearchKeyUp_}
        />
      );

      elementRight = [
        <IconButton
          key="searchGo"
          onClick={this.handleSearchIconClick}>
          <SearchIcon />
        </IconButton>,
        <IconButton
          key="advancedSearchRight"
          onClick={this._handleAdvancedSearch}>
          <MoreVertIcon />
        </IconButton>
      ];

      // Clear the title
      title = "";
    } else {

      if (this.props.leftIcon && this.props.onLeftIconClick) {
        const IconComponent = this.props.leftIcon;
        elemmentLeft = (
          <IconButton
            key="leave"
            onClick={this.props.onLeftIconClick}>
            <IconComponent />
          </IconButton>
        );
      }

      // Show default AppBar with nothing selected and no search
      elementRight = [
        <IconButton
          key="searchRight"
          onClick={this.toggleSearchMode}>
          <SearchIcon />
        </IconButton>
      ];

      // Display the browser view dropdown in the right element of appbar
      elementRight.push(
        <BrowserViewDropdown
          key="browserViewDropdownAppBar"
          currentBrowserViewData={this.props.currentBrowserViewData}
          browserViewDataList={this.props.browserViewDataList}
          onSelectBrowserView={this.props.onSelectBrowserView}
        />
      );

      // Make sure we have current browser view before we change the app bar title
      if (this.props.currentBrowserViewData) {
        title = this.props.currentBrowserViewData.name;
      }
    }

    return (
      <AppBar
        fixed={true}
        key="appBarBrowse"
        iconElementLeft={elemmentLeft}
        iconElementRight={elementRight}
        title={title}
        zDepth={0}
      >
        {elementCenter}
      </AppBar>
    );
  }

  /**
   *  Turn search mode on or off
   *
   * @param evt
   */
  toggleSearchMode = (evt) => {
    // Clear any text
    if (this.props.onSearchChange) {
      this.props.onSearchChange("");
    }

    this.setState({searchMode: (!this.state.searchMode)});
    // Auto trigger searchGo button
    this.handleSearchIconClick();
  };

  /**
   * Handle getting search params
   */
  handleSearchIconClick = (evt) => {
    this.setState({autoFocus: true});
    if (this.props.onSearchChange) {
      this.props.onSearchChange(this.refs.searchInput.getValue());
    }
  };

   /**
   * Handles the onblur event of the search text input
   *
   * @param {DOMEvent} evt      Reference to the DOM event being sent
   * @private
   */
  handleSearchBlur = (evt) => {
    this.setState({autoFocus: false});
  };

  /**
   * Handles the key press of search text input
   *
   * @param {DOMEvent} evt      Reference to the DOM event being sent
   * @private
   */
  handleSearchKeyUp_ = (evt) => {
    if (!this.props.onSearchChange) {
      return;
    }

    if (evt.keyCode == KeyCodes.ENTER) {
      this.props.onSearchChange(this.refs.searchInput.getValue());
    }
  };

  /**
   * Deselect all
   */
  _deSelectAll = (evt) => {
    if (this.props.onSelectAll) {
      this.props.onSelectAll(false);
    }
  };

  /**
   * Callback used to handle commands when user clicks the button to display the menu in the popover
   *
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @private
   */
  _handlePopoverDisplay = (e) => {
    // This prevents ghost click.
    e.preventDefault();

    this.setState({
      openMenu: this.state.openMenu ? false : true,
      anchorEl: e.currentTarget
    });
  };

  /**
   * Callback used to close the popover
   *
   * @private
   */
  _handlePopoverRequestClose = () => {
    this.setState({openMenu: false});
  };

  /**
   * Displays the advanced search
   */
  _handleAdvancedSearch = () => {
    if (this.props.onAdvancedSearch) {
      this.props.onAdvancedSearch()
    }
  }
}

export default AppBarBrowse;
