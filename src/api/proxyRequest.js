import request from "axios";
import Dispatcher from "./../dispatcher/appDispatcher";
import * as ActionTypes from "./../constants/actionTypes";
import * as SnackActions from "./../actions/snackActions";

const fireAction = actionType => setTimeout(() => Dispatcher.dispatch({actionType}), 0);

const handleCatch = (...resp) => {
  let {data, status, statusText} = resp[0].response;
  if (status === 500) {
    SnackActions.error(statusText + (data.error && data.error.constructor.name === "String" ? `: ${data.error}` : ""));
  } else {
    SnackActions.warning(statusText + (data.error && data.error.constructor.name === "String" ? `: ${data.error}` : ""));
  }
  fireAction(ActionTypes.STOP_REQUEST);
  if (status === 500) {
    throw new Error(resp[0]);
  }

  return data;
};

const callRequest = method => (...props) => {
  fireAction(ActionTypes.START_REQUEST);
  return request[method](...props)
    .then((...resp) => {
      fireAction(ActionTypes.STOP_REQUEST);
      return resp[0];
    })
    .catch(handleCatch);
};

export default class Request {
  static get = callRequest("get");
  static post = callRequest("post");
  static put = callRequest("put");
  static delete = callRequest("delete");
};