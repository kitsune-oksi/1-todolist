import { TextField } from "@mui/material";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useAppDispatch } from "store/store.hooks";
import { taskThunks } from "store/tasks-reducer";
import { todolistThunks } from "store/todolist-reducer";

type Props = {
  value: string;
  taskId?: string;
  todolistId: string;
  disabled: boolean;
};

export const EditableSpan: React.FC<Props> = React.memo(({ value, taskId, todolistId, disabled }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(value);

  const dispatch = useAppDispatch();

  const activateEditMode = useCallback(() => {
    if (!disabled) {
      setEditMode(!editMode);
      if (editMode) {
        if (taskId) {
          dispatch(
            taskThunks.updateTask({
              todolistId,
              taskId,
              newData: {
                title,
              },
            }),
          );
        } else {
          dispatch(todolistThunks.changeTodolistTitle({ newTodolistTitle: title, todoListId: todolistId }));
        }
      }
    }
  }, [taskId, todolistId, editMode, title, disabled]);

  const setTitleHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  }, []);

  return (
    <>
      {editMode ? (
        <TextField
          variant="outlined"
          value={title}
          autoFocus
          onBlur={activateEditMode}
          onChange={setTitleHandler}
          size={"small"}
        />
      ) : (
        <span onDoubleClick={activateEditMode}>{title}</span>
      )}
    </>
  );
});
