import React, { useCallback } from "react";
import "../../../App/App.css";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import Button, { ButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { addTaskTC } from "store/tasks-reducer";
import { FilterValueType, removeTodolistTC, todolistActions } from "store/todolist-reducer";
import { Task } from "../Task/Task";
import { useSelector } from "react-redux";
import { TaskStatuses } from "api/todolist-api";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import { RequestStatusType } from "store/app-reducer";
import { selectTask } from "features/Todolists/Task/taskSelector";

type PropsType = {
  id: string;
  title: string;
  filter: FilterValueType;
  todolistEntityStatus: RequestStatusType;
};

const ALL = "All";
const ACTIVE = "Active";
const COMPLETED = "Completed";

export const Todolist = React.memo((props: PropsType) => {
  let tasks = useSelector(selectTask(props.id));
  const dispatch = useAppDispatch();

  if (props.filter === ACTIVE) {
    tasks = tasks.filter((task) => task.status !== TaskStatuses.New);
  } else if (props.filter === COMPLETED) {
    tasks = tasks.filter((task) => task.status === TaskStatuses.New);
  }

  const onClickFilterHandler = useCallback(
    (nameButton: FilterValueType) => {
      dispatch(todolistActions.changeTodolistFilter({ todoListId: props.id, newFilter: nameButton }));
    },
    [props.id],
  );

  const removeTodoListHandler = useCallback((id: string) => {
    dispatch(removeTodolistTC(id));
  }, []);

  const addTask = useCallback(
    (title: string) => {
      dispatch(addTaskTC(props.id, title));
    },
    [props.id],
  );

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} todolistId={props.id} disabled={props.todolistEntityStatus === "loading"} />
        <IconButton
          aria-label="delete"
          onClick={() => removeTodoListHandler(props.id)}
          disabled={props.todolistEntityStatus === "loading"}
        >
          <DeleteIcon />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={props.todolistEntityStatus === "loading"} />
      <ul style={{ listStyleType: "none" }}>
        {tasks.map((task) => {
          return (
            <Task
              key={task.id}
              task={task}
              todolistId={props.id}
              todolistEntityStatus={props.todolistEntityStatus}
              taskEntityStatus={task.entityStatus}
            />
          );
        })}
      </ul>
      <div>
        <ButtonWithMemo
          onClick={useCallback(() => onClickFilterHandler(ALL), [])}
          variant={props.filter === ALL ? "outlined" : "text"}
          color={"inherit"}
          title={ALL}
        />
        <ButtonWithMemo
          onClick={useCallback(() => onClickFilterHandler(ACTIVE), [])}
          variant={props.filter === ACTIVE ? "outlined" : "text"}
          color={"primary"}
          title={ACTIVE}
        />
        <ButtonWithMemo
          onClick={useCallback(() => onClickFilterHandler(COMPLETED), [])}
          variant={props.filter === COMPLETED ? "outlined" : "text"}
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
