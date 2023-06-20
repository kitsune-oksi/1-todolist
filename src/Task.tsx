import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {ChangeEvent, useCallback} from "react";
import {TaskType} from "./state/tasks-reducer";

type TaskProps = {
    tasksForToDoList: Array<TaskType>
    changeTaskTitle: (newValue: string, taskId: string, todoListId: string) => void
    onChangeCheckboxHandler: ((e: ChangeEvent<HTMLInputElement>, taskId: string) => void)
    onClickRemoveTaskHandler: ((taskId: string) => void)
    todolistId: string
}

export const Task = (props: TaskProps) => {
    let {tasksForToDoList, changeTaskTitle, onChangeCheckboxHandler, onClickRemoveTaskHandler, todolistId} = props;
    return <>
        {tasksForToDoList.map((task) => {
            const {id, isDone, title} = task;
            const changeTitleTaskCallback = useCallback((newValue: string) => {
                changeTaskTitle(newValue, id, todolistId)
            }, [id, todolistId])
            return (
                <li key={id} className={isDone ? 'is-done' : ''}>
                    <Checkbox
                        checked={isDone}
                        onChange={(e) => onChangeCheckboxHandler(e, id)}
                    />
                    <EditableSpan value={title} onChange={changeTitleTaskCallback}/>
                    <IconButton aria-label="delete" onClick={() => onClickRemoveTaskHandler(id)}>
                        <DeleteIcon/>
                    </IconButton>
                </li>
            )
        })}
    </>

}
