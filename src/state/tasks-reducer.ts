import {v1} from "uuid";
import {TaskStatuses, TaskType} from "../api/todolist-api";
import {AddTodoListACType, RemoveTodoListACType} from "./todolists-reducer";

export type TasksStateType = {
    [key: string]: TaskType[]
}

type ActionType = RemoveTaskACType | AddTaskACType | ChangeTaskStatusACType | ChangeTaskTitleACType | AddTodoListACType | RemoveTodoListACType;

type RemoveTaskACType = ReturnType<typeof removeTaskAC>;

type AddTaskACType = ReturnType<typeof addTaskAC>;

type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>;

type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>;


export const todoListId1 = v1();
export const todoListId2 = v1();

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId].filter(el => el.id !== action.payload.taskId)
            }
        case 'ADD-TASK':
            const newTask: TaskType = {id: v1(), title: action.payload.title, status: TaskStatuses.New, description: '', todoListId: action.payload.todoListId, startDate: '', deadline: '', addedDate: '', priority: 0, order: 0};
            return {...state, [action.payload.todoListId]: [newTask, ...state[action.payload.todoListId]]}
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId].map(el => el.id === action.payload.taskId ? {
                    ...el,
                    status: action.payload.status
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

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todoListId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            taskId,
            status,
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





