import { todolistReducer } from "store/todolist-reducer";
import { taskReducer } from "./tasks-reducer";
import { AnyAction } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "./auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    todolist: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

//types
export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;
