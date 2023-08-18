import {todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk, {ThunkDispatch} from "redux-thunk";

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;


const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

// @ts-ignore
window.store = store;

