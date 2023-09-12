import { AppRootStateType } from "store/store";

export const selectError = (state: AppRootStateType) => state.app.error;
export const selectStatus = (state: AppRootStateType) => state.app.status;
