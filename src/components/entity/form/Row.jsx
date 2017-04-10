/**
 * A row
 *
 */

import React from 'react';
import theme from './entity-form.scss';
import EntityFormShowFilter from '../../mixins/EntityFormShowFilter.jsx';

/**
 * Row element
 */
var Row = React.createClass({

    mixins: [EntityFormShowFilter],

    render: function () {

        let displayRow = (
          <div className={theme.entityFormRow}>
              {this.props.children}
          </div>
        );

        let showif = this.props.elementNode.getAttribute('showif');

        if (showif) {

            // If ::evaluateShowIf() returns false, it means that the showif did not match the filter specified
            if(!this.evaluateShowIf(showif)) {
                displayRow = null;
            }
        }

        return (
          displayRow
        );
    }

});

export default Row;