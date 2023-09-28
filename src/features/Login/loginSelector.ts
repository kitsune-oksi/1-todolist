import { AppRootStateType } from "store/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
export const selectIsInitialized = (state: AppRootStateType) => state.auth.isInitialized;
