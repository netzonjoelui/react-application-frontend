import Definition from './Definition';
import Recurrence from './Recurrence';
import Members from './Members';
import File from './fileattachment/File';
import events from '../../util/events';
import { stripTags } from '../../util/strings';

/**
 * Entity represents a netric object
 *
 * @constructor
 * @param {Definition} entityDef Required definition of this entity
 * @param {Object} opt_data Optional data to load into this object
 */
var Entity = function (entityDef, opt_data = {}) {

  /**
   * Unique id of this object entity
   *
   * @public
   * @type {string}
   */
  this.id = opt_data.id || "";

  /**
   * The object type of this entity
   *
   * @public
   * @type {string}
   */
  this.objType = entityDef.objType;

  /**
   * Entity definition
   *
   * @public
   * @type {Definition}
   */
  this.def = entityDef;

  /**
   * Flag to indicate fieldValues_ have changed for this entity
   *
   * @private
   * @type {bool}
   */
  this.dirty_ = false;

  /**
   * Field values
   *
   * @private
   * @type {Object}
   */
  this.fieldValues_ = {};

  /**
   * This will be used to save or load the recurrence pattern
   *
   * @private
   * @type {Entity/Recurrence}
   */
  this._recurrencePattern = null;

  /**
   * This will be used to handle the actions for members
   *
   * Sample: this.members[attendees] = Entity/Members
   *
   * @private
   * @type {Array[fieldName] Entity/Members}
   */
  this._members = [];

  /**
   * Security
   *
   * @public
   * @type {Object}
   */
  this.security = {
    view: true,
    edit: true,
    del: true,
    childObject: {}
  };

  /**
   * Loading flag is used to indicate if the entity is pending a load
   *
   * This is useful for allowing "promise entities" where a request
   * has been made to fill an entity from the server, by an empty
   * entity with only the id and the objType set is returned to allow
   * the client to continue working.
   *
   * @public
   * @type {bool}
   */
  this.isLoading = false;

  // If data has been passed then load it into this entity
  if (opt_data) {
    this.loadData(opt_data);
  }
};

/**
 * Load data from a data object in array form
 *
 * If we are loading in array form that means that properties are not camel case
 *
 * @param {Object} data
 */
Entity.prototype.loadData = function (data) {

  // Data is a required param and we should fail if called without it
  if (!data) {
    throw "'data' is a required param to loadData into an entity";
  }

  // First set common public properties
  if (data.id) {
    this.id = data.id.toString();
  }
  if (data.obj_type) {
    this.objType = data.obj_type;
  }

  // Now set all the values for this entity
  for (var i in data) {

    var field = this.def.getField(i);
    var value = data[i];

    // Skip over non existent fields
    if (!field) {
      continue;
    }

    // Check to see if _fval cache was set
    var valueName = (data[i + "_fval"]) ? data[i + "_fval"] : null;

    // Set the field values
    if (field.type == field.types.fkeyMulti || field.type == field.types.objectMulti) {
      if (value instanceof Array) {
        for (var j in value) {
          var vName = (valueName && valueName[value[j]]) ? valueName[value[j]] : null;
          this.addMultiValue(i, value[j], vName);
        }
      } else {
        var vName = (valueName && valueName[value]) ? valueName[value] : null;
        this.addMultiValue(i, value, vName);
      }
    } else {
      this.setValue(i, value, valueName);
    }
  }

  // Handle Recurrence
  if (data['recurrence_pattern']) {
    this._recurrencePattern = new Recurrence(this.objType);
    this._recurrencePattern.fromData(data['recurrence_pattern']);
  }

  // Trigger onload event to alert any observers that the data for this entity has loaded (batch)
  events.triggerEvent(this, "load");
};

/**
 * Return an object representing the actual values of this entity
 *
 * @return {}
 */
Entity.prototype.getData = function () {

  // Set the object type
  var retObj = {obj_type: this.objType};

  // Loop through all fields and set the value
  var fields = this.def.getFields();
  for (var i in fields) {
    var field = fields[i];
    var value = this.getValue(field.name);
    var valueNames = this.getValueName(field.name);

    retObj[field.name] = value;

    if (valueNames instanceof Array) {

      retObj[field.name + "_fval"] = {};
      for (var i in valueNames) {
        retObj[field.name + "_fval"][valueNames[i].key] = valueNames[i].value;
      }

    } else if (valueNames) {

      retObj[field.name + "_fval"] = {};
      retObj[field.name + "_fval"] = valueNames;

    }
  }

  // Get the recurrence pattern data if available
  if (this._recurrencePattern && this._recurrencePattern.type > 0) {
    retObj.recurrence_pattern = this._recurrencePattern.toData();
  }

  /*
   * Get all new members from the Members model.
   *
   * We buffer newly added members in a [field_name]_new property so they can be saved
   * after the server finishes saving this entity. This allows users to add new members
   * which are really just entities referencing this entity, without having to save this
   * entity first. That is a difficult situation because an entity object knows which entity
   * it belongs to through an obj_reference field, but if the main entity has not been saved
   * yet there is no id to reference - hence we send these *_new member entities to be saved
   * after the main entity is saved so the reference can be set.
   *
   * We will loop thru this._members[] array since we set the fieldName as its index
   * for us to be able to set multiple members object type
   */
  for (var fieldName in this._members) {
    var member = this._members[fieldName];

    retObj[fieldName + '_new'] = member.getNewMembers();
  }

  return retObj;
};

/**
 * Set the value of a field of this entity
 *
 * @param {string} name The name of the field to set
 * @param {mixed} value The value to set the field to
 * @param {string} opt_valueName The label if setting an fkey/object value
 * @return {bool} true on success, false on failure
 */
Entity.prototype.setValue = function (name, value, opt_valueName) {

  // Can't set a field without a name
  if (typeof name == "undefined")
    return;

  var valueName = opt_valueName || null;

  var field = this.def.getField(name);
  if (!field)
    return false;

  // Check if this is a multi-value field
  if (field.type == field.types.fkeyMulti || field.type == field.types.objectMulti) {
    throw "Call addMultiValue to handle values for fkey_multi and object_mulit";
  }

  // Handle type conversion
  value = this.normalizeFieldValue_(field, value);

  // Referenced object fields cannot be updated
  if (name.indexOf(".") != -1) {
    return;
  }

  // If a special property for this object also set
  if (name == "id") {
    this.id = value;
  }

  // A value of this entity is about to change
  this.dirty_ = true;

  // Set the value and optional valueName label for foreign keys
  this.fieldValues_[name] = {
    value: value,
    valueName: (valueName) ? valueName : null
  };

  // Trigger onchange event to alert any observers that this value has changed
  events.triggerEvent(this, "change", {fieldName: name, value: value, valueName: valueName});

};

/**
 * Add a value to a field that supports an array of values
 *
 * @param {string} name The name of the field to set
 * @param {mixed} value The value to set the field to
 * @param {string} opt_valueName The label if setting an fkey/object value
 */
Entity.prototype.addMultiValue = function (name, value, opt_valueName) {

  // Can't set a field without a name
  if (typeof name == "undefined")
    return;

  var valueName = opt_valueName || null;

  var field = this.def.getField(name);
  if (!field)
    return;

  // Handle type conversion
  value = this.normalizeFieldValue_(field, value);

  // Referenced object fields cannot be updated
  if (name.indexOf(".") != -1) {
    return;
  }

  // A value of this entity is about to change
  this.dirty_ = true;

  // Initialize arrays if not set
  if (!this.fieldValues_[name]) {
    this.fieldValues_[name] = {
      value: [],
      valueName: []
    }
  }

  // First clear any existing values
  this.remMultiValue(name, value);

  // Set the value and optional valueName label for foreign keys
  this.fieldValues_[name].value.push(value);

  if (valueName) {
    this.fieldValues_[name].valueName.push({key: value, value: valueName});
  }

  // Trigger onchange event to alert any observers that this value has changed
  events.triggerEvent(this, "change", {fieldName: name, value: value, valueName: valueName});
};

/**
 * Remove a value to a field that supports an array of values
 *
 * @param {string} name The name of the field to set
 * @param {mixed} value The value to set the field to
 */
Entity.prototype.remMultiValue = function (name, value) {

  // Can't set a field without a name
  if (typeof name == "undefined")
    return;

  var field = this.def.getField(name);
  if (!field)
    return;

  // Handle type conversion
  value = this.normalizeFieldValue_(field, value);

  // Referenced object fields cannot be updated
  if (name.indexOf(".") != -1) {
    return;
  }

  // Look for the value
  if (!this.fieldValues_[name]) {
    return false;
  }

  // Remove the value
  for (var i in this.fieldValues_[name].value) {
    if (this.fieldValues_[name].value[i] == value) {
      // A value of this entity is about to change
      this.dirty_ = true;

      // Remove the value which should invalidate the valueName as well
      this.fieldValues_[name].value.splice(i, 1);

      // Remove the value name
      for (var j in this.fieldValues_[name].valueName) {
        if (this.fieldValues_[name].valueName[j].key == value) {
          this.fieldValues_[name].valueName.splice(j, 1);
          break;
        }
      }

      // Trigger onchange event to alert any observers that this value has changed
      events.triggerEvent(this, "change", {
        fieldName: name, value: this.getValue(name), valueName: null
      });

      return true;
    }
  }

  return false;
};

/**
 * Get the value for an object entity field
 *
 * @public
 * @param {string} name The unique name of the field to get the value for
 */
Entity.prototype.getValue = function (name) {
  if (!name)
    return null;

  // Get value from fieldValue
  if (this.fieldValues_[name]) {
    return this.fieldValues_[name].value;
  }

  return null;
};

/**
 * Get the name/lable of a key value
 *
 * @param {string} name The name of the field
 * @param {val} opt_val If querying *_multi type values the get the label for a specifc key
 * @reutrn {Object|string} the textual representation of the key value
 */
Entity.prototype.getValueName = function (name, opt_val) {
  // Get value from fieldValue
  if (this.fieldValues_[name]) {

    /*
     * If they passed opt_val then the client is attempting to get the label
     * value for a specific key rather than an object describing all the
     * key/value values of this fkey/fkey_multi/object/object_multi field.
     *
     * If the field is fkey or object it'll have a .key sub property,
     * if it's an object reference the value of the field is the subkey name
     */
    if (opt_val && (
        this.fieldValues_[name].valueName instanceof Array ||
        this.fieldValues_[name].valueName instanceof Object
      )) {
      for (var idx in this.fieldValues_[name].valueName) {
        // If the valuName is an object then we will get its .key but if its an array we consider the var idx as the index
        var fieldKey = this.fieldValues_[name].valueName[idx].key || idx;
        if (fieldKey === opt_val) {
          // If the valueName is an object then we will return its .value, but if its an array we will return the value based on the var idx index
          return this.fieldValues_[name].valueName[idx].value || this.fieldValues_[name].valueName[idx];
        }
      }
    } else {
      return this.fieldValues_[name].valueName;
    }
  }

  return "";
};

/**
 * Get the human readable name of this object
 *
 * @return {string} The name of this object based on common name fields like 'name' 'title 'subject'
 */
Entity.prototype.getName = function () {
  if (this.getValue("name")) {
    return this.getValue("name");
  } else if (this.getValue("title")) {
    return this.getValue("title");
  } else if (this.getValue("subject")) {
    return this.getValue("subject");
  } else if (this.getValue("first_name") || this.getValue("last_name")) {
    return (this.getValue("first_name"))
      ? this.getValue("first_name") + " " + this.getValue("last_name")
      : this.getValue("last_name");
  } else if (this.getValue("id")) {
    return this.getValue("id");
  } else {
    return "";
  }
};

/**
 * Get a snippet of this object
 *
 * @return {string}
 */
Entity.prototype.getSnippet = function () {
  let snippet = "";

  if (this.getValue("notes")) {
    snippet = this.getValue("notes");
  } else if (this.getValue("description")) {
    snippet = this.getValue("description");
  } else if (this.getValue("body")) {
    snippet = this.getValue("body");
  }

  // Strip all tags and new lines
  snippet = stripTags(snippet);

  return snippet;
};

/**
 * If there are people interacting with this entity get their names
 *
 * @return {string}
 */
Entity.prototype.getActors = function () {
  return "";
};

/**
 * Get relative timestamp
 *
 * @param {string} field Optional field to use (otherwise autodetect)
 * @param {bool} compress If true the compress to time if today, otherwise only show the date
 * @return {string}
 */
Entity.prototype.getTime = function (field, compress) {

  var fieldName = field || null;
  var compressDate = compress || false;
  var defField = this.def.getField(fieldName);

  var val = null;

  if (fieldName) {
    val = this.getValue(fieldName);
  } else if (this.getValue("ts_updated")) {
    val = this.getValue("ts_updated");
  } else if (this.getValue("ts_entered")) {
    val = this.getValue("ts_entered");
  }

  // Check to see if we should compress the date
  if (val && compressDate) {
    var dtVal = new Date(val);
    var today = new Date();

    if (dtVal.getFullYear() == today.getFullYear() &&
      dtVal.getMonth() == today.getMonth() &&
      dtVal.getDate() == today.getDate()) {

      // Show only the time if this is a timezone
      if (defField.type === "timestamp") {
        var hours = dtVal.getHours();
        var minutes = dtVal.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        val = hours + ':' + minutes + ' ' + ampm;
      } else {
        val = "Today";
      }


    } else {

      // Show only the date
      val = (dtVal.getMonth() + 1) + "/" + dtVal.getDate() + "/" + dtVal.getFullYear();
    }
  }
  return val;
};

/**
 * Get the attachments saved in this entity
 *
 * @return {array}
 */
Entity.prototype.getAttachments = function () {

  var attachedFiles = [];

  // Check if this is an existing entity, before we load the attachments
  var files = this.getValueName('attachments');

  for (var idx in files) {
    // Create a file object
    if (files[idx].key) {
      attachedFiles[idx] = new File(files[idx])
    }
  }

  return attachedFiles;
};

/**
 * Normalize field values based on type
 *
 * @private
 * @param {EntityField} field The field we are normalizing
 * @param {mixed} value The value we need to normalize
 * @return {mixed}
 */
Entity.prototype.normalizeFieldValue_ = function (field, value) {

  if (field.type == field.types.bool) {
    switch (value) {
      case 1:
      case 't':
      case 'true':
        value = true;
        break;
      case 0:
      case 'f':
      case 'false':
        value = false;
        break;
    }
  }

  return value;
};

/**
 * Returns the recurrence pattern for this entity
 *
 * @param {bool} createIfNotExist       Determine if we need to create a new instance of recurrence or not if we dont have one
 * @return {Entity/Recurrence}
 */
Entity.prototype.getRecurrence = function (createIfNotExist) {

  /**
   * If we do not have an instance of recurrence yet and we need to create one
   * Then lets instantiate a new Recurrence entity model
   */
  if (!this._recurrencePattern && createIfNotExist) {
    this._recurrencePattern = new Recurrence(this.objType);
  }

  return this._recurrencePattern;
};

/**
 * Sets the recurrence pattern
 *
 * @param {Entity/Recurrence}       Object instance of recurrence model
 * @public
 */
Entity.prototype.setRecurrence = function (recurrencePattern) {
  this._recurrencePattern = recurrencePattern;
};

/**
 * Set any default values for this entity
 *
 * @param {string} onEventName The event name to get defaults for, either 'null', 'update' or 'create'
 * @param {Object} opt_defaultData Optional data to use for defaults, if null use field.getDefault
 * @public
 */
Entity.prototype.setDefaultValues = function (onEventName, opt_defaultData) {

  var defaultData = opt_defaultData || {};

  // Loop through each field and check if it has a default for the given event
  this.def.fields.map(function (field) {

    // If the field has a defaultValue set - this comes from the entity definition
    var defaultValue = field.getDefault(onEventName);

    // If null, then only use default if the value has not already been set
    if (defaultValue
      && (onEventName === 'null' || onEventName === 'create')
      && !this.getValue(field.name)) {

      this.setValue(field.name, defaultValue);
    }

    // Allow the backend to handle the 'update' event since it will return updated data after update

    /*
     * Now check for client side default data apart from the field defaults.
     * This is used when a calling function wants to set defaults beyond what is
     * defined in the field for the entity definition.
     */
    if (this.getValue(field.name) == null // Make sure this field has no stored value yet
      && defaultData[field.name]) {

      // Check if a default value name was also passed
      var valueName = defaultData[field.name + "_fval"] || null;
      this.setValue(field.name, defaultData[field.name], valueName);
    }

  }.bind(this));
};

/**
 * Create an instance of Entity/Members
 *
 * @param {string} fieldName The fieldName used for the member object
 */
Entity.prototype.setMemberEntity = function (fieldName) {

  // Set the fieldName as its index
  this._members[fieldName] = new Members();
};

/**
 * Get an instance of Entity/Members by fieldName
 *
 * @param {string} fieldName The fieldName of members that we want to get
 */
Entity.prototype.getMemberEntity = function (fieldName) {
  return this._members[fieldName];
};

/**
 * Function used to decode object reference string
 *
 * @param string $value The object ref string - [obj_type]:[obj_id]:[name] (last param is optional)
 * @return array Assoc object with the following keys: objType, id, name
 * @public
 */
Entity.prototype.decodeObjRef = function (value) {

  var result,
    matches = null;

  // Remove the closing brackets from the string before we get the matches
  value = value.replace(/[\[\]']+/g, '');

  // Extract all [<obj_type>:<id>:<name>] tags from string
  var parts = value.split(':');

  if (parts.length > 1) {

    // Get the member data if we have found a match
    result = {
      objType: parts[0],
      id: null,
      name: null
    }

    // Was encoded with <obj_type>:<id>:<name> (new)
    if (parts.length === 3) {
      result.id = parts[1];
      result.name = parts[2];
    } else {

      // Check for full name added after bar '|' (old)
      var parts2 = parts[1].split('|');

      if (parts2.length > 1) {
        result.id = parts2[0];
        result.name = parts2[1];
      } else {

        // Possible encoded value is <obj_type>:<id>
        result.id = parts[1];
      }
    }
  } else {

    // Set the objType and Id to null if there is no match, then just set the provided name as member's name
    result = {
      objType: null,
      id: null,
      name: value
    }
  }

  return result;
};

/**
 * Function used to encode an object reference string
 *
 * @param {string} objType The type of entity being referenced
 * @param {string} id The id of the entity being referenced
 * @param {string} name The human readable name of the entity being referenced
 * @return {string} Encoded object reference
 * @public
 */
Entity.prototype.encodeObjRef = function (objType, id, name) {
  var value = objType + ':' + id;

  if (name)
    value += ':' + name;

  return '[' + value + ']';
};

export default Entity;
