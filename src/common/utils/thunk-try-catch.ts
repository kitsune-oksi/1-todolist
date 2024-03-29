import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatch, AppRootState } from "store";
import { BaseResponse } from "common/api";

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootState, unknown, AppDispatch, null | BaseResponse>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
};
