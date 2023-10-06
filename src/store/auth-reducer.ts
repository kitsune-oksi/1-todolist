import { EResultCode } from "common/enums";
import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "common/utils";
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
    const { rejectWithValue } = thunkAPI;
    const res = await authAPI.login(param);
    if (res.data.resultCode === EResultCode.success) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue(res.data);
    }
  },
);
const logout = createAppAsyncThunk<{ isLoggedIn: boolean }>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await authAPI.logout();
  if (res.data.resultCode === EResultCode.success) {
    dispatch(todolistActions.clearTodolistsData());
    return { isLoggedIn: false };
  } else {
    return rejectWithValue(res.data);
  }
});
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }>("auth/initializeApp", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await authAPI.me();
  dispatch(authActions.setIsInitialized({ isInitialized: true }));
  if (res.data.resultCode === EResultCode.success) {
    return { isLoggedIn: true };
  } else {
    return rejectWithValue(res.data);
  }
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login, initializeApp, logout };
