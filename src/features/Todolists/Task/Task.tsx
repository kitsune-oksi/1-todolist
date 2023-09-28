import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { ChangeEvent, FC, useCallback } from "react";
import { taskThunks } from "store/tasks-reducer";
import { ERequestStatus, ETaskStatuses } from "common/enums";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import { EditableSpan } from "common/components";
import { TaskType } from "common/api/commonTypes";

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
        taskThunks.updateTask({
          todolistId,
          taskId,
          newData: {
            status: newIsDoneValue ? ETaskStatuses.Completed : ETaskStatuses.New,
          },
        }),
      );
    },
    [todolistId],
  );

  const onClickRemoveTaskHandler = useCallback(
    (taskId: string) => {
      dispatch(taskThunks.removeTask({ taskId, todolistId }));
    },
    [todolistId],
  );

  return (
    <li key={task.id} className={task.status !== ETaskStatuses.New ? "is-done" : ""}>
      <Checkbox
        checked={task.status !== ETaskStatuses.New}
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
