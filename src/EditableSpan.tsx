import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string)=> void
}

export const EditableSpan = (props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.value);

    const activateEditMode = () => {
        setEditMode(!editMode)
        props.onChange(title)
    }

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }

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
}