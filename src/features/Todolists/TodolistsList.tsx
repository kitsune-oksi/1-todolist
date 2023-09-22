import { useSelector } from "react-redux";
import { todolistThunks } from "store/todolist-reducer";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import React, { useCallback, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "features/Login/loginSelector";
import { selectTodolist } from "features/Todolists/Todolist/todolistSelector";
import { AddItemForm } from "common/components";

export const TodolistsList: React.FC = () => {
  const todoLists = useSelector(selectTodolist);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const refFirstRender = useRef(true);

  const addTodoList = useCallback((title: string) => {
    dispatch(todolistThunks.addTodolist(title));
  }, []);

  useEffect(() => {
    if (isLoggedIn && refFirstRender.current) {
      dispatch(todolistThunks.setTodolists());
      refFirstRender.current = false;
    }
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
