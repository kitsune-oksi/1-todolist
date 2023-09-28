import { AppDispatch } from "store/store";
import { appActions } from "store/app-reducer";
import { ERequestStatus } from "common/enums";
import { BaseResponseType } from "common/api/commonTypes";

/**
 * Данная функция обрабатывает ошибки, которые могут возникнуть при взаимодействии с сервером.
 * @param data  - ответ от сервера в формате BaseResponseType<T>
 * @param dispatch - функция для отправки сообщений в store Redux
 * @param showError - флаг, указывающий, нужно ли отображать ошибки в пользовательском интерфейсе
 */
export const handleServerAppError = <T>(
  data: BaseResponseType<T>,
  dispatch: AppDispatch,
  showError: boolean = true,
) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: ERequestStatus.failed }));
};
