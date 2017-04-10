/**
 * Render an entity browser
 */
import React from 'react';
import theme from './theme.scss';
import KeyCodes from '../utils/KeyCode';
import List from './List';
import AppBarBrowse from "./AppBarBrowse";
import Loading from "../Loading";
import BrowserViewDropdown from './BrowserViewDropdown';

// Chamel Controls
import IconButton from 'chamel/lib/Button/IconButton';
import Paper from 'chamel/lib/Paper/Paper';
import TextField from 'chamel/lib/Input/TextField';
import Toolbar from 'chamel/lib/Toolbar/Toolbar';
import ToolbarGroup from 'chamel/lib/Toolbar/ToolbarGroup';
import FloatingButton from 'chamel/lib/Button/FloatingButton';

// Chamel Icons
import AddCircleIcon from 'chamel/lib/icons/font/AddCircleIcon';
import RefreshIcon from 'chamel/lib/icons/font/RefreshIcon';
import AddIcon from 'chamel/lib/icons/font/AddIcon';
import MoreVertIcon from 'chamel/lib/icons/font/MoreVertIcon';
import SearchIcon from 'chamel/lib/icons/font/SearchIcon';

/**
 * Module shell
 */
export const EntityBrowser = (props) => {
  /**
   * Callback used to handle commands when user selects a browser view to filter the browser list
   *
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @param {int} key The index of the menu clicked
   * @param {Object} data The object value of the menu clicked
   * @private
   */
  const handleSelectView = (e, key, data) => {

    // Get the browser view data selected by using the key
    let browserViewData = props.browserViewDataList[key];

    if (props.onApplySearch) {
      props.onApplySearch(browserViewData);
    }
  };

  let bodyContent = null;

  if (props.entities.length == 0 && props.collectionLoading) {
    bodyContent = <Loading />;
  } else if (props.entities.length == 0) {
    const noItemsMessageText = (props.hideNoItemsMessage) ? "" : "No items found";
    bodyContent = <div className={theme.entityBrowserBlank}>{noItemsMessageText}</div>;
  } else {
    bodyContent = (
      <List
        deviceSize={props.deviceSize}
        pathname={props.pathname}
        onEntityListClick={props.onEntityListClick}
        onEntityListSelect={props.onEntityListSelect}
        onLoadMoreEntities={props.onLoadMoreEntities}
        onRemoveEntity={props.onRemoveEntity}
        onCreateNewEntity={props.onCreateNewEntity}
        entities={props.entities}
        selectedEntities={props.selectedEntities}
        browserViewData={props.browserViewData}
        layout={props.layout}
        collectionLoading={props.collectionLoading}
        filters={props.filters}
        entitiesTotalNum={parseInt(props.entitiesTotalNum)}
      />
    );

    if (props.collectionLoading) {
      // TODO: display loading indicator over the list
    }
  }

  var toolbar = null;
  if (!props.hideToolbar) {
    if (props.toolbarMode === 'appbar') {
      toolbar = (
        <AppBarBrowse
          key="appbarEntityBrowser"
          title={props.title}
          actions={props.actions}
          deviceSize={props.deviceSize}
          onSearchChange={props.onTextSearch}
          onAdvancedSearch={props.onAdvancedSearch}
          onPerformAction={props.onPerformAction}
          onSelectAll={props.onEntityListSelect}
          selectedEntities={props.selectedEntities}
          currentBrowserViewData={props.browserViewData}
          browserViewDataList={props.browserViewDataList}
          onSelectBrowserView={handleSelectView}
          onLeftIconClick={props.onToolbarLeftIconClick}
          leftIcon={props.toolbarLeftIcon}
        />
      );
    } else {
      let textSearchElement;

      toolbar = (
        <Toolbar secondary>
          <ToolbarGroup key={1} align="left">
            <IconButton
              key="new"
              tooltip="New"
              onClick={props.onCreateNewEntity}>
              <AddCircleIcon />
            </IconButton>
            <IconButton
              key="refresh"
              tooltip="Refresh"
              onClick={props.onRefreshEntityList}>
              <RefreshIcon />
            </IconButton>
          </ToolbarGroup>

          <ToolbarGroup key={2} align="right">
            <div className={theme.entityBrowserInlineSearchButtonsContainer}>
              <IconButton
                key="searchGo"
                onClick={ (evt) => {
                  props.onTextSearch(textSearchElement.getValue());
                }}>
                <SearchIcon />
              </IconButton>
              <IconButton
                key="advancedSearchRight"
                onClick={props.onAdvancedSearch}>
                <MoreVertIcon />
              </IconButton>
              <BrowserViewDropdown
                currentBrowserViewData={props.browserViewData}
                browserViewDataList={props.browserViewDataList}
                onSelectBrowserView={handleSelectView}
              />
            </div>
            <div className={theme.entityBrowserInlineSearchTextContainer}>
              <TextField
                hintText="Search"
                ref={ el => textSearchElement = el }
                onKeyDown={(evt) => {
                  if (evt.keyCode == KeyCodes.ENTER) {
                    props.onTextSearch(textSearchElement.getValue());
                  }
                }}
              />
            </div>
          </ToolbarGroup>
        </Toolbar>
      );
    }
  }

  // Floating add button if we are not in inline mode
  let addEntityButton = null;
  if (props.toolbarMode === 'appbar') {
    addEntityButton = (
      <div className={theme.floatingActionButton}>
        <FloatingButton accent onTap={props.onCreateNewEntity}><AddIcon /></FloatingButton>
      </div>
    );
  }

  return (
    <div>
      <div>
        {toolbar}
      </div>
      <div>
        <Paper zDepth={0}>
          {bodyContent}
        </Paper>
      </div>
      {addEntityButton}
    </div>
  );
};

/**
 * Properties this component accepts
 */
EntityBrowser.propTypes = {
  /**
   * Event fired when the user clicks/tabs on an entity in the list
   */
  onEntityListClick: React.PropTypes.func,

  /**
   * When is picker mode this function will be called when user selects an entity
   */
  onEntityListSelect: React.PropTypes.func,

  /**
   * Callback called when a user performs an action on entities
   */
  onPerformAction: React.PropTypes.func,

  /**
   * Callback called when a user deletes an entity
   */
  onRemoveEntity: React.PropTypes.func,

  /**
   * If set then show a menu (hamburger) icon and call this when clicked
   *
   * This is most commonly used in mobile mode where the parent module has a leftNav drawer to open
   */
  onToolbarLeftIconClick: React.PropTypes.func,

  /**
   * Icon to use for the icon to the left of the title
   */
  toolbarLeftIcon: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.element
  ]),

  /**
   * Callback called when the user tries to create a new entity
   */
  onCreateNewEntity: React.PropTypes.func,

  /**
   * Callback when a user refreshes the entities list
   */
  onRefreshEntityList: React.PropTypes.func,

  /**
   * Layout option - TODO: Document
   */
  layout: React.PropTypes.string,

  /**
   * The title to display for the browser like "Inbox"
   */
  title: React.PropTypes.string,

  /**
   * Actions that the user can perform on the entity
   */
  actions: React.PropTypes.object,

  /**
   * Entities to load
   */
  entities: React.PropTypes.array,

  /**
   * The size of the device as defined by /Device.js
   */
  deviceSize: React.PropTypes.number,

  /**
   * Array of entities that are selected
   */
  selectedEntities: React.PropTypes.array,

  /**
   * The browser view data we are using for this entity browser
   */
  browserViewData: React.PropTypes.object,

  /**
   * Flag set when a collection is loading
   */
  collectionLoading: React.PropTypes.bool,

  /**
   * Do not show a toolbar or appbar
   */
  hideToolbar: React.PropTypes.bool,

  /**
   * Type of toolbar to be displayed.
   *
   * @type {string} appbar | toolbar
   */
  toolbarMode: React.PropTypes.oneOf(['appbar', 'toolbar']),

  /**
   * The total number of entities
   *
   * @var {integer}
   */
  entitiesTotalNum: React.PropTypes.number,

  /**
   * If true do not show any text when no entities are found
   *
   * @type {bool}
   */
  hideNoItemsMessage: React.PropTypes.bool,

  /**
   * All browser views data
   */
  browserViewDataList: React.PropTypes.array,

  /**
   * Applying an advanced search
   */
  onApplySearch: React.PropTypes.func,

  /**
   * The current reoute path
   */
  pathname: React.PropTypes.string,

  /**
   * Callback when a user enters search terms
   */
  onTextSearch: React.PropTypes.func
};

/**
 * Set some sane defaults
 */
EntityBrowser.defaultProps = {
  toolbarMode: 'appbar',
  layout: '',
  title: "Browser",
  entities: [],
  selectedEntities: [],
  collectionLoading: false,
  hideNoItemsMessage: false,
  onRemoveEntity: null
};

export default EntityBrowser;
