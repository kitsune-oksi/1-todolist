import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ERequestStatus } from "common/enums";

type InitialState = {
  status: ERequestStatus;
  error: null | string;
};

const slice = createSlice({
  name: "app",
  initialState: {
    status: ERequestStatus.idle,
    error: null,
  } as InitialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: ERequestStatus }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
