import { ERequestStatus, EResultCode, ETaskPriorities, ETaskStatuses } from "common/enums";

export type Todolist = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
export type ResponseGetTasks = {
  items: Task[];
  totalCount: number;
  error: null | string;
};
export type Task = {
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
export type TaskModel = Pick<Task, "title" | "description" | "status" | "priority" | "startDate" | "deadline">;
export type BaseResponse<D = {}> = {
  resultCode: EResultCode;
  messages: string[];
  data: D;
  fieldsErrors: FieldError[];
};
export type FieldError = {
  error: string;
  field: string;
};
export type LoginData = {
  email: string;
  password: string;
  rememberMe: boolean;
};
