import {TaskModelType, TaskPriorities, TaskStatuses, TaskType, todolistAPI} from "../api/todolist-api";
import {AppDispatch, AppRootStateType} from "./store";
import {
    AddTodoListACType,
    RemoveTodoListACType,
    SetTodolistsACType
} from "./todolists-reducer";

export type TasksStateType = {
    [key: string]: TaskType[]
}

export type NewDataType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type ActionType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodoListACType
    | RemoveTodoListACType
    | ReturnType<typeof setTasksAC>
    | SetTodolistsACType;


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId].filter(el => el.id !== action.payload.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.taskId ? {
                    ...el,
                    ...action.payload.model
                } : el)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.payload.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            let newState = {...state};
            delete newState[action.payload.todoListId];
            return newState
        case 'SET-TODOLIST':
            let stateCopy = {...state};
            action.payload.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            });
            return stateCopy
        case 'SET-TASKS':
            return {...state, [action.payload.todolistId]: action.payload.tasks};
        default:
            return state
    }
}

//actions
export const removeTaskAC = (taskId: string, todoListId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            taskId,
            todoListId
        }
    } as const
}
export const addTaskAC = (task: TaskType) => {
    return {
        type: 'ADD-TASK',
        payload: {
            task
        }
    } as const
}
export const updateTaskAC = (todolistId: string, taskId: string, model: TaskModelType) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistId,
            taskId,
            model
        }
    } as const
}
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASKS',
        payload: {
            todolistId,
            tasks
        }
    } as const
}

//thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: AppDispatch) => {
    todolistAPI.getTasks(todolistId)
        .then((res) => dispatch(setTasksAC(todolistId, res.data.items)))
}
export const deleteTaskTC = (taskId: string, todolistId: string) => (dispatch: AppDispatch) => {
    todolistAPI.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: AppDispatch) => {
    todolistAPI.createTask(todolistId, title)
        .then((res) => {
            const {
                description,
                title,
                status,
                priority,
                startDate,
                deadline,
                id,
                todoListId,
                order,
                addedDate
            } = res.data.data.item;
            dispatch(addTaskAC({
                description,
                title,
                status,
                priority,
                startDate,
                deadline,
                id,
                todoListId,
                order,
                addedDate
            }))
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, newData: NewDataType) => (dispatch: AppDispatch, getState: () => AppRootStateType) => {
    const tasks = getState().tasks;
    const task = tasks[todolistId].find(t => t.id === taskId);
    if (!task) {
        return console.warn('Task not found in the store')
    }
    const model: TaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...newData
    }
    todolistAPI.updateTask(todolistId, taskId, model)
        .then((res) => {
            const {title, description, status, priority, startDate, deadline} = res.data.data.item;
            dispatch(updateTaskAC(todolistId, taskId, {
                title,
                description,
                status,
                priority,
                startDate,
                deadline
            }))
        })
}




