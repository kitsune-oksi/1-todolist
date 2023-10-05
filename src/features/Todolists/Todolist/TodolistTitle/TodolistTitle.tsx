import React, { useCallback } from "react";
import { EditableSpan } from "common/components";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ERequestStatus } from "common/enums";
import { todolistThunks } from "store/todolist-reducer";
import { useAppDispatch } from "store/store.hooks";

type Props = {
  id: string;
  title: string;
  todolistEntityStatus: ERequestStatus;
};

export const TodolistTitle: React.FC<Props> = ({ title, id, todolistEntityStatus }) => {
  const dispatch = useAppDispatch();

  const removeTodoListHandler = useCallback((id: string) => {
    dispatch(todolistThunks.removeTodolist(id));
  }, []);

  return (
    <>
      <h3>
        <EditableSpan value={title} todolistId={id} disabled={todolistEntityStatus === ERequestStatus.loading} />
        <IconButton
          aria-label="delete"
          onClick={() => removeTodoListHandler(id)}
          disabled={todolistEntityStatus === ERequestStatus.loading}
        >
          <DeleteIcon />
        </IconButton>
      </h3>
    </>
  );
};
