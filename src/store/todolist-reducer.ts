import { todolistAPI, TodolistType } from "api/todolist-api";
import { appActions, RequestStatusType } from "./app-reducer";
import { AppDispatch } from "./store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { fetchTasksTC } from "./tasks-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todolist",
  initialState: initialState,
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ todoListId: string }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todoListId);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    addTodolist: (state, action: PayloadAction<{ newTodolist: TodolistType }>) => {
      state.unshift({
        ...action.payload.newTodolist,
        filter: "All",
        entityStatus: "idle",
      });
    },
    changeTodolistTitle: (state, action: PayloadAction<{ todoListId: string; newTodolistTitle: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todoListId);
      if (index !== -1) {
        state[index].title = action.payload.newTodolistTitle;
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{ todoListId: string; newFilter: FilterValueType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todoListId);
      if (index !== -1) {
        state[index].filter = action.payload.newFilter;
      }
    },
    setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
      // action.payload.todolists.forEach((tl) =>
      //   state.push({
      //     ...tl,
      //     filter: "All",
      //     entityStatus: "idle",
      //   }),
      // );
      return action.payload.todolists.map((tl) => ({ ...tl, filter: "All", entityStatus: "idle" }));
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ todoListId: string; status: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todoListId);
      if (index !== -1) {
        state[index].entityStatus = action.payload.status;
      }
    },
    clearTodolistsData: () => {
      return [];
    },
  },
});

export const todolistReducer = slice.reducer;

export const todolistActions = slice.actions;

// export const todolistReducer = (
//   state: Array<TodolistDomainType> = initialState,
//   action: ActionType,
// ): Array<TodolistDomainType> => {
//   switch (action.type) {
//     case "REMOVE-TODOLIST":
//       return state.filter((tl) => tl.id !== action.payload.todoListId);
//     case "ADD-TODOLIST":
//       return [
//         {
//           ...action.payload.todolist,
//           filter: "All",
//           entityStatus: "succeeded",
//         },
//         ...state,
//       ];
//     case "CHANGE-TODOLIST-TITLE":
//       return state.map((el) =>
//         el.id === action.payload.todoListId
//           ? {
//               ...el,
//               title: action.payload.newTodolistTitle,
//             }
//           : el,
//       );
//     case "CHANGE-TODOLIST-FILTER":
//       return state.map((el) =>
//         el.id === action.payload.todoListId ? { ...el, filter: action.payload.newFilter } : el,
//       );
//     case "SET-TODOLIST":
//       return action.payload.todolist.map((tl) => ({
//         ...tl,
//         filter: "All",
//         entityStatus: "succeeded",
//       }));
//     case "CHANGE-TODOLIST-ENTITY-STATUS":
//       return state.map((el) => (el.id === action.payload.id ? { ...el, entityStatus: action.payload.status } : el));
//     case "CLEAR-DATA":
//       return [];
//     default:
//       return state;
//   }
// };

//actions
// export const removeTodolist = (todoListId: string) => {
//   return {
//     type: "REMOVE-TODOLIST",
//     payload: {
//       todoListId,
//     },
//   } as const;
// };
// export const addTodolist = (todolist: TodolistType) => {
//   return {
//     type: "ADD-TODOLIST",
//     payload: {
//       todolist,
//     },
//   } as const;
// };
// export const changeTodolistTitle = (newTodolistTitle: string, todoListId: string) => {
//   return {
//     type: "CHANGE-TODOLIST-TITLE",
//     payload: {
//       newTodolistTitle,
//       todoListId,
//     },
//   } as const;
// };
// export const changeTodolistFilter = (newFilter: FilterValueType, todoListId: string) => {
//   return {
//     type: "CHANGE-TODOLIST-FILTER",
//     payload: {
//       newFilter,
//       todoListId,
//     },
//   } as const;
// };
// export const setTodolists = (todolists: Array<TodolistType>) => {
//   return {
//     type: "SET-TODOLIST",
//     payload: {
//       todolists: todolist,
//     },
//   } as const;
// };
// export const changeTodolistEntityStatus = (id: string, status: RequestStatusType) => {
//   return {
//     type: "CHANGE-TODOLIST-ENTITY-STATUS",
//     payload: {
//       id,
//       status,
//     },
//   } as const;
// };
// export const clearTodolistsData = () => {
//   return {
//     type: "CLEAR-DATA",
//   } as const;
// };

//thunks
export const fetchTodolistsThunk = (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  todolistAPI
    .getTodolists()
    .then((res) => {
      dispatch(todolistActions.setTodolists({ todolists: res.data }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return res.data;
    })
    .then((todos) => {
      todos.forEach((tl) => {
        dispatch(fetchTasksTC(tl.id));
      });
    })
    .catch((error) => handleServerNetworkError(error, dispatch));
};
export const changeTodolistTitleTC = (newTodolistTitle: string, todoListId: string) => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  dispatch(todolistActions.changeTodolistEntityStatus({ todoListId, status: "loading" }));
  todolistAPI
    .updateTodolist(todoListId, newTodolistTitle)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(todolistActions.changeTodolistTitle({ newTodolistTitle, todoListId }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(todolistActions.changeTodolistEntityStatus({ todoListId, status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(todolistActions.changeTodolistEntityStatus({ todoListId, status: "failed" }));
      }
    })
    .catch((error) => handleServerNetworkError(error, dispatch));
};
export const removeTodolistTC = (todoListId: string) => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  dispatch(todolistActions.changeTodolistEntityStatus({ todoListId, status: "loading" }));
  todolistAPI
    .deleteTodolist(todoListId)
    .then(() => {
      dispatch(todolistActions.removeTodolist({ todoListId }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    })
    .catch((error) => handleServerNetworkError(error, dispatch));
};
export const addTodolistTC = (newTodolistTitle: string) => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  todolistAPI
    .createTodolist(newTodolistTitle)
    .then((res) => {
      if (res.data.resultCode === 0) {
        const { id, title, order, addedDate } = res.data.data.item;
        dispatch(todolistActions.addTodolist({ newTodolist: { id, title, order, addedDate } }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => handleServerNetworkError(error, dispatch));
};

//types
// type ActionType =
//     | RemoveTodoListACType
//     | AddTodoListACType
//     | ReturnType<typeof changeTodolistTitle>
//     | ReturnType<typeof changeTodolistFilter>
//     | SetTodolistsACType
//     | ReturnType<typeof changeTodolistEntityStatus>
//     | ClearTodosDataType;
//
// export type AddTodoListACType = ReturnType<typeof addTodolist>;
//
// export type RemoveTodoListACType = ReturnType<typeof removeTodolist>;
//
// export type SetTodolistsACType = ReturnType<typeof setTodolists>;
//
// export type ClearTodosDataType = ReturnType<typeof clearTodolistsData>;
export type FilterValueType = "All" | "Active" | "Completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
