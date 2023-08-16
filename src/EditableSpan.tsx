import React, {ChangeEvent, useCallback, useState} from 'react';
import TextField from '@mui/material/TextField';
import {changeTodoListTitleAC} from "./state/todolists-reducer";
import {updateTaskTC} from "./state/tasks-reducer";
import {useAppDispatch} from "./state/store.hooks/store.hooks";

type EditableSpanPropsType = {
    value: string
    taskId?: string
    todolistId: string
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.value);

    const dispatch = useAppDispatch();

    const activateEditMode = useCallback(() => {
        setEditMode(!editMode)
        if (props.taskId) {
            dispatch(updateTaskTC(props.todolistId, props.taskId, {title}))
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