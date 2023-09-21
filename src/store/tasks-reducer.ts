import { TaskModelType, TaskPriorities, TaskStatuses, TaskType, todolistAPI } from "api/todolist-api";
import { AppDispatch, AppRootStateType } from "./store";
import { appActions, ERequestStatus } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistActions } from "store/todolist-reducer";
import { createAppAsyncThunk } from "../utils/create-app-async-thunk";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        tasks.splice(index, 1);
      }
    },
    updateTask: (state, action: PayloadAction<{ todolistId: string; taskId: string; model: TaskModelType }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
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
// export const _addTaskTC = (todolistId: string, title: string) => (dispatch: AppDispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   todolistAPI
//     .createTask(todolistId, title)
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         const { description, title, status, priority, startDate, deadline, id, todoListId, order, addedDate } =
//           res.data.data.item;
//         dispatch(
//           taskActions.addTask({
//             task: {
//               description,
//               title,
//               status,
//               priority,
//               startDate,
//               deadline,
//               id,
//               todoListId,
//               order,
//               addedDate,
//               entityStatus: "succeeded",
//             },
//           }),
//         );
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch);
//     });
// };
export const deleteTaskTC = (taskId: string, todolistId: string) => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
  dispatch(taskActions.changeTaskEntityStatus({ todolistId, taskId, status: ERequestStatus.loading }));
  todolistAPI
    .deleteTask(todolistId, taskId)
    .then(() => {
      dispatch(taskActions.removeTask({ taskId, todolistId }));
      dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      dispatch(taskActions.changeTaskEntityStatus({ todolistId, taskId, status: ERequestStatus.succeeded }));
    })
    .catch((error) => handleServerNetworkError(error, dispatch));
};
export const updateTaskTC =
  (todolistId: string, taskId: string, newData: NewDataType) =>
  (dispatch: AppDispatch, getState: () => AppRootStateType) => {
    const tasks = getState().tasks;
    const task = tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      return console.warn("Task not found in the store");
    }
    const model: TaskModelType = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...newData,
    };
    dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
    dispatch(taskActions.changeTaskEntityStatus({ todolistId, taskId, status: ERequestStatus.loading }));
    todolistAPI
      .updateTask(todolistId, taskId, model)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const { title, description, status, priority, startDate, deadline } = res.data.data.item;
          dispatch(
            taskActions.updateTask({
              todolistId,
              taskId,
              model: {
                title,
                description,
                status,
                priority,
                startDate,
                deadline,
              },
            }),
          );
          dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
          dispatch(
            taskActions.changeTaskEntityStatus({
              todolistId,
              taskId,
              status: ERequestStatus.succeeded,
            }),
          );
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

export const taskReducer = slice.reducer;
export const taskActions = slice.actions;
export const taskThunks = { fetchTasks, addTask };

// types
export type TasksStateType = {
  [key: string]: TaskType[];
};
export type NewDataType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
