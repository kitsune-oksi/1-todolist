import { useSelector } from "react-redux";
import { AppRootStateType } from "store/store";
import { addTodolistTC, fetchTodolistsThunk, TodolistDomainType } from "store/todolist-reducer";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import React, { useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";

export const TodolistsList: React.FC = () => {
  const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolist);
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.login.isLoggedIn);
  const dispatch = useAppDispatch();

  const addTodoList = useCallback((title: string) => {
    dispatch(addTodolistTC(title));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(fetchTodolistsThunk);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodoList} />
      </Grid>
      <Grid container spacing={3}>
        {todoLists.map((todoList) => {
          return (
            <Grid item key={todoList.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  id={todoList.id}
                  title={todoList.title}
                  filter={todoList.filter}
                  todolistEntityStatus={todoList.entityStatus}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
