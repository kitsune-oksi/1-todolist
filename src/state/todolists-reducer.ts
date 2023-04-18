import {FilterValueType, TodoListsType} from "../App"
import {v1} from "uuid";

type ActionType = RemoveTodoListACType |
    AddTodoListACType |
    ChangeTodoListTitleACType |
    ChangeTodoListFilterACType;

type RemoveTodoListACType = ReturnType<typeof removeTodoListAC>;

type AddTodoListACType = ReturnType<typeof addTodoListAC>;

type ChangeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>;

type ChangeTodoListFilterACType = ReturnType<typeof changeTodoListFilterAC>;

export const todolistsReducer = (state: Array<TodoListsType>, action: ActionType): Array<TodoListsType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            // delete tasks[id];
            return state.filter(tl => tl.id !== action.payload.todoListId)
        case 'ADD-TODOLIST':
            const newTodoListId = v1();
            const newTodoList: TodoListsType = {
                id: newTodoListId,
                title: action.payload.newTodolistTitle,
                filter: 'All'
            };
            // setTasks({...tasks, [newTodoListId]: []})
            return [newTodoList, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.payload.todoListId ? {
                ...el,
                title: action.payload.newTodolistTitle
            } : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.payload.todoListId ? {...el, filter: action.payload.newFilter} : el)
        default:
            throw new Error('I don\'t understand this type')
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
            newTodolistTitle
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