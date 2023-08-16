import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/todolist-api";
import { AppDispatch } from "./store";

export type FilterValueType = 'All' | 'Active' | 'Completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
}

type ActionType = RemoveTodoListACType |
    AddTodoListACType |
    ChangeTodoListTitleACType |
    ChangeTodoListFilterACType |
    SetTodolistsACType;

export type RemoveTodoListACType = ReturnType<typeof removeTodoListAC>;

export type AddTodoListACType = ReturnType<typeof addTodoListAC>;

type ChangeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>;

type ChangeTodoListFilterACType = ReturnType<typeof changeTodoListFilterAC>;

export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>;


const initialState: TodolistDomainType[] = []


export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.todoListId)
        case 'ADD-TODOLIST':
            const newTodoList: TodolistDomainType = {
                id: action.payload.newTodoListId,
                title: action.payload.newTodolistTitle,
                filter: 'All',
                addedDate: '',
                order: 0
            };
            return [newTodoList, ...state]
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

export const removeTodoListAC = (todoListId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            todoListId
        }
    } as const
}

export const addTodoListAC = (newTodolistTitle: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newTodolistTitle,
            newTodoListId: v1()
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

export const fetchTodolistsThunk = (dispatch: AppDispatch) => {
    todolistAPI.getTodolists()
        .then((res) => dispatch(setTodolistsAC(res.data)))
}