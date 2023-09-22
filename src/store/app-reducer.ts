import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ERequestStatus {
  idle = "idle",
  loading = "loading",
  succeeded = "succeeded",
  failed = "failed",
}

const initialState: InitialStateType = {
  status: ERequestStatus.idle,
  error: null,
};

const slice = createSlice({
  name: "app",
  initialState: initialState,
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

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case "APP/SET-STATUS":
//       return { ...state, status: action.payload.status };
//     case "APP/SET-ERROR":
//       return { ...state, error: action.payload.error };
//     default:
//       return state;
//   }
// };

// actions
// export const setAppStatus = (status: RequestStatusType) => {
//   return {
//     type: "APP/SET-STATUS",
//     payload: {
//       status,
//     },
//   } as const;
// };
// export const setAppError = (error: string | null) => {
//   return {
//     type: "APP/SET-ERROR",
//     payload: {
//       error,
//     },
//   } as const;
// };

// types
// export type SetAppStatusACType = ReturnType<typeof setAppStatus>;
// export type SetAppErrorACType = ReturnType<typeof setAppError>;
// type ActionsType = SetAppStatusACType | SetAppErrorACType;
type InitialStateType = {
  status: ERequestStatus;
  error: null | string;
};
