/**
 * Table row view of an entity
 */
import theme from './theme-item.scss';
import React from 'react';
import classnames from 'classnames';
import EntityField from '../../models/entity/definition/Field';
import EntityModel from '../../models/entity/Entity';
import BrowserView from '../../models/entity/BrowserView';

// Chamel Controls
import Checkbox from 'chamel/lib/Toggle/Checkbox';

/**
 * List item container (table row) for Entity Browser
 */
class ListItemTableRow extends React.Component {
    static propTypes = {

        /**
         * Callback to call when a user clicks on an entity
         *
         * @var {function}
         */
        onClick: React.PropTypes.func,

        /**
         * Callback to call any time a user selects an entity from the list
         *
         * @var {function}
         */
        onCheck: React.PropTypes.func,

        /**
         * The entity we are printing
         *
         * TODO: Instead of passing the entity model, pass only the entity data and create the entity instance inside this component
         * @var {Entity}
         */
        entity: React.PropTypes.instanceOf(EntityModel),

        /**
         * The browser view data that will be used to define the columns in the row
         *
         * @var {object}
         */
        browserViewData: React.PropTypes.object.isRequired
    }

    /**
     * Class constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
    };

    shouldComponentUpdate(nextProps, nextState) {

        // If we do not have any changes in the nextProps, then we will not proceed with re-rendering the component
        if (this.props.browserViewData != nextProps.browserViewData) {
            return true;
        } else if (this.props.entity.getValue("revision") == nextProps.entity.getValue("revision")
            && this.props.selected == nextProps.selected) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Render the entity table row
     *
     * @returns {React.DOM}
     */
    render() {
        const entity = this.props.entity;
        let classes = classnames(theme.entityBrowserItem, theme.entityBrowserItemTrow);

        if (this.props.selected) {
            classes = classnames(classes, theme.entityBrowserItemSelected);
        }

        // Check if the current entity is unseen, then set the unseen class
        if (this.props.entity.getValue("f_seen") === false) {
            classes = classnames(classes, theme.entityBrowserItemUnseen);
        }

        // Add columns
        let columns = [];
        const fields = this.getFieldsToRender_();
        for (let i = 0; i < fields.length; i++) {

            // The first cell should has a bold/name class
            let cellClassName = (i === 0) ? theme.entityBrowserItemTrowName : null;
            // Get the value
            const fieldDef = this.props.entity.def.getField(fields[i]);
            let cellContents = null;

            switch (fieldDef.type) {
                case EntityField.types.fkey:
                case EntityField.types.fkeyMulti:
                case EntityField.types.object:
                case EntityField.types.objectMulti:
                    cellContents = this.props.entity.getValueName(fields[i]);
                    if (cellContents instanceof Object) {
                        let buf = "";
                        for (let prop in cellContents) {
                            buf += (buf) ? ", " + cellContents[prop] : cellContents[prop];
                        }
                        cellContents = buf;
                    }
                    break;
                case EntityField.types.date:
                case EntityField.types.timestamp:
                    cellContents = this.props.entity.getTime(fields[i], true);
                    break;
                default:
                    cellContents = this.props.entity.getValue(fields[i]);
                    break;
            }

            // Truncate long strings
            if (cellContents) {
                cellContents = (cellContents.length > 20)
                    ? cellContents.substr(0, 100) + '...' : cellContents;
            }

            // Add the column
            columns.push(
                <td key={i} className={cellClassName} onClick={this.props.onClick}>
                    <div>{cellContents}</div>
                </td>
            );
        }

        return (
            <tr className={classes}>
                <td className={theme.entityBrowserItemTrowIcon}>
                    <div className={theme.entityBrowserItemCmpIcon}>
                        <Checkbox checked={this.props.selected} onChange={this.toggleSelected}/>
                    </div>
                </td>
                {columns}
            </tr>
        );
    };

    /**
     * Toggle selected state
     */
    toggleSelected = () => {
        if (this.props.onSelect) {
            this.props.onSelect();
        }
    };

    /**
     * Try to determine which fields we should use for table columns
     *
     * @return {string[]}
     */
    getFieldsToRender_ = () => {
        const browserView = new BrowserView();

        browserView.fromData(this.props.browserViewData);
        const fields = browserView.getTableColumns();

        // If no table columns are defined in the view, then guess
        if (fields.length < 1) {
            if (this.props.entity.def.getNameField()) {
                fields.push(this.props.entity.def.getNameField());
            }

            // TODO: Add more common fields here
        }

        return fields;
    }
}

export default ListItemTableRow;
