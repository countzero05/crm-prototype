import Dispatcher from "./../dispatcher/appDispatcher";
import * as UserApi from "./../api/userApi";
import * as ActionTypes from "./../constants/actionTypes";
import * as SnackActions from "./snackActions";

export const initialize = () =>
  UserApi.getAllUsers().then(users => {
    Dispatcher.dispatch({
      actionType: ActionTypes.INITIALIZE_USERS,
      users
    });

    return users;
  });


export const initializeUser = id =>
  UserApi.getUserById(id).then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.INITIALIZE_USER,
      user
    });
    return user;
  });

export const createUser = user =>
  UserApi.saveUser(user).then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.CREATE_USER,
      user: user
    });

    return user;
  });

export const updateUser = user =>
  UserApi.saveUser(user).then(user => {
    if (user.error) {
      SnackActions.error(user.error);
    } else {
      SnackActions.success("User saved.");
    }
    Dispatcher.dispatch({
      actionType: ActionTypes.UPDATE_USER,
      user: user
    });

    return user;
  });

export const removeUser = user =>
  UserApi.deleteUser(user).then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.DELETE_USER,
      user: user
    });

    return user;
  });


