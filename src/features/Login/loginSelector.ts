import { AppRootState } from "store";

export const selectIsLoggedIn = (state: AppRootState) => state.auth.isLoggedIn;
export const selectIsInitialized = (state: AppRootState) => state.auth.isInitialized;
