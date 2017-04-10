import React from 'react';
import EntityCollection from '../../models/entity/Collection';

/**
 * Handle processes for textfield autocomplete
 */
var TextFieldAutoComplete = {

    propTypes: {
        autoCompleteObjType: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            autoCompleteObjType: 'user',
        }
    },

    getInitialState: function () {
        return {
            entityCollection: null,
        }
    },

    /**
     * Get the users data to be used in autocomplete list
     *
     * @params {string} keyword         The search keyword used to filter the user entities
     * @params {func} doneCallback      This doneCallback function is called one collection has loaded the data
     * @public
     */
    getAutoCompleteData: function (keyword, doneCallback) {

        if (!this.state.entityCollection) {
            this.state.entityCollection = new EntityCollection(this.props.autoCompleteObjType);

            /**
             * Force the entity collection to only have one backend request
             * This will enable us to abort other requests that are in-progress
             */
            this.state.entityCollection.forceOneBackendRequest();
        }

        this.state.entityCollection.clearConditions();
        this.state.entityCollection.where("*").like(keyword);

        var collectionDoneCallback = function () {

            var entities = this.state.entityCollection.getEntities();

            // We are setting the payload and text here to be displayed in the menu list
            var autoCompleteData = entities.map(function (entity) {
                return {
                    payload: entity.id,
                    text: entity.getValue('full_name')
                };
            });

            doneCallback(autoCompleteData);
        }.bind(this);

        this.state.entityCollection.load(collectionDoneCallback);
    },

    /**
     * AutoComplete function that will transform the selected data to something else
     *
     * @param {object} data     THe autocomplete selected data
     * @returns {string}
     * @public
     */
    transformAutoCompleteSelected: function (data) {

        /**
         * The data contains payload and text as its object fields.
         * Payload contains the user id and text has the user's full name
         */
        return this.props.entity.encodeObjRef(this.props.autoCompleteObjType, data.payload, data.text);
    },
};

// Check for commonjs
if (module) {
    module.exports = TextFieldAutoComplete;
}

export default TextFieldAutoComplete;
