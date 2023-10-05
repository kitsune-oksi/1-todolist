import { instance } from "common/api/commonApi";
import { BaseResponse, ResponseGetTasks, TaskModel, Task, Todolist } from "common/api";

export const todolistAPI = {
  updateTodolist(todolistId: string, title: string) {
    return instance.put<BaseResponse>(`todo-lists/${todolistId}`, { title: title });
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}`);
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title: title });
  },
  getTodolists() {
    return instance.get<Todolist[]>("todo-lists");
  },
  updateTask(todolistId: string, taskId: string, model: TaskModel) {
    return instance.put<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(todolistId: string, titleNewTask: string) {
    return instance.post<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks`, {
      title: titleNewTask,
    });
  },
  getTasks(todolistId: string) {
    return instance.get<ResponseGetTasks>(`/todo-lists/${todolistId}/tasks`);
  },
};
