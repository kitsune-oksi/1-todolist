import { v1 } from "uuid";

export type TodoListsType = {
    id: string
    title: string
    filter: FilterValueType
}

export type FilterValueType = 'All' | 'Active' | 'Completed';

type ActionType = RemoveTodoListACType |
    AddTodoListACType |
    ChangeTodoListTitleACType |
    ChangeTodoListFilterACType;

export type RemoveTodoListACType = ReturnType<typeof removeTodoListAC>;

export type AddTodoListACType = ReturnType<typeof addTodoListAC>;

type ChangeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>;

type ChangeTodoListFilterACType = ReturnType<typeof changeTodoListFilterAC>;


const initialState:TodoListsType[]  = [
    // {id: todoListId1, title: 'What to learn', filter: 'All'},
    // {id: todoListId2, title: 'What to buy', filter: 'Active'}
]


export const todolistsReducer = (state: Array<TodoListsType> = initialState, action: ActionType): Array<TodoListsType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.todoListId)
        case 'ADD-TODOLIST':
            const newTodoList: TodoListsType = {
                id: action.payload.newTodoListId,
                title: action.payload.newTodolistTitle,
                filter: 'All'
            };
            return [newTodoList, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.payload.todoListId ? {
                ...el,
                title: action.payload.newTodolistTitle
            } : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.payload.todoListId ? {...el, filter: action.payload.newFilter} : el)
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