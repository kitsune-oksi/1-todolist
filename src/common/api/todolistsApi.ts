import { instance } from "./common.api";
import { NewDataType } from "../../store/tasks-reducer";
import { ETaskPriorities, ETaskStatuses } from "../enums/enums";
import { ERequestStatus } from "../../store/app-reducer";
import { ResponseType } from "./common.api";

export const todolistAPI = {
  updateTodolist(todolistId: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`, { title: title });
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`);
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title: title });
  },
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  updateTask(todolistId: string, taskId: string, model: TaskModelType & NewDataType) {
    return instance.put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(todolistId: string, titleNewTask: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, {
      title: titleNewTask,
    });
  },
  getTasks(todolistId: string) {
    return instance.get<ResponseTasks>(`/todo-lists/${todolistId}/tasks`);
  },
};

//types
export type TodolistType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
type ResponseTasks = {
  items: TaskType[];
  totalCount: number;
  error: null | string;
};
export type TaskType = {
  description: string;
  title: string;
  status: ETaskStatuses;
  priority: ETaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
  entityStatus: ERequestStatus;
};
export type TaskModelType = {
  title: string;
  description: string;
  status: ETaskStatuses;
  priority: ETaskPriorities;
  startDate: string;
  deadline: string;
};
