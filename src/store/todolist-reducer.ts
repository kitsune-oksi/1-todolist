import { EFilterValueType, ERequestStatus, EResultCode } from "common/enums/enums";
import { appActions } from "./app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { todolistAPI, TodolistType } from "common/api/todolistsApi";
import { taskThunks } from "./tasks-reducer";

const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ todoListId: string; newFilter: EFilterValueType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todoListId);
      if (index !== -1) {
        state[index].filter = action.payload.newFilter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ todoListId: string; status: ERequestStatus }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todoListId);
      if (index !== -1) {
        state[index].entityStatus = action.payload.status;
      }
    },
    clearTodolistsData: () => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setTodolists.fulfilled, (state, action) => {
        action.payload.forEach((tl) =>
          state.push({
            ...tl,
            filter: EFilterValueType.All,
            entityStatus: ERequestStatus.idle,
          }),
        );
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload);
        if (index !== -1) {
          state.splice(index, 1);
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload,
          filter: EFilterValueType.All,
          entityStatus: ERequestStatus.idle,
        });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todoListId);
        if (index !== -1) {
          state[index].title = action.payload.newTodolistTitle;
        }
      });
  },
});

//thunks
const setTodolists = createAppAsyncThunk<Array<TodolistType>>("todolists/setTodolists", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
    const res = await todolistAPI.getTodolists();
    dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
    res.data.forEach((tl) => {
      dispatch(taskThunks.setTasks(tl.id));
    });
    return res.data;
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});
const removeTodolist = createAppAsyncThunk<string, string>(
  "todolists/removeTodolist",
  async (todoListId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
      dispatch(todolistActions.changeTodolistEntityStatus({ todoListId, status: ERequestStatus.loading }));
      await todolistAPI.deleteTodolist(todoListId);
      dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      return todoListId;
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
const addTodolist = createAppAsyncThunk<TodolistType, string>(
  "todolists/addTodolist",
  async (newTodolistTitle, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
      const res = await todolistAPI.createTodolist(newTodolistTitle);
      if (res.data.resultCode === EResultCode.success) {
        const { id, title, order, addedDate } = res.data.data.item;
        dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
        return { id, title, order, addedDate };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
const changeTodolistTitle = createAppAsyncThunk<
  { newTodolistTitle: string; todoListId: string },
  { newTodolistTitle: string; todoListId: string }
>("todolists/changeTodolistTitle", async (param: { newTodolistTitle: string; todoListId: string }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: ERequestStatus.loading }));
    dispatch(
      todolistActions.changeTodolistEntityStatus({
        todoListId: param.todoListId,
        status: ERequestStatus.succeeded,
      }),
    );
    const res = await todolistAPI.updateTodolist(param.todoListId, param.newTodolistTitle);
    if (res.data.resultCode === EResultCode.success) {
      dispatch(appActions.setAppStatus({ status: ERequestStatus.succeeded }));
      dispatch(
        todolistActions.changeTodolistEntityStatus({
          todoListId: param.todoListId,
          status: ERequestStatus.succeeded,
        }),
      );
      return { newTodolistTitle: param.newTodolistTitle, todoListId: param.todoListId };
    } else {
      handleServerAppError(res.data, dispatch);
      dispatch(
        todolistActions.changeTodolistEntityStatus({
          todoListId: param.todoListId,
          status: ERequestStatus.failed,
        }),
      );
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export const todolistReducer = slice.reducer;
export const todolistActions = slice.actions;
export const todolistThunks = { setTodolists, removeTodolist, addTodolist, changeTodolistTitle };

//types
export type TodolistDomainType = TodolistType & {
  filter: EFilterValueType;
  entityStatus: ERequestStatus;
};