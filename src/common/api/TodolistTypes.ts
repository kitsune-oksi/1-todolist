import { ERequestStatus, ETaskPriorities, ETaskStatuses } from "common/enums";

export type TodolistType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
export type ResponseTasks = {
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
