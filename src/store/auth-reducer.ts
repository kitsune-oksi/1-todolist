import { appActions, ERequestStatus } from "./app-reducer";
import { AppDispatch } from "./store";
import { authAPI } from "api/todolist-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistActions } from "store/todolist-reducer";

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
};

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ value: boolean }>) => {
      state.isLoggedIn = action.payload.value;
    },
    setIsInitialized: (state, action: PayloadAction<{ value: boolean }>) => {
      state.isInitialized = action.payload.value;
    },
  },
});

export const authReducer = slice.reducer;

export const authActions = slice.actions;

// export const { setIsLoggedIn, setIsInitialized } = slice.actions;

// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case "login/SET-IS-LOGGED-IN":
//       return { ...state, isLoggedIn: action.payload.value };
//     case "login/SET-IS-INITIALIZED":
//       return { ...state, isInitialized: action.payload.value };
//     default:
//       return state;
//   }
// };

// actions
// const setIsLoggedIn = (value: boolean) => {
//   return {
//     type: "login/SET-IS-LOGGED-IN",
//     payload: {
//       value,
//     },
//   } as const;
// };
// const setIsInitialized = (value: boolean) => {
//   return {
//     type: "login/SET-IS-INITIALIZED",
//     payload: {
//       value,
//     },
//   } as const;
// };

// thunks
export const loginTC = (values: LoginDataType) => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
  authAPI
    .login(values)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ value: true }));
        dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
export const initializeAppTC = () => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
  authAPI
    .me()
    .then((res) => {
      dispatch(authActions.setIsInitialized({ value: true }));
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ value: true }));
        dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
export const logoutTC = () => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ value: false }));
        dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
        dispatch(todolistActions.clearTodolistsData());
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

// types
// type InitialStateType = typeof initialState;
// type ActionsType =
//   | SetAppStatusACType
//   | SetAppErrorACType
//   | ReturnType<typeof setIsLoggedIn>
//   | ReturnType<typeof setIsInitialized>;
export type LoginDataType = {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: boolean;
};
