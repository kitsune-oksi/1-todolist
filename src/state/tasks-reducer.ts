import {v1} from "uuid";
import {AddTodoListACType, RemoveTodoListACType} from "./todolists-reducer";

export type TasksStateType = {
    [key: string]: TaskType[]
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type ActionType = RemoveTaskACType | AddTaskACType | ChangeTaskStatusACType | ChangeTaskTitleACType | AddTodoListACType | RemoveTodoListACType;

type RemoveTaskACType = ReturnType<typeof removeTaskAC>;

type AddTaskACType = ReturnType<typeof addTaskAC>;

type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>;

type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>;


export const todoListId1 = v1();
export const todoListId2 = v1();

const initialState: TasksStateType = {
    // [todoListId1]: [
    //     {id: v1(), title: 'HTML&CSS', isDone: true},
    //     {id: v1(), title: 'JS', isDone: true},
    //     {id: v1(), title: 'ReactJS', isDone: false}
    // ],
    // [todoListId2]: [
    //     {id: v1(), title: 'Apples', isDone: true},
    //     {id: v1(), title: 'Oranges', isDone: true},
    //     {id: v1(), title: 'Cake', isDone: false}
    // ],
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId].filter(el => el.id !== action.payload.taskId)
            }
        case 'ADD-TASK':
            const newTask = {id: v1(), title: action.payload.title, isDone: false};
            return {...state, [action.payload.todoListId]: [newTask, ...state[action.payload.todoListId]]}
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId].map(el => el.id === action.payload.taskId ? {
                    ...el,
                    isDone: action.payload.isDone
                } : el)
            }
        case 'CHANGE-TASK-TITLE':
            return {...state, [action.payload.todoListId]: state[action.payload.todoListId].map(el => el.id === action.payload.taskId ? {...el, title: action.payload.newValue} : el)}
        case 'ADD-TODOLIST':
            return {...state, [action.payload.newTodoListId]:[]}
        case 'REMOVE-TODOLIST':
            let newState = {...state};
            delete newState[action.payload.todoListId];
            return newState
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todoListId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            taskId,
            todoListId
        }
    } as const
}

export const addTaskAC = (title: string, todoListId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            title,
            todoListId
        }
    } as const
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            taskId,
            isDone,
            todoListId
        }
    } as const
}

export const changeTaskTitleAC = (newValue: string, taskId: string, todoListId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            newValue,
            taskId,
            todoListId
        }
    } as const
}





