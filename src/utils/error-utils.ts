import { ResponseType } from "api/todolist-api";
import { appActions } from "store/app-reducer";
import { AppDispatch } from "store/store";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: AppDispatch) => {
  dispatch(appActions.setAppError({ error: error.message }));
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
