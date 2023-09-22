import { EResultCode, ETaskPriorities, ETaskStatuses } from "common/enums/enums";
import { appActions, ERequestStatus } from "./app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistActions } from "store/todolist-reducer";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { TaskModelType, TaskType, todolistAPI } from "common/api/todolistsApi";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    changeTaskEntityStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; status: ERequestStatus }>,
    ) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        tasks[index].entityStatus = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistActions.addTodolist, (state, action) => {
        state[action.payload.newTodolist.id] = [];
      })
      .addCase(todolistActions.removeTodolist, (state, action) => {
        delete state[action.payload.todoListId];
      })
      .addCase(todolistActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(todolistActions.clearTodolistsData, () => {
        return {};
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoListId];
        tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model };
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks.splice(index, 1);
        }
      });
  },
});

//thunks

//Типизация санки
// 1. То, что возвращает Thunk
// 2. ThunkArg - аргументы санки (тип, который санка принимает)
// 3. AsyncThunkConfig. Какие есть поля смотрим в доке.
// rejectValue - Используем для типизации возвращаемой ошибки
// state - используем для типизации App. Когда используем getState
export const fetchTasks = createAppAsyncThunk<{ todolistId: string; tasks: TaskType[] }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
      const res = await todolistAPI.getTasks(todolistId);
      dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      return { todolistId, tasks: res.data.items };
    } catch (e: any) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
export const addTask = createAppAsyncThunk<TaskType, { todolistId: string; titleNewTask: string }>(
  "tasks/addTask",
  async (param: { todolistId: string; titleNewTask: string }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
      const res = await todolistAPI.createTask(param.todolistId, param.titleNewTask);
      dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      const { description, title, status, priority, startDate, deadline, id, todoListId, order, addedDate } =
        res.data.data.item;
      const task: TaskType = {
        description,
        title,
        status,
        priority,
        startDate,
        deadline,
        id,
        todoListId,
        order,
        addedDate,
        entityStatus: ERequestStatus.succeeded,
      };
      return task;
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
export const updateTask = createAppAsyncThunk<
  { todolistId: string; taskId: string; model: TaskModelType },
  { todolistId: string; taskId: string; newData: NewDataType }
>("tasks/updateTask", async (param: { todolistId: string; taskId: string; newData: NewDataType }, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  try {
    const tasks = getState().tasks;
    const task = tasks[param.todolistId].find((t) => t.id === param.taskId);
    if (!task) {
      dispatch(appActions.setAppError({ error: "Task not found" }));
      return rejectWithValue(null);
    }
    const model: TaskModelType = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...param.newData,
    };
    dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
    dispatch(
      taskActions.changeTaskEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        status: ERequestStatus.loading,
      }),
    );
    const res = await todolistAPI.updateTask(param.todolistId, param.taskId, model);
    const { title, description, status, priority, startDate, deadline } = res.data.data.item;
    if (res.data.resultCode === EResultCode.success) {
      dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      dispatch(
        taskActions.changeTaskEntityStatus({
          todolistId: param.todolistId,
          taskId: param.taskId,
          status: ERequestStatus.succeeded,
        }),
      );
      return {
        todolistId: param.todolistId,
        taskId: param.taskId,
        model: {
          title,
          description,
          status,
          priority,
          startDate,
          deadline,
        },
      };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});
export const removeTask = createAppAsyncThunk<
  { taskId: string; todolistId: string },
  { taskId: string; todolistId: string }
>("tasks/removeTask", async (param: { taskId: string; todolistId: string }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
    dispatch(
      taskActions.changeTaskEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        status: ERequestStatus.loading,
      }),
    );
    await todolistAPI.deleteTask(param.todolistId, param.taskId);
    dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
    dispatch(
      taskActions.changeTaskEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        status: ERequestStatus.succeeded,
      }),
    );
    return { taskId: param.taskId, todolistId: param.todolistId };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export const taskReducer = slice.reducer;
export const taskActions = slice.actions;
export const taskThunks = { fetchTasks, addTask, updateTask, removeTask };

// types
export type TasksStateType = {
  [key: string]: TaskType[];
};
export type NewDataType = {
  title?: string;
  description?: string;
  status?: ETaskStatuses;
  priority?: ETaskPriorities;
  startDate?: string;
  deadline?: string;
};
