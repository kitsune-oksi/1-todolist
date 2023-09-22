import React, { useCallback } from "react";
import "../../../App/App.css";
import Button, { ButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { FilterValueType, removeTodolistTC, todolistActions } from "store/todolist-reducer";
import { Task } from "../Task/Task";
import { useSelector } from "react-redux";
import { ETaskStatuses } from "common/enums/enums";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import { selectTask } from "features/Todolists/Task/taskSelector";
import { taskThunks } from "../../../store/tasks-reducer";
import { ERequestStatus } from "../../../store/app-reducer";
import { AddItemForm, EditableSpan } from "common/components";

type PropsType = {
  id: string;
  title: string;
  filter: FilterValueType;
  todolistEntityStatus: ERequestStatus;
};

const ALL = "All";
const ACTIVE = "Active";
const COMPLETED = "Completed";

export const Todolist: React.FC<PropsType> = React.memo(({ id, title, filter, todolistEntityStatus }) => {
  let tasks = useSelector(selectTask(id));
  const dispatch = useAppDispatch();

  if (filter === ACTIVE) {
    tasks = tasks.filter((task) => task.status !== ETaskStatuses.New);
  } else if (filter === COMPLETED) {
    tasks = tasks.filter((task) => task.status === ETaskStatuses.New);
  }

  const onClickFilterHandler = useCallback(
    (nameButton: FilterValueType) => {
      dispatch(todolistActions.changeTodolistFilter({ todoListId: id, newFilter: nameButton }));
    },
    [id],
  );

  const removeTodoListHandler = useCallback((id: string) => {
    dispatch(removeTodolistTC(id));
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
          onClick={useCallback(() => onClickFilterHandler(ALL), [])}
          variant={filter === ALL ? "outlined" : "text"}
          color={"inherit"}
          title={ALL}
        />
        <ButtonWithMemo
          onClick={useCallback(() => onClickFilterHandler(ACTIVE), [])}
          variant={filter === ACTIVE ? "outlined" : "text"}
          color={"primary"}
          title={ACTIVE}
        />
        <ButtonWithMemo
          onClick={useCallback(() => onClickFilterHandler(COMPLETED), [])}
          variant={filter === COMPLETED ? "outlined" : "text"}
          color={"secondary"}
          title={COMPLETED}
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
