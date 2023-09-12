import { todolistReducer } from "store/todolist-reducer";
import { taskReducer } from "./tasks-reducer";
import { AnyAction, combineReducers } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "./auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;

const rootReducer = combineReducers({
  todolist: todolistReducer,
  tasks: taskReducer,
  app: appReducer,
  login: authReducer,
});

// export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});
