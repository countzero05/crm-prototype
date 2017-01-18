import Dispatcher from "./../dispatcher/appDispatcher";
import * as StaffApi from "./../api/staffApi";
import * as ActionTypes from "./../constants/actionTypes";
import * as SnackActions from "./snackActions";

export const initialize = (query) =>
  StaffApi.getAllStaffs(query).then(users => {
    Dispatcher.dispatch({
      actionType: ActionTypes.INITIALIZE_STAFFS,
      users
    });

    return users;
  });


export const initializeStaff = id =>
  StaffApi.getStaffById(id).then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.INITIALIZE_STAFF,
      user
    });
    return user;
  });

export const createStaff = user =>
  StaffApi.saveStaff(user).then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.CREATE_STAFF,
      user: user
    });

    return user;
  });

export const updateStaff = user =>
  StaffApi.saveStaff(user).then(user => {
    if (user.error) {
      SnackActions.error(user.error);
    } else {
      SnackActions.success("Staff saved.");
    }
    Dispatcher.dispatch({
      actionType: ActionTypes.UPDATE_STAFF,
      user: user
    });

    return user;
  });

export const uploadStaff = (user, file) =>
  StaffApi.upload(user._id, file).then(user => {
    if (user.error) {
      SnackActions.error(user.error);
    } else {
      SnackActions.success("Staff saved.");
    }
    Dispatcher.dispatch({
      actionType: ActionTypes.UPLOAD_STAFF,
      user: {...user}
    });

    return user;
  });

export const removeStaff = user =>
  StaffApi.deleteStaff(user).then(user => {
    Dispatcher.dispatch({
      actionType: ActionTypes.DELETE_STAFF,
      user: user
    });

    return user;
  });


