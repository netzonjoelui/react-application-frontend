/**
 * Display list of entity conditions
 */
import React from 'react';
import WhereComponent from './Where.jsx';
import Where from '../../models/entity/Where';

// Chamel Controls
import GridContainer from 'chamel/lib/Grid/Container';
import GridRow from 'chamel/lib/Grid/Row';
import GridColumn from 'chamel/lib/Grid/Column';
import FlatButton from 'chamel/lib/Button/FlatButton';
import FontIcon from 'chamel/lib/FontIcon';
import IconButton from 'chamel/lib/Button/IconButton';

var Conditions = React.createClass({

    /**
     * Expected props
     */
    propTypes: {

        /**
         * Array of conditions to pre-populate
         *
         * @type {Where[]}
         */
        conditions: React.PropTypes.array,

        /**
         * Event triggered any time the user makes changes to the conditions
         *
         * @type {func}
         */
        onChange: React.PropTypes.func,

        /**
         * The type of object we are adding conditions for
         *
         * @type {string}
         */
        objType: React.PropTypes.string.isRequired
    },

    getDefaultProps: function () {
        return {
            // If the caller does not pass any conditions, initilize to 0
            conditions: []
        };
    },

    /**
     * Render list of conditions
     */
    render: function () {

        let Wheres = [];
        for (let i in this.props.conditions) {
            Wheres.push(
                <WhereComponent
                    key={parseInt(i)}
                    index={parseInt(i)}
                    objType={this.props.objType}
                    onChange={this._handleWhereChange}
                    onRemove={this._handleWhereRemove}
                    where={this.props.conditions[i]}
                />
            );
        }

        return (
            <GridContainer fluid>
                {Wheres}
                <GridRow>
                    <GridColumn small={12} style={{marginBottom: '20px'}}>
                        <FlatButton onClick={this._handleAddWhere} label={"Add Condition"}/>
                    </GridColumn>
                </GridRow>
            </GridContainer>
        );
    },

    /**
     * Handle event where an event changes
     *
     * @param {int} index The index of the condition in the array of Wheres
     * @param {Where} where Where object that was edited
     */
    _handleWhereChange: function (index, where) {
        let conditions = this.props.conditions;
        conditions[index] = where;

        if (this.props.onChange) {
            this.props.onChange(conditions);
        }
    },

    /**
     * Remove a where condition from the conditions array
     *
     * @param {int} index The index of the condition in the array of Wheres
     */
    _handleWhereRemove: function (index) {
        let conditions = this.props.conditions;
        conditions.splice(index, 1);

        if (this.props.onChange) {
            this.props.onChange(conditions);
        }
    },

    /**
     * Append a where to the conditions array
     */
    _handleAddWhere: function () {
        let conditions = this.props.conditions;
        // Add a very generic Where condition
        let where = new Where("id");
        conditions.push(where);

        if (this.props.onChange) {
            this.props.onChange(conditions);
        }
    }
});

// Check for commonjs
if (module) {
    module.exports = Conditions;
}

export default Conditions;
