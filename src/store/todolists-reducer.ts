import {todolistAPI, TodolistType} from "../api/todolist-api";
import {AppDispatch} from "./store";

export type FilterValueType = 'All' | 'Active' | 'Completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
}

type ActionType =
    RemoveTodoListACType |
    AddTodoListACType |
    ReturnType<typeof changeTodoListTitleAC> |
    ReturnType<typeof changeTodoListFilterAC> |
    SetTodolistsACType;

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
                ...action.payload.todolist, filter: "All"
            }, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.payload.todoListId ? {
                ...el,
                title: action.payload.newTodolistTitle
            } : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.payload.todoListId ? {...el, filter: action.payload.newFilter} : el)
        case 'SET-TODOLIST':
            return action.payload.todolists.map(tl => ({...tl, filter: 'All'}))
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

//thunks
export const fetchTodolistsThunk = (dispatch: AppDispatch) => {
    todolistAPI.getTodolists()
        .then((res) => dispatch(setTodolistsAC(res.data)))
}
export const changeTodolistTitleTC = (newTodolistTitle: string, todoListId: string) => (dispatch: AppDispatch) => {
    todolistAPI.updateTodolist(todoListId, newTodolistTitle)
        .then(() => dispatch(changeTodoListTitleAC(newTodolistTitle, todoListId)))
}
export const removeTodolistTC = (todoListId: string) => (dispatch: AppDispatch) => {
    todolistAPI.deleteTodolist(todoListId)
        .then(() => dispatch(removeTodoListAC(todoListId)))
}
export const addTodolistTC = (newTodolistTitle: string) => (dispatch: AppDispatch) => {
    todolistAPI.createTodolist(newTodolistTitle)
        .then((res) => {
            const {id, title, order, addedDate} = res.data.data.item;
            dispatch(addTodoListAC({
                id,
                title,
                order,
                addedDate
            }))
        })
}