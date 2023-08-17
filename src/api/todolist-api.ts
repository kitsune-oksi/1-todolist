import axios from "axios"
import {NewDataType} from "../store/tasks-reducer";

export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

type ResponseTasks = {
    items: TaskType[]
    totalCount: number
    error: null | string
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hight = 2,
    Urgently = 3,
    Later = 4
}

export type TaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}


export const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '1690be4a-0b2f-42a4-9e71-302df103dbfe',
    }
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})


export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(
            `todo-lists/${todolistId}`,
            {title: title}
        )
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(
            `todo-lists/${todolistId}`
        )
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>(
            'todo-lists',
            {title: title}
        )
    },
    getTodolists() {
        return instance.get<TodolistType[]>(
            'todo-lists'
        )
    },
    updateTask(todolistId: string, taskId: string, model: TaskModelType & NewDataType) {
        return instance.put<ResponseType<{item: TaskType}>>(
            `/todo-lists/${todolistId}/tasks/${taskId}`,
            model
        )
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(
            `/todo-lists/${todolistId}/tasks/${taskId}`
        )
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(
            `/todo-lists/${todolistId}/tasks`,
            {title: title}
        )
    },
    getTasks(todolistId: string) {
        return instance.get<ResponseTasks>(
            `/todo-lists/${todolistId}/tasks`
        )
    }
}

