import { TaskModelType, TaskPriorities, TaskStatuses, TaskType, todolistAPI } from "api/todolist-api";
import { AppDispatch, AppRootStateType } from "./store";
import { appActions, RequestStatusType } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistActions } from "store/todolist-reducer";

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
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const tasks = state[action.payload.task.todoListId];
      tasks.unshift(action.payload.task);
    },
    updateTask: (state, action: PayloadAction<{ todolistId: string; taskId: string; model: TaskModelType }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
    setTasks: (state, action: PayloadAction<{ todolistId: string; tasks: TaskType[] }>) => {
      state[action.payload.todolistId] = action.payload.tasks;
    },
    changeTaskEntityStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; status: RequestStatusType }>,
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
      });
  },
});

export const taskReducer = slice.reducer;

export const taskActions = slice.actions;

// export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
//   switch (action.type) {
//     case "REMOVE-TASK":
//       return {
//         ...state,
//         [action.payload.todoListId]: state[action.payload.todoListId].filter((el) => el.id !== action.payload.taskId),
//       };
//     case "ADD-TASK":
//       return {
//         ...state,
//         [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]],
//       };
//     case "UPDATE-TASK":
//       return {
//         ...state,
//         [action.payload.todolistId]: state[action.payload.todolistId].map((el) =>
//           el.id === action.payload.taskId
//             ? {
//                 ...el,
//                 ...action.payload.model,
//               }
//             : el,
//         ),
//       };
//     case "ADD-TODOLIST":
//       return { ...state, [action.payload.todolist.id]: [] };
//     case "REMOVE-TODOLIST":
//       let newState = { ...state };
//       delete newState[action.payload.todoListId];
//       return newState;
//     case "SET-TODOLIST":
//       let stateCopy = { ...state };
//       action.payload.todolist.forEach((tl) => {
//         stateCopy[tl.id] = [];
//       });
//       return stateCopy;
//     case "SET-TASKS":
//       return { ...state, [action.payload.todolistId]: action.payload.tasks };
//     case "CHANGE-TASK-ENTITY-STATUS":
//       return {
//         ...state,
//         [action.payload.todolistId]: state[action.payload.todolistId].map((el) =>
//           el.id === action.payload.taskId ? { ...el, entityStatus: action.payload.status } : el,
//         ),
//       };
//     case "CLEAR-DATA":
//       return {};
//     default:
//       return state;
//   }
// };

//actions
// export const removeTask = (taskId: string, todoListId: string) => {
//   return {
//     type: "REMOVE-TASK",
//     payload: {
//       taskId,
//       todoListId,
//     },
//   } as const;
// };
// export const addTask = (task: TaskType) => {
//   return {
//     type: "ADD-TASK",
//     payload: {
//       task,
//     },
//   } as const;
// };
// export const updateTask = (todolistId: string, taskId: string, model: TaskModelType) => {
//   return {
//     type: "UPDATE-TASK",
//     payload: {
//       todolistId,
//       taskId,
//       model,
//     },
//   } as const;
// };
// export const setTasks = (todolistId: string, tasks: TaskType[]) => {
//   return {
//     type: "SET-TASKS",
//     payload: {
//       todolistId,
//       tasks,
//     },
//   } as const;
// };
// export const changeTaskEntityStatus = (todolistId: string, taskId: string, status: RequestStatusType) => {
//   return {
//     type: "CHANGE-TASK-ENTITY-STATUS",
//     payload: {
//       todolistId,
//       taskId,
//       status,
//     },
//   } as const;
// };

//thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  todolistAPI
    .getTasks(todolistId)
    .then((res) => {
      dispatch(taskActions.setTasks({ todolistId, tasks: res.data.items }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    })
    .catch((error) => handleServerNetworkError(error, dispatch));
};
export const deleteTaskTC = (taskId: string, todolistId: string) => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  dispatch(taskActions.changeTaskEntityStatus({ todolistId, taskId, status: "loading" }));
  todolistAPI
    .deleteTask(todolistId, taskId)
    .then(() => {
      dispatch(taskActions.removeTask({ taskId, todolistId }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(taskActions.changeTaskEntityStatus({ todolistId, taskId, status: "succeeded" }));
    })
    .catch((error) => handleServerNetworkError(error, dispatch));
};
export const addTaskTC = (todolistId: string, title: string) => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  todolistAPI
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        const { description, title, status, priority, startDate, deadline, id, todoListId, order, addedDate } =
          res.data.data.item;
        dispatch(
          taskActions.addTask({
            task: {
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
              entityStatus: "succeeded",
            },
          }),
        );
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
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
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(taskActions.changeTaskEntityStatus({ todolistId, taskId, status: "loading" }));
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
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
          dispatch(taskActions.changeTaskEntityStatus({ todolistId, taskId, status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

// types
// type ActionType =
//   | ReturnType<typeof removeTask>
//   | ReturnType<typeof addTask>
//   | ReturnType<typeof updateTask>
//   | AddTodoListACType
//   | RemoveTodoListACType
//   | ReturnType<typeof setTasks>
//   | SetTodolistsACType
//   | ReturnType<typeof changeTaskEntityStatus>
//   | ClearTodosDataType;
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
