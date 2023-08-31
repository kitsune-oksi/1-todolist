import {todolistAPI, TodolistType} from "../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "../App/app-reducer";
import {AppDispatch} from "./store";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type FilterValueType = 'All' | 'Active' | 'Completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}

type ActionType =
    RemoveTodoListACType |
    AddTodoListACType |
    ReturnType<typeof changeTodoListTitleAC> |
    ReturnType<typeof changeTodoListFilterAC> |
    SetTodolistsACType |
    ReturnType<typeof changeTodolistEntityStatusAC>;

export type AddTodoListACType = ReturnType<typeof addTodoListAC>;

export type RemoveTodoListACType = ReturnType<typeof removeTodoListAC>;

export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>;


const initialState: TodolistDomainType[] = []


export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.todoListId)
        case 'ADD-TODOLIST':
            return [{
                ...action.payload.todolist, filter: "All", entityStatus: 'succeeded'
            }, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.payload.todoListId ? {
                ...el,
                title: action.payload.newTodolistTitle
            } : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.payload.todoListId ? {...el, filter: action.payload.newFilter} : el)
        case 'SET-TODOLIST':
            return action.payload.todolists.map(tl => ({...tl, filter: 'All', entityStatus: 'succeeded'}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(el => el.id === action.payload.id ? {...el, entityStatus: action.payload.status} : el)
        default:
            return state
    }
}

//actions
export const removeTodoListAC = (todoListId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            todoListId
        }
    } as const
}
export const addTodoListAC = (todolist: TodolistType) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            todolist
        }
    } as const
}
export const changeTodoListTitleAC = (newTodolistTitle: string, todoListId: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            newTodolistTitle,
            todoListId
        }
    } as const
}
export const changeTodoListFilterAC = (newFilter: FilterValueType, todoListId: string) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            newFilter,
            todoListId
        }
    } as const
}
export const setTodolistsAC = (todolists: Array<TodolistType>) => {
    return {
        type: 'SET-TODOLIST',
        payload: {
            todolists
        }
    } as const
}
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => {
    return {
        type: 'CHANGE-TODOLIST-ENTITY-STATUS',
        payload: {
            id,
            status
        }
    } as const
}

//thunks
export const fetchTodolistsThunk = (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC('loading'));
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data));
            dispatch(setAppStatusAC('idle'));
        })
        .catch((error) => handleServerNetworkError(error, dispatch))
}
export const changeTodolistTitleTC = (newTodolistTitle: string, todoListId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTodolistEntityStatusAC(todoListId, 'loading'))
    todolistAPI.updateTodolist(todoListId, newTodolistTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodoListTitleAC(newTodolistTitle, todoListId));
                dispatch(setAppStatusAC('idle'));
                dispatch(changeTodolistEntityStatusAC(todoListId, 'succeeded'))
            }
            else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTodolistEntityStatusAC(todoListId, 'failed'))
            }
        })
        .catch((error) => handleServerNetworkError(error, dispatch));
}
export const removeTodolistTC = (todoListId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTodolistEntityStatusAC(todoListId, 'loading'))
    todolistAPI.deleteTodolist(todoListId)
        .then(() => {
            dispatch(removeTodoListAC(todoListId));
            dispatch(setAppStatusAC('succeeded'));
        })
        .catch((error) => handleServerNetworkError(error, dispatch))
}
export const addTodolistTC = (newTodolistTitle: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC('loading'));
    todolistAPI.createTodolist(newTodolistTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                const {id, title, order, addedDate} = res.data.data.item;
                dispatch(addTodoListAC({
                    id,
                    title,
                    order,
                    addedDate
                }));
                dispatch(setAppStatusAC('idle'));
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => handleServerNetworkError(error, dispatch))
}