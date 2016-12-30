import Dispatcher from "./../dispatcher/appDispatcher";
import * as ActionTypes from "./../constants/actionTypes";

export const setAppActions = (actions = []) =>
  setTimeout(() =>
    Dispatcher.dispatch({
      actionType: ActionTypes.SET_APP_ACTIONS,
      actions
    }), 0);
