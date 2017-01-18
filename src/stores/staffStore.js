
import Dispatcher from "./../dispatcher/appDispatcher";
import * as ActionTypes from "./../constants/actionTypes";
import {EventEmitter} from "events";
import assign from "object-assign";
const CHANGE_EVENT = "change";

let StaffStore = assign({}, EventEmitter.prototype, {
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
    case ActionTypes.INITIALIZE_STAFFS:
      StaffStore.emitChange(ActionTypes.INITIALIZE_STAFFS, action.users);
      break;
    case ActionTypes.INITIALIZE_STAFF:
      StaffStore.emitChange(ActionTypes.INITIALIZE_STAFF, action.user);
      break;
    case ActionTypes.UPDATE_STAFF:
      StaffStore.emitChange(ActionTypes.UPDATE_STAFF, action.user);
      break;
    case ActionTypes.UPLOAD_STAFF:
      StaffStore.emitChange(ActionTypes.UPLOAD_STAFF, action.user);
      break;
    case ActionTypes.CREATE_STAFF:
      StaffStore.emitChange(ActionTypes.CREATE_STAFF, action.user);
      break;
    case ActionTypes.DELETE_STAFF:
      StaffStore.emitChange(ActionTypes.DELETE_STAFF, action.user);
      break;
    default:
    // no op
  }
});

export default StaffStore;