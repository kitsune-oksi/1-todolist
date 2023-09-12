import { AppRootStateType } from "store/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.login.isLoggedIn;
export const selectIsInitialized = (state: AppRootStateType) => state.login.isInitialized;
