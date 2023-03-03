import React, {ChangeEvent, useState} from 'react';

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string)=> void
}

export const EditableSpan = (props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.value);

    const activateEditMode = () => {
        setEditMode(!editMode)
    }

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
        props.onChange(title)
    }

    return (
        <>
            {editMode ?
                <input value={title} autoFocus onBlur={activateEditMode} onChange={onChangeHandler}/> :
                <span onDoubleClick={activateEditMode}>{title}</span>
            }
        </>

    )
}