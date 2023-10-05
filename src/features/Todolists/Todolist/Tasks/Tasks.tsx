import React from "react";
import { EFilterValue, ERequestStatus, ETaskStatuses } from "common/enums";
import { Task } from "features/Todolists/Todolist/Tasks/Task/Task";
import { useSelector } from "react-redux";
import { selectTask } from "features/Todolists/selectors/taskSelector";

type Props = {
  id: string;
  filter: EFilterValue;
  todolistEntityStatus: ERequestStatus;
};

export const Tasks: React.FC<Props> = ({ id, filter, todolistEntityStatus }) => {
  let tasks = useSelector(selectTask(id));

  if (filter === EFilterValue.Active) {
    tasks = tasks.filter((task) => task.status !== ETaskStatuses.Completed);
  } else if (filter === EFilterValue.Completed) {
    tasks = tasks.filter((task) => task.status === ETaskStatuses.Completed);
  }

  return (
    <>
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
    </>
  );
};
