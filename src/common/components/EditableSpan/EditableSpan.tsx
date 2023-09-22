import React, { ChangeEvent, useCallback, useState } from "react";
import TextField from "@mui/material/TextField";
import { changeTodolistTitleTC } from "store/todolist-reducer";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import { taskThunks } from "../../../store/tasks-reducer";

type EditableSpanPropsType = {
  value: string;
  taskId?: string;
  todolistId: string;
  disabled: boolean;
};

export const EditableSpan: React.FC<EditableSpanPropsType> = React.memo(({ value, taskId, todolistId, disabled }) => {
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
          console.log("=====>title", title);
        } else {
          dispatch(changeTodolistTitleTC(title, todolistId));
        }
      }
    }
  }, [taskId, todolistId, editMode, title, disabled]);

  const onChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
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
          onChange={onChangeHandler}
          size={"small"}
        />
      ) : (
        <span onDoubleClick={activateEditMode}>{title}</span>
      )}
    </>
  );
});
