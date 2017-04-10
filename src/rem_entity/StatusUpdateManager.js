import entityLoader from '../models/entity/entityLoader';

var netric = require("../base");
var log = require("../log");
var entitySaver = require("./saver");

/**
 * Global Status Update Manager namespace
 */
var statusUpdateManager = {};

/**
 * Send a status update
 *
 * @param {string} comment                  The status update from the user
 * @param {entity/Entity} opt_entity        The optional entity we are providing an update on
 * @param {function} opt_finishedCallback   If set call this function when we are finished adding the status update
 *
 * @public
 */
statusUpdateManager.send = function (comment, opt_entity, opt_finishedCallback) {

    // Do not save an empty status update/comment
    if (!comment) {
        return;
    }

    var entity = opt_entity || null;

    // Create a new comment and save it
    var statusReferenceEntity = entityLoader.factory('status_update');

    if (comment) {
        statusReferenceEntity.setValue("comment", comment);
    }

    // Add the user
    var userId = -3; // -3 is 'current_user' on the backend
    if (netric.getApplication().getAccount().getUser()) {
        userId = netric.getApplication().getAccount().getUser().id;
    }
    statusReferenceEntity.setValue("owner_id", userId);

    // Add an object reference
    var objReference = null;
    if (entity && entity.id) {
        objReference = entity.objType + ":" + entity.id;

        statusReferenceEntity.setValue('obj_reference', objReference);
    }

    // Save the entity
    entitySaver.save(statusReferenceEntity, function () {
        log.info("Saved status update on", objReference);

        if (opt_finishedCallback) {
            opt_finishedCallback();
        }
    }.bind(this));
}

module.exports = statusUpdateManager;