import { todolistReducer } from "store/todolist-reducer";
import { taskReducer } from "./tasks-reducer";
import { AnyAction } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "./auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<AppRootState, unknown, AnyAction>;

export const store = configureStore({
  reducer: {
    todolist: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});
