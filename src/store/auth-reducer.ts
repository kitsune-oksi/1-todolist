import { appActions } from "./app-reducer";
import { ERequestStatus, EResultCode } from "common/enums";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { authAPI, LoginData } from "common/api";
import { todolistActions } from "store/todolist-reducer";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isInitialized: false,
  },
  reducers: {
    setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

// thunks
const login = createAppAsyncThunk<undefined, LoginData>(
  "auth/login",
  async (
    param: {
      email: string;
      password: string;
      rememberMe: boolean;
    },
    thunkAPI,
  ) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
      const res = await authAPI.login(param);
      if (res.data.resultCode === EResultCode.success) {
        dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
        return;
      } else {
        const isShowAppError = !res.data.fieldsErrors.length;
        handleServerAppError(res.data, dispatch, isShowAppError);
        return rejectWithValue(res.data);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
const logout = createAppAsyncThunk<undefined>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
    const res = await authAPI.logout();
    if (res.data.resultCode === EResultCode.success) {
      dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      dispatch(todolistActions.clearTodolistsData());
      return;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }>("auth/initializeApp", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
    const res = await authAPI.me();
    if (res.data.resultCode === EResultCode.success) {
      dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, dispatch, false);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(authActions.setIsInitialized({ isInitialized: true }));
  }
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login, initializeApp, logout };
