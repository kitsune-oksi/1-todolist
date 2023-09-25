import { AppDispatch } from "../../store/store";
import { appActions } from "../../store/app-reducer";
import { ResponseType } from "../api/common.api";
import { ERequestStatus } from "common/enums/enums";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: ERequestStatus.failed }));
};
