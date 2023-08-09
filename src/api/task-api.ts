import axios from "axios"

type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
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


export const taskAPI = {
    updateTask(todolistId: string, taskId: string, title: string) {
        return instance.put<ResponseType>(
            `/todo-lists/${todolistId}/tasks/${taskId}`,
            {title: title}
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
        return instance.get<TaskType>(
            `/todo-lists/${todolistId}/tasks`
        )
    }
}

