import React, { useCallback } from "react";
import { useAppDispatch } from "store/store.hooks";
import { taskThunks } from "store/tasks-reducer";
import { AddItemForm } from "common/components";
import { EFilterValue, ERequestStatus } from "common/enums";
import { TodolistTitle } from "features/Todolists/Todolist/TodolistTitle/TodolistTitle";
import { TodolistFilterButtons } from "features/Todolists/Todolist/TodolistFilterButtons/TodolistFilterButtons";
import { Tasks } from "features/Todolists/Todolist/Tasks/Tasks";

type Props = {
  id: string;
  title: string;
  filter: EFilterValue;
  todolistEntityStatus: ERequestStatus;
};

export const Todolist: React.FC<Props> = React.memo(({ id, title, filter, todolistEntityStatus }) => {
  const dispatch = useAppDispatch();

  const addTaskHandler = useCallback(
    (title: string) => {
      return dispatch(taskThunks.addTask({ todolistId: id, titleNewTask: title })).unwrap();
    },
    [id, title],
  );

  return (
    <div>
      <TodolistTitle id={id} todolistEntityStatus={todolistEntityStatus} title={title} />
      <AddItemForm addItem={addTaskHandler} disabled={todolistEntityStatus === ERequestStatus.loading} />
      <Tasks filter={filter} todolistEntityStatus={todolistEntityStatus} id={id} />
      <TodolistFilterButtons id={id} filter={filter} />
    </div>
  );
});
