
import Dispatcher from "./../dispatcher/appDispatcher";
import * as ActionTypes from "./../constants/actionTypes";
import {EventEmitter} from "events";
import assign from "object-assign";
const CHANGE_EVENT = "change";

let MeStore = assign({}, EventEmitter.prototype, {
  user: null,

  setUser: function (user) {
    this.user = user;
  },

  getUser: function () {
    return this.user;
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
    case ActionTypes.GET_ME:
      MeStore.setUser(action.user);
      MeStore.emitChange(ActionTypes.GET_ME, action.user);
      break;
    case ActionTypes.GET_ME_ALGORITHMS:
      MeStore.emitChange(ActionTypes.GET_ME_ALGORITHMS, action.algorithms);
      break;
    case ActionTypes.UPDATE_ME:
      MeStore.setUser(action.user);
      MeStore.emitChange(ActionTypes.UPDATE_ME, action.user);
      break;
    case ActionTypes.UPDATE_ME_ALGORITHMS:
      MeStore.emitChange(ActionTypes.UPDATE_ME_ALGORITHMS, action.algorithms);
      break;
    case ActionTypes.LOGIN_USER:
      MeStore.setUser(action.user);
      MeStore.emitChange(ActionTypes.LOGIN_USER, action.user);
      break;
    case ActionTypes.LOGOUT_USER:
      MeStore.setUser(action.user);
      MeStore.emitChange(ActionTypes.LOGOUT_USER, action.user);
      break;
    default:
    // no op
  }
});

export default MeStore;