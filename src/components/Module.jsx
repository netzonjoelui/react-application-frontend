import React from 'react';
import theme from './theme-module.scss';
import { Route, Switch, Redirect } from 'react-router';
import EntityContainer from '../containers/EntityContainer';
import EntityGroupingsContainer from '../containers/EntityGroupingsContainer';
import EntityBrowserContainer from '../containers/EntityBrowserContainer';
import NotificationContainer from '../containers/NotificationContainer';
import EntityGroupings from '../models/entity/Groupings';
import List from 'chamel/lib/List';
import ListItem from 'chamel/lib/List/ListItem';
import LeftNavModuleHeader from './LeftNavModuleHeader';
import Controls from './Controls.jsx';
import Where from '../models/entity/Where';

// Chamel Controls
import Drawer from 'chamel/lib/Drawer';

// Chamel Icons
import MenuIcon from 'chamel/lib/icons/font/MenuIcon';

/**
 * Module shell
 */
class Module extends React.Component {

  /**
   * Properties this component accepts
   */
  static propTypes = {
    /**
     * If true the left nav is not hidable
     */
    leftNavDocked: React.PropTypes.bool,

    /**
     * Currently active route from the left navigation items
     */
    leftNavSelectedRoute: React.PropTypes.string,

    /**
     * Callback when the menu closes
     */
    onMenuClose: React.PropTypes.func,

    /**
     * Array of items for the left nav
     */
    leftNavItems: React.PropTypes.array.isRequired,

    /**
     * Optional default route for the leftnav
     */
    defaultRoute: React.PropTypes.string.isRequired,

    /**
     * Current pathname from the react router
     */
    pathname: React.PropTypes.string,

    /**
     * Callback for when the user selects a new module
     */
    onModuleChange: React.PropTypes.func,

    /**
     * The data that will be used to create the browse by items
     */
    entityGroupings: React.PropTypes.object,

    /**
     * Optional router match for creating dynamic routes and sub-paths
     */
    match: React.PropTypes.object,

    /**
     * Callback function that is called when we want to change the current path of the router
     */
    onRouterPathChange: React.PropTypes.func
  };

  /**
   * Set some sane defaults
   */
  static defaultProps = {
    leftNavDocked: true,
    leftNavSelectedRoute: ""
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call paprent constructor
    super(props);

    this.state = {
      name: "Loading...",
      leftNavOpen: false
    }
  }

  /**
   * Redner the module component
   *
   * @returns {Object} React component
   */
  render() {

    // Set module main
    let moduleMainClass = theme.moduleMain;
    if (this.props.leftNavDocked) {
      moduleMainClass += " " + theme.moduleMainLeftNavDocked;
    }

    // Setup the left nav header
    const leftNavHeader = (
      <LeftNavModuleHeader
        moduleName={this.props.name}
        onModuleChange={this._onModuleChange}
        deviceIsSmall={this.props.deviceIsSmall}
        title={this.props.title}
        modules={this.props.modules}
        user={this.props.user}
      />
    );


    let leftNavItemsList = [];
    let navigationItems = [];
    const pathname = this.props.pathname;

    /*
     * Loop thru each left nav items and checked if we have a item with browseby attribute
     * If so, then we need to populate the browseby items based on the props.groupingsData provided
     */
    this.props.leftNavItems.forEach((navItem, index) => {

      navigationItems.push(navItem);

      // Populate browseby groupings
      if (navItem.browseby && this.props.entityGroupings) {
        this._populateBrowseByGroupings(navigationItems, navItem);
      }

    });

    // If leftnav is not docked, then set action for opening the menu
    const navigationClick = (this.props.leftNavDocked) ? null : this.toggleLeftNav;
    let displayMatchPatterns = null;

    // Loop thru the navigation items (with browseby items) and set them as list item link
    navigationItems.forEach((item, index) => {
      // Determine what our selected route is
      let selectedRoute = this.props.leftNavSelectedRoute || "";
      // If there are subroutes in the path then strip them
      if (selectedRoute.length >= item.route.length) {
        selectedRoute = selectedRoute.substring(0, item.route.length);
      }

      // Define the left icon if any
      let leftElement = null;

      /*
       * If the current nav item is a browseby item, then we will display the color box instead of nav icon
       * Also we will indent the nav item based on the item.indent attribute
       */
      if (item.isBrowseByItem) {
        let colorBoxStyle = {marginLeft: item.indent + 'px'};

        // If item.color attribute is set, then we will use the item.color to color the colorbox
        if (item.color) {
          colorBoxStyle.backgroundColor = item.color;
        }

        // Set the left element
        leftElement = (
          <div className={theme.colorBox} style={colorBoxStyle}>
            &nbsp;
          </div>
        )
      } else if (item.icon) {
        // Set the left element
        if (Controls.Icons.hasOwnProperty(item.icon)) {
          // Get the icon using the item.icon attribute
          const ItemIcon = Controls.Icons[item.icon];
          leftElement = <ItemIcon />;
        }
      }

      const isActive = false;

      // Save the list item link in the leftNavItemsList
      leftNavItemsList.push(
        <ListItem
          leftElement={leftElement}
          key={index}
          selected={isActive}
          primaryText={item.title}
          onTap={(e) => { this._onLeftNavChange(e, index, item)}}
        />
        /*
         <Link key={index} to={pathname + '/' + item.route} onClick={(e) => { this._onLeftNavChange(e, index, item)}}>{
         ({ isActive, onClick }) => {
         return (
         <ListItem
         leftElement={leftElement}
         key={index}
         selected={isActive}
         primaryText={item.title}
         onTap={onClick}
         />
         );
         }
         }</Link>
         */
      );

      if (!displayMatchPatterns) {
        displayMatchPatterns = [];
      }

      // Create a match pattern for each navigation item
      displayMatchPatterns.push(
        <Route key={index} path={pathname + '/' + item.route} render={(props) => {
          switch (item.type) {
            case 'object':
            case 'entity':
              return (
                <EntityContainer
                  objType={item.objType}
                  pathname={props.match.url}
                  onClose={this.goToDefaultRoute}
                />
              );
            case 'browse':
              // Add filters
              let conditions = [];

              // Make sure that the item is a browseByItem and has fieldname and groupId
              if (item.isBrowseByItem && item.fieldName && item.groupId) {

                // Add filter for grouping browse by
                let whereCond = new Where(item.fieldName);
                whereCond.equalTo(item.groupId);
                conditions.push(whereCond);
              }

              return (
                <EntityBrowserContainer
                  objType={item.objType}
                  currentRoutePath={props.match.url}
                  title={item.title}
                  onToolbarLeftIconClick={navigationClick}
                  toolbarLeftIcon={Icons.MenuIcon}
                  conditions={conditions}
                />
              );
            case 'category':
              return (
                <EntityGroupingsContainer
                  objType={item.objType}
                  fieldName={item.fieldName}
                />
              );
          }
        }}/>
      )
    });

    return (
      <div>
        <Drawer
          ref="leftNav"
          open={(this.props.leftNavDocked || this.state.leftNavOpen)}
          permanent={this.props.leftNavDocked}
          clipped={this.props.leftNavDocked}
          transparent={this.props.leftNavDocked}
          onClose={this.toggleLeftNav}>
          {leftNavHeader}
          <List>
            {leftNavItemsList}
          </List>
        </Drawer>
        <div className={moduleMainClass}>
          <Switch>
            {displayMatchPatterns}
            <Route path={pathname} exact render={(props) => (
              <Redirect to={{pathname: pathname + '/' + this.props.defaultRoute}}/>
            )}/>
          </Switch>
        </div>
        <div>
          <NotificationContainer />
        </div>
      </div>
    );
  };

  /**
   * Get the browseByGroupings from the entity groupings
   *
   * @param {array} leftNavItemsList Contains the left navigation items. We will push the grouping items here.
   * @param {object} navItem The current navigation item that has a browseby attribute
   * @private
   */
  _populateBrowseByGroupings = (leftNavItemsList, navItem) => {

    let groupingsData = this.props.entityGroupings[navItem.objType];

    // If we have groupings data, then we will get the groups and set the browse by items
    if (groupingsData && groupingsData.groups) {

      const groupings = new EntityGroupings(navItem.objType, navItem.browseby);
      groupings.fromArray(groupingsData.groups);

      let groups = groupings.getGroupsHierarch();

      this._setBrowseByItems(groups, leftNavItemsList, 15, navItem);
    }
  };

  /**
   * Traverse the groups and set the browseby items. We will also set the indent of each items based on their hierarchy
   *
   * @param {array} groups A collection of groups that is sorted by hierarchy
   * @param {array} leftNavItemsList Contains the left navigation items. We will push the grouping items here.
   * @param {int} indentLevel This will determine how much space we need to indent for this browse by item.
   * @param {object} navItem The current navigation item that has a browseby attribute
   * @private
   */
  _setBrowseByItems = (groups, leftNavItemsList, indentLevel, navItem) => {

    const groupings = new EntityGroupings(navItem.objType, navItem.browseby);

    // Loop through all groups and add to the navigation
    for (var idx in groups) {
      let group = groups[idx];

      leftNavItemsList.push({
        type: 'browse',
        icon: "ChevronRightIcon",
        route: "browseby-group-" + group.id,
        indent: indentLevel,
        isBrowseByItem: true,
        groupId: group.id,
        title: group.name,
        color: group.color,
        objType: groupings.objType,
        fieldName: groupings.fieldName
      });

      // Add children
      if (group.children && group.children.length) {
        this._setBrowseByItems(group.children, leftNavItemsList, (indentLevel + 10), navItem)
      }
    }
  };

  /**
   * The left navigation was changed
   */
  _onLeftNavChange = (evt, index, payload) => {
    if (this.props.onLeftNavChange) {
      this.props.onLeftNavChange(evt, index, payload);
    }

    // If not docked then close the left drawer
    if (!this.props.leftNavDocked) {
      this.toggleLeftNav();
    }

    this.goToRoute(payload.route);
  };

  /**
   * The user selected a different menu
   */
  _onModuleChange = (evt, moduleName) => {
    // If not docked then close the left drawer
    if (!this.props.leftNavDocked) {
      this.toggleLeftNav();
    }


    if (this.props.onModuleChange) {
      this.props.onModuleChange(moduleName);
    }
  };

  /**
   * Open or close the left nav drawer
   */
  toggleLeftNav = () => {
    this.setState({leftNavOpen: !this.state.leftNavOpen});
  };

  /**
   * Used for closing entities and returing to whatever the default route is
   */
  goToDefaultRoute = () => {
    this.props.onRouterPathChange(this.props.pathname + "/" + this.props.defaultRoute)
  };

  /**
   * Push a new URL into the route to go to a new location
   *
   * @param {string} routePath
   */
  goToRoute = (routePath) => {
    this.props.onRouterPathChange(this.props.pathname + "/" + routePath);
  }
}

export default Module;
