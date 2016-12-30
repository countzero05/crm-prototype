import Dispatcher from "./../dispatcher/appDispatcher";
import * as ActionTypes from "./../constants/actionTypes";

export const success = (message) =>
  Dispatcher.dispatch({
    actionType: ActionTypes.SNACK_OK,
    message
  });

export const error = (message) =>
  Dispatcher.dispatch({
    actionType: ActionTypes.SNACK_ERROR,
    message
  });

export const warning = (message) =>
  Dispatcher.dispatch({
    actionType: ActionTypes.SNACK_WARNING,
    message
  });
