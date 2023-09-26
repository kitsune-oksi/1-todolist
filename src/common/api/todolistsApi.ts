import { BaseResponseType, instance } from "common/api/common.api";
import { NewDataType } from "store/tasks-reducer";
import { ResponseTasks, TaskModelType, TaskType, TodolistType } from "common/api/TodolistTypes";

export const todolistAPI = {
  updateTodolist(todolistId: string, title: string) {
    return instance.put<BaseResponseType>(`todo-lists/${todolistId}`, { title: title });
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}`);
  },
  createTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistType }>>("todo-lists", { title: title });
  },
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  updateTask(todolistId: string, taskId: string, model: TaskModelType & NewDataType) {
    return instance.put<BaseResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(todolistId: string, titleNewTask: string) {
    return instance.post<BaseResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, {
      title: titleNewTask,
    });
  },
  getTasks(todolistId: string) {
    return instance.get<ResponseTasks>(`/todo-lists/${todolistId}/tasks`);
  },
};
