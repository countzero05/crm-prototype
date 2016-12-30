import Dispatcher from "./../dispatcher/appDispatcher";
import * as MeApi from "./../api/meApi";
import * as ActionTypes from "./../constants/actionTypes";

export const getMe = () =>
  MeApi.getMe().then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.GET_ME,
      user
    });

    return user;
  });

export const updateMe = user =>
  MeApi.updateMe(user).then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.UPDATE_ME,
      user
    });

    return user;
  });


export const login = data =>
  MeApi.login(data).then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.LOGIN_USER,
      user
    });

    return user;
  });


export const logout = () =>
  MeApi.logout().then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.LOGOUT_USER,
      user
    });

    return user;
  });

