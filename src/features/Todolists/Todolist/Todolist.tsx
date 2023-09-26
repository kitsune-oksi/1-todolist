import React, { useCallback } from "react";
import "App/App.css";
import Button, { ButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { todolistActions, todolistThunks } from "store/todolist-reducer";
import { Task } from "features/Todolists/Task/Task";
import { useSelector } from "react-redux";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import { selectTask } from "features/Todolists/Task/taskSelector";
import { taskThunks } from "store/tasks-reducer";
import { AddItemForm, EditableSpan } from "common/components";
import { EFilterValueType, ERequestStatus, ETaskStatuses } from "common/enums";

type PropsType = {
  id: string;
  title: string;
  filter: EFilterValueType;
  todolistEntityStatus: ERequestStatus;
};

export const Todolist: React.FC<PropsType> = React.memo(({ id, title, filter, todolistEntityStatus }) => {
  let tasks = useSelector(selectTask(id));
  const dispatch = useAppDispatch();

  if (filter === EFilterValueType.Active) {
    tasks = tasks.filter((task) => task.status !== ETaskStatuses.New);
  } else if (filter === EFilterValueType.Completed) {
    tasks = tasks.filter((task) => task.status === ETaskStatuses.New);
  }

  const onClickFilterHandler = useCallback(
    (nameButton: EFilterValueType) => {
      dispatch(todolistActions.changeTodolistFilter({ todoListId: id, newFilter: nameButton }));
    },
    [id],
  );

  const removeTodoListHandler = useCallback((id: string) => {
    dispatch(todolistThunks.removeTodolist(id));
  }, []);

  const addTaskHandler = useCallback(
    (title: string) => {
      dispatch(taskThunks.addTask({ todolistId: id, titleNewTask: title }));
    },
    [id, title],
  );

  return (
    <div>
      <h3>
        <EditableSpan value={title} todolistId={id} disabled={todolistEntityStatus === "loading"} />
        <IconButton
          aria-label="delete"
          onClick={() => removeTodoListHandler(id)}
          disabled={todolistEntityStatus === "loading"}
        >
          <DeleteIcon />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={todolistEntityStatus === "loading"} />
      <ul style={{ listStyleType: "none" }}>
        {tasks.map((task) => {
          return (
            <Task
              key={task.id}
              task={task}
              todolistId={id}
              todolistEntityStatus={todolistEntityStatus}
              taskEntityStatus={task.entityStatus}
            />
          );
        })}
      </ul>
      <div>
        <ButtonWithMemo
          onClick={useCallback(() => onClickFilterHandler(EFilterValueType.All), [])}
          variant={filter === EFilterValueType.All ? "outlined" : "text"}
          color={"inherit"}
          title={EFilterValueType.All}
        />
        <ButtonWithMemo
          onClick={useCallback(() => onClickFilterHandler(EFilterValueType.Active), [])}
          variant={filter === EFilterValueType.Active ? "outlined" : "text"}
          color={"primary"}
          title={EFilterValueType.Active}
        />
        <ButtonWithMemo
          onClick={useCallback(() => onClickFilterHandler(EFilterValueType.Completed), [])}
          variant={filter === EFilterValueType.Completed ? "outlined" : "text"}
          color={"secondary"}
          title={EFilterValueType.Completed}
        />
      </div>
    </div>
  );
});

const ButtonWithMemo: React.FC<ButtonProps> = React.memo(({ onClick, variant, color, title }) => {
  return (
    <Button onClick={onClick} variant={variant} color={color}>
      {title}
    </Button>
  );
});
