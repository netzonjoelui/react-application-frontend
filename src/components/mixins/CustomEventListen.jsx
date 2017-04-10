/**
 * Handle lisenting custom events and bubbling them up
 *

 */
'use strict';

/**
 * Handle listening custom events
 */
var CustomEventListen = {

    getInitialState: function () {

        // Return the initial state
        return {
            eventListenerTypes: []
        };
    },

    componentWillUnmount: function() {
        for (var idx in this.state.eventListenerTypes) {
            alib.events.listen(this.props.eventsObj, this.state.eventListenerTypes[idx], null);
        }
    },

    /**
     * Listen a custom event
     *
     * @param {string} type The name of the event type
     * @param {Object} opt_func Optional function that will be executed if the event is triggered
     */
    listenCustomEvent: function(type, opt_func) {
        var evtFunc = opt_func || {};

        if (this.props.eventsObj) {
            alib.events.listen(this.props.eventsObj, type, evtFunc);

            var eventListenerTypes = this.state.eventListenerTypes;
            eventListenerTypes[type] = type;

            this.setState({eventListenerTypes: eventListenerTypes})
        } else {
            throw 'An eventsObj has not been passed by the parent of this componenet.';
        }
    }

};

// Check for commonjs
if (module) {
    module.exports = CustomEventListen;
}

export default CustomEventListen;
