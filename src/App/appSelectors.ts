import { AppRootState } from "store";

export const selectError = (state: AppRootState) => state.app.error;
export const selectStatus = (state: AppRootState) => state.app.status;
