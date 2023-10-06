import { ERequestStatus, EResultCode } from "common/enums";
import { appActions } from "store/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistActions, todolistThunks } from "store/todolist-reducer";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils";
import { todolistAPI } from "common/api";
import { TaskModel, Task } from "common/api";

export type TaskInitialState = Record<string, Task[]>;
type NewData = Partial<Pick<Task, "title" | "description" | "status" | "priority" | "startDate" | "deadline">>;

const slice = createSlice({
  name: "task",
  initialState: {} as TaskInitialState,
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
      .addCase(todolistThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(todolistThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload];
      })
      .addCase(todolistThunks.setTodolists.fulfilled, (state, action) => {
        action.payload.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(todolistActions.clearTodolistsData, () => {
        return {};
      })
      .addCase(setTasks.fulfilled, (state, action) => {
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
// store - используем для типизации App. Когда используем getState
const setTasks = createAppAsyncThunk<{ todolistId: string; tasks: Task[] }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await todolistAPI.getTasks(todolistId);
      return { todolistId, tasks: res.data.items };
    } catch (e: any) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
const addTask = createAppAsyncThunk<Task, { todolistId: string; titleNewTask: string }>(
  "tasks/addTask",
  async (param: { todolistId: string; titleNewTask: string }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.createTask(param.todolistId, param.titleNewTask);
      if (res.data.resultCode === EResultCode.success) {
        const { description, title, status, priority, startDate, deadline, id, todoListId, order, addedDate } =
          res.data.data.item;
        const task: Task = {
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
      } else {
        handleServerAppError(res.data, dispatch, false);
        return rejectWithValue(res.data);
      }
    });
  },
);
const updateTask = createAppAsyncThunk<
  { todolistId: string; taskId: string; model: TaskModel },
  { todolistId: string; taskId: string; newData: NewData }
>("tasks/updateTask", async (param: { todolistId: string; taskId: string; newData: NewData }, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  try {
    const tasks = getState().tasks;
    const task = tasks[param.todolistId].find((t) => t.id === param.taskId);
    if (!task) {
      dispatch(appActions.setAppError({ error: "Task not found" }));
      return rejectWithValue(null);
    }
    const model: TaskModel = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...param.newData,
    };
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
const removeTask = createAppAsyncThunk<{ taskId: string; todolistId: string }, { taskId: string; todolistId: string }>(
  "tasks/removeTask",
  async (param: { taskId: string; todolistId: string }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(
        taskActions.changeTaskEntityStatus({
          todolistId: param.todolistId,
          taskId: param.taskId,
          status: ERequestStatus.loading,
        }),
      );
      await todolistAPI.deleteTask(param.todolistId, param.taskId);
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
  },
);

export const taskReducer = slice.reducer;
export const taskActions = slice.actions;
export const taskThunks = { setTasks, addTask, updateTask, removeTask };
