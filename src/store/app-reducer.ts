import { createSlice, isAnyOf, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { ERequestStatus } from "common/enums";
import { AnyAction } from "redux";
import { todolistThunks } from "store/todolist-reducer";

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
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.status = ERequestStatus.loading;
      })
      .addMatcher(isRejected, (state, action: AnyAction) => {
        state.status = ERequestStatus.failed;
        if (action.payload) {
          if (isAnyOf(todolistThunks.addTodolist.rejected)) return;
          state.error = action.payload.messages[0];
        } else {
          state.error = action.error.message ? action.error.message : "Some error occurred";
        }
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = ERequestStatus.succeeded;
      });
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
