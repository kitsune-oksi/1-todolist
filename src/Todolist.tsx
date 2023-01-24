import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {filterValueType} from "./App";
import {Button} from "./Button";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string) => void
    filerTask: (value: filterValueType) => void
    addTask: (title: string) => void
}

export function Todolist(props: PropsType) {
    const [title, setTitle] = useState('')

    const addTaskHandler = () => {
        props.addTask(title)
        setTitle('')
    }

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.currentTarget.value)

    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addTaskHandler()
        }
    }

    const onClickFilterHandler = (nameButton: filterValueType) => props.filerTask(nameButton)
    const onClickRemoveTaskHandler = (taskId: string) => props.removeTask(taskId)

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={title}
                       onChange={onChangeHandler}
                       onKeyPress={onKeyPressHandler}
                />
                <Button title={'+'} callback={addTaskHandler}/>
            </div>
            <ul>
                {props.tasks.map((task) => {

                    return (
                        <li key={task.id}>
                            <input type="checkbox" checked={task.isDone}/>
                            <span>{task.title}</span>
                            <Button title={'✖️'} callback={()=>onClickRemoveTaskHandler(task.id)}/>
                        </li>
                    )
                })}
            </ul>
            <div>
                <Button title={'All'} callback={()=>onClickFilterHandler('All')}/>
                <Button title={'Active'} callback={()=>onClickFilterHandler('Active')}/>
                <Button title={'Completed'} callback={()=>onClickFilterHandler('Completed')}/>
            </div>
        </div>
    )
}