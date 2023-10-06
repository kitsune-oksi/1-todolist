import { EResultCode } from "common/enums";
import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
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
    builder.addMatcher(
      isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.initializeApp.fulfilled),
      (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      },
    );
  },
});

// thunks
const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginData>(
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
      const res = await authAPI.login(param);
      if (res.data.resultCode === EResultCode.success) {
        return { isLoggedIn: true };
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
const logout = createAppAsyncThunk<{ isLoggedIn: boolean }>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === EResultCode.success) {
      dispatch(todolistActions.clearTodolistsData());
      return { isLoggedIn: false };
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
    const res = await authAPI.me();
    if (res.data.resultCode === EResultCode.success) {
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
