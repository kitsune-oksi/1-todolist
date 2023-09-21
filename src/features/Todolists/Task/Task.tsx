import Checkbox from "@mui/material/Checkbox";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { ChangeEvent, FC, useCallback } from "react";
import { deleteTaskTC, updateTaskTC } from "store/tasks-reducer";
import { TaskStatuses, TaskType } from "api/todolist-api";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import { ERequestStatus } from "../../../store/app-reducer";

type TaskProps = {
  task: TaskType;
  todolistId: string;
  todolistEntityStatus: ERequestStatus;
  taskEntityStatus: ERequestStatus;
};

export const Task: FC<TaskProps> = React.memo(({ task, todolistId, todolistEntityStatus, taskEntityStatus }) => {
  const dispatch = useAppDispatch();

  const onChangeCheckboxHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
      let newIsDoneValue = e.currentTarget.checked;
      dispatch(
        updateTaskTC(todolistId, taskId, {
          status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
        }),
      );
    },
    [todolistId],
  );

  const onClickRemoveTaskHandler = useCallback(
    (taskId: string) => {
      dispatch(deleteTaskTC(taskId, todolistId));
    },
    [todolistId],
  );

  return (
    <li key={task.id} className={task.status !== TaskStatuses.New ? "is-done" : ""}>
      <Checkbox
        checked={task.status !== TaskStatuses.New}
        onChange={(e) => onChangeCheckboxHandler(e, task.id)}
        disabled={todolistEntityStatus === "loading" || taskEntityStatus === "loading"}
      />
      <EditableSpan
        value={task.title}
        taskId={task.id}
        todolistId={todolistId}
        disabled={todolistEntityStatus === "loading" || taskEntityStatus === "loading"}
      />
      <IconButton
        aria-label="delete"
        disabled={todolistEntityStatus === "loading" || taskEntityStatus === "loading"}
        onClick={() => onClickRemoveTaskHandler(task.id)}
      >
        <DeleteIcon />
      </IconButton>
    </li>
  );
});
