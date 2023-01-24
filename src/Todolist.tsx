import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {filterValueType} from "./App";

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

    const onAllOnClick = () => props.filerTask('All')
    const onActiveOnClick = () => props.filerTask('Active')
    const onCompletedOnClick = () => props.filerTask('Completed')

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={title}
                       onChange={onChangeHandler}
                       onKeyPress={onKeyPressHandler}
                />
                <button onClick={addTaskHandler}>+</button>
            </div>
            <ul>
                {props.tasks.map((task) => {
                    const onClickHandler = () => props.removeTask(task.id)
                    return (
                        <li key={task.id}>
                            <input type="checkbox" checked={task.isDone}/>
                            <span>{task.title}</span>
                            <button onClick={onClickHandler}>✖️</button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button onClick={onAllOnClick}>All</button>
                <button onClick={onActiveOnClick}>Active</button>
                <button onClick={onCompletedOnClick}>Completed</button>
            </div>
        </div>
    )
}