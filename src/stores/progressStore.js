import Dispatcher from "./../dispatcher/appDispatcher";
import * as ActionTypes from "./../constants/actionTypes";
import {EventEmitter} from "events";
import assign from "object-assign";
const CHANGE_EVENT = "change";

let ProgressStore = assign({}, EventEmitter.prototype, {
  requests: 0,

  addRequest: function () {
    return ++this.requests;
  },

  remRequest: function () {
    return --this.requests;
  },

  getRequests: function () {
    return this.requests;
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
    case ActionTypes.START_REQUEST:
      ProgressStore.emitChange(ActionTypes.START_REQUEST, ProgressStore.addRequest() > 0);
      break;
    case ActionTypes.STOP_REQUEST:
      ProgressStore.emitChange(ActionTypes.STOP_REQUEST, ProgressStore.remRequest() > 0);
      break;
    default:
    // no op
  }
});

export default ProgressStore;