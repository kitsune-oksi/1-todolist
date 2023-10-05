import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootState } from "store";
import { BaseResponse } from "common/api";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState;
  dispatch: AppDispatch;
  rejectValue: null | BaseResponse;
}>();
