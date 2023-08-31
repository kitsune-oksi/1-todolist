import React, {ChangeEvent, useCallback, useState} from 'react';
import TextField from '@mui/material/TextField';
import {changeTodolistTitleTC} from "../../store/todolists-reducer";
import {updateTaskTC} from "../../store/tasks-reducer";
import {useAppDispatch} from "../../store/store.hooks/store.hooks";

type EditableSpanPropsType = {
    value: string
    taskId?: string
    todolistId: string
    disabled: boolean
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.value);

    const dispatch = useAppDispatch();

    const activateEditMode = useCallback(() => {
        if (!props.disabled) {
            setEditMode(!editMode)
            if (editMode) {
                if (props.taskId) {
                    dispatch(updateTaskTC(props.todolistId, props.taskId, {title}))
                    console.log('=====>title', title);
                } else {
                    dispatch(changeTodolistTitleTC(title, props.todolistId))
                }
            }
        }
    }, [props.taskId, props.todolistId, editMode, title, props.disabled])

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