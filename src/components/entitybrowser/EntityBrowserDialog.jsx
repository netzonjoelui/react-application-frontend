/**
 * Render an entity browser in a dialog window
 */
import theme from './theme.scss';
import React from 'react';
var List = require("./List.jsx");
var AppBarBrowse = require("./AppBarBrowse.jsx");
var Loading = require("../Loading.jsx");

/**
 * Module shell
 */
var EntityBrowserDialog = React.createClass({

    propTypes: {
        onSelect: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        title : React.PropTypes.string,
        entities: React.PropTypes.array,
        deviceSize: React.PropTypes.number,
        selectedEntities: React.PropTypes.array,
        browserView: React.PropTypes.object,
        collectionLoading: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            layout: '',
            title: "Browser",
            entities: [],
            selectedEntities: [],
            collectionLoading: false
        }
    },

    render: function() {

        var bodyContent = null;

        /*
        <Dialog
            ref="standardDialog"
            title="Dialog With Standard Actions"
            actions={standardActions}
            actionFocus="submit"
            modal={this.state.modal}>
            The actions in this window are created from the json that's passed in.
        </Dialog>
        */

        if (this.props.entities.length == 0 && this.props.collectionLoading) {
            bodyContent = <Loading />;
        } else if (this.props.entities.length == 0) {
            bodyContent = <div className={theme.entityBrowserBlank}>No items found.</div>;
        } else {
            bodyContent = (<List
                onEntityListClick={this.props.onEntityListClick}
                onEntityListSelect={this.props.onEntityListSelect}
                onLoadMoreEntities={this.props.onLoadMoreEntities}
                entities={this.props.entities}
                selectedEntities={this.props.selectedEntities}
                browserView={this.props.browserView}
                layout={this.props.layout}
                collectionLoading={this.props.collectionLoading} />);

            if (this.props.collectionLoading) {
                // TODO: display loading indicator over the list
            }
        }

        return (
            <div>
                <div>
                    <AppBarBrowse
                        key="appbarDialog"
                        title={this.props.title}
                        actionHandler={this.props.actionHandler}
                        deviceSize={this.props.deviceSize}
                        onNavBtnClick={this.props.onNavBtnClick}
                        onSearchChange={this.props.onSearchChange}
                        onPerformAction={this.props.onPerformAction}
                        onSelectAll={this.handleSeelctAll_}
                        selectedEntities={this.props.selectedEntities} />
                </div>
                <div ref="moduleMain">
                    {bodyContent}
                </div>
            </div>
        );
    },

    /**
     * Public show function
     *
     * @public
     */
    show: function() {
        this.refs.dialog.show();
    },

    /**
     * Hide the dialog
     *
     * @public
     */
    hide: function() {
        this.refs.dialog.dismiss();
    },


    /**
     * Handle select callback
     *
     * @param {int} oid The object id of the entity selected
     * @param {string} title The title or label of the entity selected
     */
    _handleSelect: function(oid, title) {
        if (this.props.onSelect) {
            this.props.onSelect(oid, title);
        }
    },

    /**
     * Handle cancel callback
     *
     * @private
     */
    _handleCancel: function() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }
});

// Check for commonjs
if (module) {
    module.exports = EntityBrowserDialog;
}

export default EntityBrowserDialog;