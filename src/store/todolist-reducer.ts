import { EFilterValue, ERequestStatus, EResultCode } from "common/enums";
import { appActions } from "store/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { todolistAPI } from "common/api";
import { taskThunks } from "store/tasks-reducer";
import { Todolist } from "common/api";
import { thunkTryCatch } from "common/utils";

export type TodolistInitialState = Todolist & {
  filter: EFilterValue;
  entityStatus: ERequestStatus;
};

const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistInitialState[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ todoListId: string; newFilter: EFilterValue }>) => {
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
            filter: EFilterValue.All,
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
          filter: EFilterValue.All,
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
const setTodolists = createAppAsyncThunk<Array<Todolist>>("todolists/setTodolists", async (_, thunkAPI) => {
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
const addTodolist = createAppAsyncThunk<Todolist, string>(
  "todolists/addTodolist",
  async (newTodolistTitle, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
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
    });
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
