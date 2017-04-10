/**
 * Render an advanced search
 */
import React from 'react';
import theme from './advancedsearch/_advanced-search.scss';
import BrowserView from '../models/entity/BrowserView';
import Conditions from './entity/Conditions';
import ColumnView from './advancedsearch/ColumnView';
import SaveView from './advancedsearch/SaveView';
import SortOrder from './advancedsearch/SortOrder';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import GridContainer from 'chamel/lib/Grid/Container';
import IconButton from 'chamel/lib/Button/IconButton';
import FlatButton from 'chamel/lib/Button/FlatButton';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import CheckIcon from 'chamel/lib/icons/font/CheckIcon';
import FlagIcon from 'chamel/lib/icons/font/FlagIcon';
import SaveIcon from 'chamel/lib/icons/font/SaveIcon';

/**
 * Displays the advanced search to filter the results list using conditions. It can also set the sort order and columns to view.
 */
class AdvancedSearch extends React.Component {
  static propTypes = {
    /**
     * The definition data that is needed to display the ColumnView and SortOrder
     */
    definitionData: React.PropTypes.object.isRequired,

    /**
     * The current browser view data we are using to display the entity browser
     *
     * @type {object}
     */
    browserViewData: React.PropTypes.object.isRequired,

    /**
     * The type of object we are implementing the advanced search
     *
     * @type {func}
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * Event triggered when applying the changes of browser view
     *
     * @type {func}
     */
    onApplySearch: React.PropTypes.func,

    /**
     * Event triggered when the user wants to set the current browserView as the default view
     *
     * @type {func}
     */
    onSetDefaultView: React.PropTypes.func,

    /**
     * Event triggered when the brower wants to save the current browser view
     *
     * @type {func}
     */
    onDisplaySaveView: React.PropTypes.func,

    /**
     * Callback function that will close the advanced search
     *
     * @type {func}
     */
    onClose: React.PropTypes.func,
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props)

    const browserViewData = Object.assign({}, props.browserViewData);

    this.state = {browserViewData}
  };

  render() {

    const browserViewData = this.state.browserViewData;
    const browserView = new BrowserView();
    browserView.fromData(browserViewData);

    let appbarElementLeft = (
      <IconButton
        key="back"
        onClick={this.props.onClose}>
        <ArrowBackIcon />
      </IconButton>
    );

    let appbarElementRight = [
      (
        <IconButton
          tooltip="Set as Default"
          key="default"
          onClick={this._handleSetDefault}>
          <FlagIcon />
        </IconButton>
      ),
      (
        <IconButton
          tooltip="Save"
          key="save"
          onClick={() => {
            this.props.onDisplaySaveView(browserViewData);
          }}>
          <SaveIcon />
        </IconButton>
      ),
      (
        <IconButton
          tooltip="Apply"
          key="apply"
          onClick={() => {
            this.props.onApplySearch(browserViewData);
          }}>
          <CheckIcon />
        </IconButton>
      )
    ];

    /*
     * TODO: Instead of passing the conditions (array of models/entity/Where classes), just pass the conditions data
     * Reference: See how sort order and column view is handling the browser view data
     */
    const viewConditions = browserView.getConditions();

    return (
      <div>
        <AppBar
          fixed={true}
          key="appBarAdvancedSearch"
          title={browserView.name}
          zDepth={0}
          iconElementLeft={appbarElementLeft}
          iconElementRight={appbarElementRight}
        />
        <GridContainer fluid>
          <div>
            <span className={theme.advancedSearchTitle}>{"Search Conditions: "}</span>
            <Conditions
              objType={this.props.objType}
              conditions={viewConditions}
              onChange={(conditions) => {
                // TODO: this should just return the conditions data and utilize the this.handleBrowserViewDataUpdate()

                // Update the conditions of the browserView
                browserView.setConditions(conditions)
                this.setState({
                  browserViewData: browserView.getData()
                });
              }}
            />
          </div>
          <div>
            <span className={theme.advancedSearchTitle}>{"Sort By: "}</span>
            <SortOrder
              definitionData={this.props.definitionData}
              objType={this.props.objType}
              orderByDataList={browserViewData.order_by}
              onChange={(orderByDataList) => {

                // Update the order by data of the browserView
                this.handleBrowserViewDataUpdate({order_by: orderByDataList});
              }}
            />
          </div>
          <div>
            <span className={theme.advancedSearchTitle}>{"Column View: "}</span>
            <ColumnView
              definitionData={this.props.definitionData}
              objType={this.props.objType}
              fieldNamesList={browserViewData.table_columns}
              onChange={(fieldNamesList) => {

                // Update the table columns data of the browserView
                this.handleBrowserViewDataUpdate({table_columns: fieldNamesList});
              }}
            />
          </div>
        </GridContainer>
      </div>
    );
  };

  /**
   * Handles the updating of browser view data
   *
   * @param {Object} changedData Contains the changes made to the browser view
   */
  handleBrowserViewDataUpdate = (changedBrowserViewData) => {
    const browserView = new BrowserView();

    // Apply first the browser view data set in the state
    browserView.fromData(this.state.browserViewData);

    // Now set the changes made to the browser view data
    browserView.fromData(changedBrowserViewData);

    this.setState({
      browserViewData: browserView.getData()
    });
  }
}

export default AdvancedSearch;
