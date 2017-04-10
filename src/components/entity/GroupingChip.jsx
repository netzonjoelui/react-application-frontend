/**
 * A grouping chip displays a single grouping entry
 */
import React from 'react';
import theme from './grouping-chip.scss';

// Chamel Icons
import CancelIcon from 'chamel/lib/icons/font/CancelIcon';

/**
 * Chip used to represent a grouping entry
 */
var GroupingChip = React.createClass({

	propTypes: {
		id: React.PropTypes.number,
		name: React.PropTypes.string,
		onRemove: React.PropTypes.func,
		onClick: React.PropTypes.func
	},

	render: function() {

		let remEl = null;
		if (this.props.onRemove) {
			remEl = (
				<span> | <i className="remove" onClick={this._handleRemove}><CancelIcon /></i></span>
			);
		}

		let divProps = {
			id: this.props.id,
			name: this.props.name,
		}

		if(this.props.onClick) {
			divProps.onClick = function () {
				this.props.onClick();
			}.bind(this);

			divProps.style = {cursor: "pointer", display: "inline-block"};
		}

		return (
			<div className={theme.groupingChip}>
				<div {...divProps}>
					{this.props.name}
				</div>
				{remEl}
			</div>
		);
	},

	/**
	 * Handle removing the grouping chip
	 */
	_handleRemove: function(evt) {
		if (this.props.onRemove) {
			this.props.onRemove(this.props.id, this.props.name);
		}
	}
});

// Check for commonjs
if (module) {
	module.exports = GroupingChip;
}

export default GroupingChip;
