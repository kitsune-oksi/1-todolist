import { ResponseType } from "api/todolist-api";
import axios from "axios";
import { appActions, ERequestStatus } from "store/app-reducer";
import { AppDispatch } from "store/store";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: ERequestStatus.failed }));
};

// export const handleServerNetworkError = (error: { message: string }, dispatch: AppDispatch) => {
//   dispatch(appActions.setAppError({ error: error.message }));
//   dispatch(appActions.setAppStatus({ status: "failed" }));
// };

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
  let errorMessage = "Some error occurred";

  // ❗Проверка на наличие axios ошибки
  if (axios.isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(err);
  }

  dispatch(appActions.setAppError({ error: errorMessage }));
  dispatch(appActions.setAppStatus({ status: ERequestStatus.failed }));
};
