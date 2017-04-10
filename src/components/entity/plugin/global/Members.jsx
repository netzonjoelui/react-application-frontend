/**
 * Plugin for Members
 */
import React from 'react';
import entityLoader from '../../../../models/entity/entityLoader';

// Chamel Controls
import TextField from 'chamel/lib/Input/TextField';
import IconButton from 'chamel/lib/Button/IconButton';

var TextFieldAutoComplete = require("../../../mixins/TextFieldAutoComplete.jsx");

/**
 * Plugin that handles the membership field for an entity
 */
var Members = React.createClass({

    mixins: [TextFieldAutoComplete],

    /**
     * Expected props
     */
    propTypes: {
        eventsObj: React.PropTypes.object,
        elementNode: React.PropTypes.object,
        entity: React.PropTypes.object,
        editMode: React.PropTypes.bool
    },

    getInitialState: function () {

        var elementNode = this.props.elementNode;
        var fieldName = elementNode.getAttribute('field');
        var field = this.props.entity.def.getField(fieldName);
        var members = this.props.entity.getValueName(fieldName);

        // Setup the entity to accept members
        this.props.entity.setMemberEntity(fieldName);

        // If we have existing members in the entity, then lets add it in the members model
        if (members) {
            members.map(function (member) {
                var memberEntity = entityLoader.factory("member");
                memberEntity.setValue("id", member.key);
                memberEntity.setValue("name", member.value);
                this.props.entity.getMemberEntity(fieldName).add(memberEntity);
            }.bind(this));
        }

        // Return the initial state
        return {
            members: this.props.entity.getMemberEntity(fieldName).getAll()
        };
    },

    /**
     * Render the component
     */
    render: function () {
        var membersDisplay = []
        for(var idx in this.state.members) {
            var member = this.state.members[idx];
            var memberName = member.getValue("name");
            membersDisplay.push(
                <div key={idx} className="entity-form-field">
                    <div className="entity-form-member-value">{this.props.entity.decodeObjRef(memberName).name}</div>
                    <div className="entity-form-member-remove">
                        <IconButton
                            onClick={this._removeMember.bind(this, member)}
                            tooltip={"Remove"}
                            className="cfi cfi-close entity-form-remove-button"
                        />
                    </div>
                    <div className="clearfix"></div>
                </div>
            );
        }

        var autoCompleteAttributes = {
            autoComplete: true,
            autoCompleteDelimiter: '',
            autoCompleteTrigger: '@',
            autoCompleteTransform: this.transformAutoCompleteSelected,
            autoCompleteGetData: this.getAutoCompleteData,
            autoCompleteSelected: this._addMember
        }

        var elementNode = this.props.elementNode;
        var fieldName = elementNode.getAttribute('field');
        var field = this.props.entity.def.getField(fieldName);

        return (
            <div>
                <div className="entity-form-field-value">
                    <TextField
                        {... autoCompleteAttributes}
                        ref="textFieldMembers"
                        floatingLabelText={field.title}/>
                </div>
                {membersDisplay}
            </div>
        )
            ;
    },

    /**
     * Add a member to the entity
     *
     * @param {object} selectedMember The member selected in the autocomplete
     * @private
     */
    _addMember: function (selectedMember) {
        var elementNode = this.props.elementNode;
        var fieldName = elementNode.getAttribute('field');
        var memberEntity = entityLoader.factory("member");

        // Set the member name with the transformed text ([user:userId:userName]) so the member will be notified
        memberEntity.setValue("name", this.transformAutoCompleteSelected(selectedMember));
        this.props.entity.getMemberEntity(fieldName).add(memberEntity);

        // Update the state members
        this.setState({
            members: this.props.entity.getMemberEntity(fieldName).getAll()
        });

        this.refs.textFieldMembers.clearValue();
    },

    /**
     * Remove a member to the entity
     *
     * @param {Entity/Entity} member Instance of entity with member objType
     * @private
     */
    _removeMember: function (member) {
        var elementNode = this.props.elementNode;
        var fieldName = elementNode.getAttribute('field');

        // We will only remove the member in the entity if meber has an id
        if(!member.id) {
            this.props.entity.remMultiValue(fieldName, member.id);
        }

        this.props.entity.getMemberEntity(fieldName).remove(member.id, member.getValue("name"));

        // Update the state members
        this.setState({
            members: this.props.entity.getMemberEntity(fieldName).getAll()
        });
    },
});

// Check for commonjs
if (module) {
    module.exports = Members;
}

export default Members;
