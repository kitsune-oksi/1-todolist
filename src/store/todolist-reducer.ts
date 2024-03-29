import { EFilterValue, ERequestStatus, EResultCode } from "common/enums";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "common/utils";
import { todolistAPI } from "common/api";
import { taskThunks } from "store/tasks-reducer";
import { Todolist } from "common/api";

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
  const { dispatch } = thunkAPI;
  const res = await todolistAPI.getTodolists();
  res.data.forEach((tl) => {
    dispatch(taskThunks.setTasks(tl.id));
  });
  return res.data;
});
const removeTodolist = createAppAsyncThunk<string, string>(
  "todolists/removeTodolist",
  async (todoListId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(todolistActions.changeTodolistEntityStatus({ todoListId, status: ERequestStatus.loading }));
    const res = await todolistAPI.deleteTodolist(todoListId);
    if (res.data.resultCode === EResultCode.success) {
      return todoListId;
    } else {
      return rejectWithValue(res.data);
    }
  },
);
const addTodolist = createAppAsyncThunk<Todolist, string>(
  "todolists/addTodolist",
  async (newTodolistTitle, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const res = await todolistAPI.createTodolist(newTodolistTitle);
    if (res.data.resultCode === EResultCode.success) {
      const { id, title, order, addedDate } = res.data.data.item;
      return { id, title, order, addedDate };
    } else {
      return rejectWithValue(res.data);
    }
  },
);
const changeTodolistTitle = createAppAsyncThunk<
  { newTodolistTitle: string; todoListId: string },
  { newTodolistTitle: string; todoListId: string }
>("todolists/changeTodolistTitle", async (param: { newTodolistTitle: string; todoListId: string }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(
    todolistActions.changeTodolistEntityStatus({
      todoListId: param.todoListId,
      status: ERequestStatus.succeeded,
    }),
  );
  const res = await todolistAPI.updateTodolist(param.todoListId, param.newTodolistTitle);
  if (res.data.resultCode === EResultCode.success) {
    dispatch(
      todolistActions.changeTodolistEntityStatus({
        todoListId: param.todoListId,
        status: ERequestStatus.succeeded,
      }),
    );
    return { newTodolistTitle: param.newTodolistTitle, todoListId: param.todoListId };
  } else {
    dispatch(
      todolistActions.changeTodolistEntityStatus({
        todoListId: param.todoListId,
        status: ERequestStatus.failed,
      }),
    );
    return rejectWithValue(res.data);
  }
});

export const todolistReducer = slice.reducer;
export const todolistActions = slice.actions;
export const todolistThunks = { setTodolists, removeTodolist, addTodolist, changeTodolistTitle };
