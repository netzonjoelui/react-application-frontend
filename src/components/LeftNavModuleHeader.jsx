/**
 * Header view for the left nav when loaded from a module
 */
'use strict';

import theme from './_left-nav.scss';
import React from 'react';
import Classable from './mixins/classable.jsx';

// Chamel Controls
import IconButton from 'chamel/lib/Button/IconButton';
import Paper from 'chamel/lib/Paper/Paper';
import Menu from 'chamel/lib/Menu/Menu';
import AppBar from 'chamel/lib/AppBar';
import Popover from 'chamel/lib/Popover/Popover';

// Chamel Icons
import AppsIcon from 'chamel/lib/icons/font/AppsIcon';
import ChevronLeftIcon from 'chamel/lib/icons/font/ChevronLeftIcon';


/**
 * Module shell
 */
var LeftNavModuleHeader = React.createClass({

    mixins: [Classable],

    getInitialState: function() {
        return {
            open: false,
            selectedIndex: 0,
            anchorEl: null
        };
    },

    getDefaultProps: function() {
        return {
            moduleTitle: "Untitled Module"
        };
    },

    componentDidMount: function() {
    },

    render: function() {

        let headerTitle = this.props.title;

        let headerIcon = null;
        if (this.props.deviceIsSmall) {
            if (this.state.open) {
                headerTitle = "Modules";
            } else {
                headerIcon = (
                    <ChevronLeftIcon />
                );
            }
        }

        // TODO: make this dynamic
        let menuItems = [];
        for (let i in this.props.modules) {
            let module = this.props.modules[i];
            menuItems.push({
                text: module.title,
                moduleName: module.name,
                iconClassName: "fa fa-" + module.icon
            });
        }

        // Get the current selected index
        let selectedIndex = null;
        for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i].moduleName == this.props.moduleName) {
                selectedIndex = i;
            }
        }

        /*
        <div className="chamel-app-bar">
            <h1 className="chamel-app-bar-title" onClick={this._handleMenuClick}>
                {headerIcon}{headerTitle}
            </h1>
            <div className={menuClass}>
                <Menu
                    ref="menuItems"
                    zDepth={0}
                    menuItems={menuItems}
                    selectedIndex={selectedIndex}
                    onItemClick={this._handleModuleClick} />
            </div>
        </div>
        */

        let iconLeft = (
          <IconButton onClick={this._handleModuleMenuClick}>
            <AppsIcon />
          </IconButton>
        );

        return (
            <div>
                <AppBar
                    title={headerTitle}
                    iconElementLeft={iconLeft}
                    zDepth={0}
                />
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    onRequestClose={this._handleRequestClose}
                    >
                    <Paper zDepth={1}>
                        <Menu
                            ref="menuItems"
                            zDepth={0}
                            menuItems={menuItems}
                            selectedIndex={selectedIndex}
                            onItemClick={this._handleModuleClick}
                        />
                    </Paper>
                </Popover>
            </div>
        );
    },

    _handleModuleMenuClick: function(e) {
        e.preventDefault();

        this.setState({
            open: this.state.open ? false : true,
            anchorEl: e.currentTarget
        });
    },

    _handleModuleClick:function(e, key, payload) {

        // If we clicked on the curent module again, then just close this menu
        if (this.props.moduleName === payload.moduleName) {
            this.setState({ open: false });
        } else if (this.props.onModuleChange) {
            this.props.onModuleChange(e, payload.moduleName);
            //console.log("Go to module:" + payload.moduleName);
        }
    },

    _handleRequestClose:function(e) {
        this.setState({
            open: false,
        });
    }

});

// Check for commonjs
if (module) {
    module.exports = LeftNavModuleHeader;
}

export default LeftNavModuleHeader;
