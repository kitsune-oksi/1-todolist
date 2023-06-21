import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import  {FC,ChangeEvent, useCallback} from "react";
import {changeTaskStatusAC, removeTaskAC, TaskType} from "./state/tasks-reducer";
import {useDispatch,} from "react-redux";

type TaskProps = {
    todolistId: string
    tasks: Array<TaskType>
}

export const Task:FC<TaskProps> = ({todolistId,tasks}) => {
    const dispatch = useDispatch();

    const onChangeCheckboxHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(changeTaskStatusAC(taskId, newIsDoneValue, todolistId))
    }

    const onClickRemoveTaskHandler = useCallback((taskId: string) => {
        dispatch(removeTaskAC(taskId, todolistId))
    }, [])

    return <>
        {tasks.map((task) => {
            const {id, isDone, title} = task;
            return (
                <li key={id} className={isDone ? 'is-done' : ''}>
                    <Checkbox
                        checked={isDone}
                        onChange={(e) => onChangeCheckboxHandler(e, id)}
                    />
                    <EditableSpan value={title} taskId = {id} todolistId ={todolistId}/>
                    <IconButton aria-label="delete" onClick={() => onClickRemoveTaskHandler(id)}>
                        <DeleteIcon/>
                    </IconButton>
                </li>
            )
        })}
    </>

}
