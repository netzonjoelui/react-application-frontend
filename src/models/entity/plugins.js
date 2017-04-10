/**
 * @fileOverview Plugins
 *
 * This contains the list of plugins that are used
 *
 * @author:    Marl Tumulak, marl.tumulak@aereus.com;
 *            Copyright (c) 2016 Aereus Corporation. All rights reserved.
 */
'use strict';

/**
 * Global plugins namespace
 */
var plugins = {}

plugins.List = {
    user_teams: {
        ChildTeams: require('../../components/entity/plugin/user_teams/ChildTeams.jsx')
    },
    user: {
        ChangePassword: require('../../components/entity/plugin/user/ChangePassword.jsx')
    },
    workflow_action: {
        ActionDetails: require('../../components/entity/plugin/workflow_action/ActionDetails.jsx')
    },
    task: {
        LogTime: require('../../components/entity/plugin/task/LogTime.jsx')
    },
    reminder: {
        ExecuteTime: require('../../components/entity/plugin/reminder/ExecuteTime.jsx')
    },
    lead: {
        Convert: require('../../components/entity/plugin/lead/Convert.jsx')
    },
    global: {
        Members: require('../../components/entity/plugin/global/Members.jsx'),
        Followup: require('../../components/entity/plugin/global/Followup.jsx'),
        CustomFields: require('../../components/entity/plugin/global/CustomFields.jsx')
    }
}

module.exports = plugins;