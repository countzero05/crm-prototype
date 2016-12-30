
import Dispatcher from "./../dispatcher/appDispatcher";
import * as ActionTypes from "./../constants/actionTypes";
import {EventEmitter} from "events";
import assign from "object-assign";
const CHANGE_EVENT = "change";

let AppStore = assign({}, EventEmitter.prototype, {
  actions: [],

  setActions: function (actions = []) {
    this.actions = actions;
  },

  getActions: function () {
    return this.actions;
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitChange: function (action_type, data) {
    this.emit(CHANGE_EVENT, action_type, data);
  }
});

Dispatcher.register(function (action) {
  switch (action.actionType) {
    case ActionTypes.SET_APP_ACTIONS:
      AppStore.emitChange(ActionTypes.SET_APP_ACTIONS, action.actions);
      break;
    default:
    // no op
  }
});

export default AppStore;