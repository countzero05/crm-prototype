import Dispatcher from "./../dispatcher/appDispatcher";
import * as ActionTypes from "./../constants/actionTypes";
import {EventEmitter} from "events";
import assign from "object-assign";
const CHANGE_EVENT = "change";

let UserStore = assign({}, EventEmitter.prototype, {
  users: [],
  _users: {},

  setUsers: function (users) {
    this.users = users;

    this._users = users.length ? users.reduce((self, user) => {
        self[user._id] = user;
        return self
      }, {}) : {};

    return this;
  },

  getUsers: function () {
    return this.users;
  },

  _getUsers: function () {
    return this._users;
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
    case ActionTypes.INITIALIZE_USERS:
      UserStore.setUsers(action.users);
      UserStore.emitChange(ActionTypes.INITIALIZE_USERS, action.users);
      break;
    case ActionTypes.INITIALIZE_USER:
      UserStore.emitChange(ActionTypes.INITIALIZE_USER, action.user);
      break;
    case ActionTypes.UPDATE_USER:
      UserStore.emitChange(ActionTypes.UPDATE_USER, action.user);
      break;
    case ActionTypes.CREATE_USER:
      UserStore.emitChange(ActionTypes.CREATE_USER, action.user);
      break;
    case ActionTypes.DELETE_USER:
      UserStore.emitChange(ActionTypes.DELETE_USER, action.user);
      break;
    default:
    // no op
  }
});

export default UserStore;