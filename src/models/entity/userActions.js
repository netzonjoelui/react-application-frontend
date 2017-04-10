import Controls from '../../components/Controls';
import EntityMergeContainer from '../../containers/EntityMergeContainer';
import TimeLogComponent from '../../components/useraction/TimeLog';

export const actionModes = {
  // Viewing a list of entities
  browse: 'browse',
  // Viewing an entity not in edit mode
  view: 'view',
  // Viewing an entity in edit mode
  edit: 'edit'
};

const actions = {
  print: {
    name: "print",
    title: "Print",
    icon: Controls.Icons.PrintIcon,
    modes: [actionModes.browse, actionModes.view],
    objTypes: [] // empty = all
  },
  mergeEntities: {
    name: "mergeEntities",
    title: "Merge Entities",
    icon: Controls.Icons.TransformIcon,
    minimumEntities: 2,
    modes: [actionModes.browse],
    container: EntityMergeContainer,
    objTypes: [] // empty = all
  },
  convertlead: {
    name: "convertlead",
    title: "Convert Lead",
    icon: Controls.Icons.SwapHorizIcon,
    showif: "f_converted=0",
    modes: [actionModes.edit],
    objTypes: ["lead"]
  },
  followup: {
    name: "followup",
    title: "Follow-up",
    icon: Controls.Icons.MoreVertIcon,
    modes: [actionModes.view],
    objTypes: ["customer", "opportunity"],
    container: null // TODO: this should be the plugin container for global.followup
  },
  timelog: {
    name: "timelog",
    title: "Time Log",
    icon: Controls.Icons.AccessTimeIcon,
    modes: [actionModes.view, actionModes.edit],
    objTypes: ["task"],
    container: TimeLogComponent
  },
  changePassword: {
    name: "changePassword",
    title: "Change Password",
    icon: Controls.Icons.SwapHorizIcon,
    modes: [actionModes.edit],
    objTypes: ["user"],
    container: null // TODO: this should be the plugin container for user.ChangePassword
  },
  remove: {
    name: "remove",
    title: "Delete",
    icon: Controls.Icons.DeleteIcon,
    modes: [actionModes.browse, actionModes.view, actionModes.edit],
    objTypes: [] // empty = all
  },
  edit: {
    name: "edit",
    title: "Edit",
    icon: Controls.Icons.EditIcon,
    modes: [actionModes.view],
    objTypes: [] // empty = all
  },
  save: {
    name: "save",
    title: "Save",
    icon: Controls.Icons.SaveIcon,
    modes: [actionModes.edit],
    objTypes: [] // empty = all
  }
};

/**
 * Get an array of action objects for a given object type
 *
 * @param {string} objType The object type we need actions for
 * @param {string} mode The mode we are in
 * @return {{name:{title, icon, minimumEntities, modes, Container}}}
 */
export const getActionsForObjType = (objType, mode = actionModes.view) => {
  let ret = {};
  for (let name in actions) {
    const action = actions[name];
    if ((action.objTypes.length === 0 || action.objTypes.indexOf(objType) !== -1)
      && action.modes.indexOf(mode) !== -1) {
      ret[action.name] = action;
    }
  }
  return ret;
};

/**
 * Get the container for an actionName
 *
 * @param {string} actionName
 * @return {Component}
 */
export const getContainerForAction = (actionName) => {
  const action = actions[actionName] || {};
  return action.container || null;
};