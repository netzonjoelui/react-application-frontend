/**
 * List items for groupings
 */

import React from 'react'
import theme from './_grouping-list.scss';

// Chamel Controls
import Checkbox from 'chamel/lib/Toggle/Checkbox';

/**
 * Module shell
 */
var GroupingList = React.createClass({

  propTypes: {

    /**
     * The group that will be displayed in the list
     *
     * @type {entity/definition/Group}
     */
    group: React.PropTypes.object.isRequired,

    /**
     * Determine how much space we need to indent for this group.
     *
     * The indent value will depend on what is the position of the group in the heirarchy
     *
     * @type {int}
     */
    indent: React.PropTypes.number,

    /**
     * Function that will handle the clicking of category entry
     *
     * @type {function}
     */
    onClick: React.PropTypes.func
  },

  render: function () {

    let colorBoxStyle = {marginLeft: this.props.indent + 'px'};

    if (this.props.group.color) {
      colorBoxStyle.backgroundColor = this.props.group.color;
    }

    return (
      <div className={theme.groupingsItemList} onClick={this._handleClick}>
        <div className={theme.groupingsItemListColor}>
          <div className={theme.colorBox} style={colorBoxStyle}>
            &nbsp;
          </div>
        </div>
        <div className={theme.groupingsItemListName}>
          {this.props.group.name}
        </div>
      </div>
    );
  },

  /**
   * Handle event where the user clicks the category item
   *
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @type {function}
   */
  _handleClick: function (evt) {
    if (this.props.onClick) {
      this.props.onClick(this.props.group);
    }
  }
});

// Check for commonjs
if (module) {
  module.exports = GroupingList;
}

export default GroupingList;
