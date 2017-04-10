import React from 'react';
var Events = require('../utils/Events.jsx');
var Dom = require('../utils/Dom.jsx');

var ClickAwayable = {

  getInitialState: function () {

    // Return the initial state
    return {
      componentIsMounted: false
    };
  },

  //When the component mounts, listen to click events and check if we need to
  //Call the componentClickAway function.
  componentDidMount: function() {
    this.setState({componentIsMounted: true});
    if (!this.manuallyBindClickAway) this._bindClickAway();
  },

  componentWillUnmount: function() {
    this.setState({componentIsMounted: false});
    this._unbindClickAway();
  },

  _checkClickAway: function(e) {
    var el = React.findDOMNode(this);

    // Check if the target is inside the current component
    if (this.state.componentIsMounted &&
      e.target != el &&
      !Dom.isDescendant(el, e.target) &&
      document.documentElement.contains(e.target)) {
      if (this.componentClickAway) this.componentClickAway();
    }
  },

  _bindClickAway: function() {
    Events.on(document, 'click', this._checkClickAway);
  },

  _unbindClickAway: function() {
    Events.off(document, 'click', this._checkClickAway);
  }

};

// Check for commonjs
if (module) {
  module.exports = ClickAwayable;
}

export default ClickAwayable;