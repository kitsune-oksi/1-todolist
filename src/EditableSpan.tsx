import React, {ChangeEvent, useCallback, useState} from 'react';
import TextField from '@mui/material/TextField';
import {changeTaskTitleAC} from "./state/tasks-reducer";
import {useDispatch} from "react-redux";
import {changeTodoListTitleAC} from "./state/todolists-reducer";

type EditableSpanPropsType = {
    value: string
    taskId?: string
    todolistId: string
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.value);

    const dispatch = useDispatch();

    const activateEditMode = useCallback(() => {
        setEditMode(!editMode)
        if (props.taskId) {
            dispatch(changeTaskTitleAC(title, props.taskId, props.todolistId))
        } else {
            dispatch(changeTodoListTitleAC(title, props.todolistId))
        }

    }, [props.taskId, props.todolistId, editMode])

    const onChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }, [])

    return (
        <>
            {editMode ?
                <TextField variant="outlined"
                           value={title}
                           autoFocus
                           onBlur={activateEditMode}
                           onChange={onChangeHandler}
                           size={"small"}
                /> :
                <span onDoubleClick={activateEditMode}>{title}</span>
            }
        </>

    )
})