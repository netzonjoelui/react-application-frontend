/**
 * Text field component
 */

import React from 'react';
import theme from '../entity-form.scss';

// Chamel Controls
import TextFieldComponent from 'chamel/lib/Input/TextField';
import EditorComponent from 'chamel/lib/Editor/Editor';
import DropDownMenu from 'chamel/lib/Picker/SelectField';
let TextFieldAutoComplete = require("../../../mixins/TextFieldAutoComplete.jsx");

/**
 * Base level element for enetity forms
 */
var TextField = React.createClass({

  mixins: [TextFieldAutoComplete],

  /**
   * Expected props
   */
  propTypes: {
    elementNode: React.PropTypes.object.isRequired,
    entity: React.PropTypes.object,
    editMode: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      shouldUpdateField: false,
    }
  },

  componentDidMount: function () {
    this._updateFieldValue();
  },

  componentWillReceiveProps: function (nextProps) {
    // If we are changing the edit mode, then we need to update the textfield value
    if (this.props.editMode != nextProps.editMode) {
      this.setState({shouldUpdateField: nextProps.editMode});
    }
  },

  componentDidUpdate: function () {
    if (this.state.shouldUpdateField) {
      this._updateFieldValue();
      this.setState({shouldUpdateField: false});
    }
  },

  render: function () {
    var elementNode = this.props.elementNode;
    var hidelabel = elementNode.getAttribute('hidelabel');
    var fieldName = elementNode.getAttribute('name');
    var multiline = (elementNode.getAttribute('multiline') === 't');
    var rich = (elementNode.getAttribute('rich') === 't');

    var field = this.props.entity.def.getField(fieldName);
    var fieldValue = this.props.entity.getValue(fieldName);

    /*
     * Check if we should be limiting what the user can select
     * with optional values - a DropDown menu
     */
    let optionalValuesData = null;
    let optionalValuesSelectedIndex = 0;
    if (field.optionalValues) {
      optionalValuesData = [];
      for (var optionValue in field.optionalValues) {
        optionalValuesData.push({
          payload: optionValue,
          text: field.optionalValues[optionValue]
        });
      }

      // If fieldValue is null, then we just need to add a first entry label
      if (fieldValue === null) {

        // Add a first entry label in the optionalValuesData array
        optionalValuesData.unshift({payload: null, text: "Select " + field.title});
      } else {

        // Get the selected index
        for (var i in optionalValuesData) {
          if (optionalValuesData[i].payload === fieldValue) {
            optionalValuesSelectedIndex = i;
          }
        }
      }
    }

    if (this.props.editMode) {
      if (rich) {
        return (
          <EditorComponent
            value={fieldValue}
            onChange={this._handleEditorChange}
          />
        );

      } else if (optionalValuesData) {
        let label = null;
        if (!hidelabel || hidelabel === "f") {
          label = <div className={theme.entityFormFieldLabel}>{field.title}</div>;
        }

        return (
          <div>
            {label}
            <DropDownMenu
              menuItems={optionalValuesData}
              selectedIndex={parseInt(optionalValuesSelectedIndex)}
              onChange={this._handleDropDownInputChange}
            />
          </div>
        );
      } else {

        var autoCompleteAttributes = {
          autoComplete: true,
          autoCompleteDelimiter: '',
          autoCompleteTrigger: '@',
          autoCompleteTransform: this.transformAutoCompleteSelected,
          autoCompleteGetData: this.getAutoCompleteData
        };

        return (
          <TextFieldComponent
            {... autoCompleteAttributes}
            ref='textFieldComponent'
            floatingLabelText={field.title}
            multiLine={multiline}
            onChange={this._handleInputChange}
          />
        );

      }
    } else {
      let displayText = fieldValue;

      // If optional values then get the text of the field value
      if (optionalValuesData) {
        displayText = optionalValuesData[optionalValuesSelectedIndex].text;
      }

      // Display view mode text as innerhtml
      var innerHtml = this._processViewModeText(displayText, multiline, rich);
      var label = null;

      if (displayText && (!hidelabel || hidelabel === "f")) {
        label = <div className={theme.entityFormFieldLabel}>{field.title}</div>;
      }

      return (
        <div>
          {label}
          <div dangerouslySetInnerHTML={innerHtml}/>
        </div>
      );
    }
  },

  /**
   * Handle value change of dropdowm menu
   *
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @param {int} key The index of the menu clicked
   * @param {array} menuItem The object value of the menu clicked
   * @private
   */
  _handleDropDownInputChange: function (evt, key, menuItem) {
    this.props.entity.setValue(this.props.elementNode.getAttribute('name'), menuItem.payload);
    this.props.onChange(this.props.entity.getData());
  },

  /**
   * Handle value change
   *
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @private
   */
  _handleInputChange: function (evt, value) {
    this.props.entity.setValue(this.props.elementNode.getAttribute('name'), value);
    this.props.onChange(this.props.entity.getData());
  },

  /**
   * Set content if the editor value changed
   *
   * @param content
   * @private
   */
  _handleEditorChange: function (content) {
    this.props.entity.setValue(this.props.elementNode.getAttribute('name'), content);
    this.props.onChange(this.props.entity.getData());
  },

  /**
   * Process text for view (non-edit) mode
   *
   * @param {string} val The value to process
   * @param {bool} multiline If true allow new lines
   * @param {bool} rich If true allow html/rich text
   */
  _processViewModeText: function (fieldValue, multiline, rich) {
    /*
     * Transform fieldValue for display
     */
    if (!rich && fieldValue) {
      var re = new RegExp("\n", 'gi');
      fieldValue = fieldValue.replace(re, "<br />");
    }

    // Activate infocenter_document wikilinks
    if ("infocenter_document" == this.props.entity.def.objType) {
      fieldValue = this._activeWikiLink(fieldValue);
    }

    // Convert email addresses into mailto links
    fieldValue = this._activateLinks(fieldValue);

    /*
     * TODO: Make sanitized hrml object. React requires this because
     * setting innherHTML is a pretty dangerous option in that it
     * is often used for cross script exploits.
     */
    return (fieldValue) ? {__html: fieldValue} : null;
  },

  /**
   * Look for wiki links and convert them to clickable links
   *
   * @param {string} val The value to convert
   */
  _activeWikiLink: function (val) {
    var buf = val;

    if (!buf || typeof buf != "string")
      return buf;

    // Convert [[id|Title]]
    //var re=/\[\[(.*?)\|(.*?)\]\]/gi
    var re = /\[\[([^|\]]*)?\|(.*?)\]\]/gi
    buf = buf.replace(re, "<a href=\"/obj/infocenter_document/$1\" target=\"_blank\">$2</a>");

    // Convert [[id]] with id
    //var re=/\[\[(.*?)]\]/gi
    var re = /\[\[([0-9]+)]\]/gi
    buf = buf.replace(re, "<a href=\"/obj/infocenter_document/$1$1\" target=\"_blank\">$1</a>");

    // Convert [[id]] with uname
    //var re=/\[\[(.*?)]\]/gi
    var re = /\[\[([a-zA-Z0-9_-]+)]\]/gi
    buf = buf.replace(re, "<a href=\"/obj/infocenter_document/uname:$1\" target=\"_blank\">$1</a>");

    return buf;
  },

  /**
   * Look for email addresses and convert them to clickable mailto links
   *
   * @param {string} val The value to convert
   */
  _activateLinks: function (val) {
    var buf = val;

    if (!buf || typeof buf != "string")
      return buf;

    // Repalce all existing link swith target=blank
    var exp = /(^|>|\s)(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    buf = buf.replace(/<a\s+href=/gi, '<a target="_blank" href=');

    // URLs starting with http://, https://, or ftp://
    // var exp = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var exp = /(^|>|\s)(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    buf = buf.replace(exp, '<a href="$2" target="_blank">$2</a>');

    // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    exp = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    buf = buf.replace(exp, '$1<a href="http://$2" target="_blank">$2</a>');

    // Change email addresses to mailto:: links.
    exp = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    var repWith = "<a href=\"javascript:Ant.Emailer.compose('$1', {obj_type:'"
      + this.props.entity.def.objType + "', oid:'" + this.props.entity.id + "'});\">$1</a>"
    buf = buf.replace(exp, repWith);
    // buf = buf.replace(exp, '<a href="mailto:$1">$1</a>');

    // Activate email addresses -- this is what we used before
    // var regEx = /(\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)/;
    // buf = buf.replace(regEx, "<a href=\"mailto:$1\">$1</a>");

    return buf;
  },

  /**
   * Update the text field value with the entity's value
   *
   * @private
   */
  _updateFieldValue: function () {
    if (this.refs.textFieldComponent) {
      var fieldName = this.props.elementNode.getAttribute('name');
      var fieldValue = this.props.entity.getValue(fieldName);
      this.refs.textFieldComponent.setValue(fieldValue);
    }
  }
});

export default TextField;
