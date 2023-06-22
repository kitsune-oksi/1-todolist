import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {FC, ChangeEvent, useCallback} from "react";
import {changeTaskStatusAC, removeTaskAC, TaskType} from "./state/tasks-reducer";
import {useDispatch,} from "react-redux";

type TaskProps = {
    task: TaskType
    todolistId: string
}

export const Task: FC<TaskProps> = React.memo(({task, todolistId}) => {
    const dispatch = useDispatch();

    const onChangeCheckboxHandler = useCallback((e: ChangeEvent<HTMLInputElement>, taskId: string) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(changeTaskStatusAC(taskId, newIsDoneValue, todolistId))
    }, [todolistId])

    const onClickRemoveTaskHandler = useCallback((taskId: string) => {
        dispatch(removeTaskAC(taskId, todolistId))
    }, [todolistId])

    return <li key={task.id} className={task.isDone ? 'is-done' : ''}>
        <Checkbox
            checked={task.isDone}
            onChange={(e) => onChangeCheckboxHandler(e, task.id)}
        />
        <EditableSpan value={task.title} taskId={task.id} todolistId={todolistId}/>
        <IconButton aria-label="delete" onClick={() => onClickRemoveTaskHandler(task.id)}>
            <DeleteIcon/>
        </IconButton>
    </li>
})
