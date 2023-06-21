import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    const addItem = () => {
        const newTitle = title.trim()
        if (newTitle) {
            props.addItem(title)
            setTitle('')
        } else {
            setError('Title is required!')
        }
    }

    const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.currentTarget.value);

    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addItem()
        }
        if (error) {
            setError(null);
        }
    }

    return (
        <div>
            <TextField variant={"standard"}
                       value={title}
                       onChange={onChangeInputHandler}
                       onKeyDown={onKeyPressHandler}
                       error={!!error}
                       label={'Title'}
                       helperText={error}
            />
            <IconButton color="primary" aria-label="add a task" onClick={addItem}>
                <AddBoxIcon/>
            </IconButton>
        </div>
    )
})