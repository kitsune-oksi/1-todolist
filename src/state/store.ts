import {todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";
import {combineReducers, createStore} from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export const store = createStore(rootReducer, composeWithDevTools());

// @ts-ignore
window.store = store;