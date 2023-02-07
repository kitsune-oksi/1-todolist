import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {filterValueType} from "./App";
import {Button} from "./Button";
import './App.css';

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
    changeTaskStatus: (id: string, isDone: boolean) => void
    filter: filterValueType
}

export function Todolist(props: PropsType) {
    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const addTaskHandler = () => {
        const newTitle = title.trim()
        if (newTitle) {
            props.addTask(title)
            setTitle('')
        } else {
            setError('Title is required!')
        }
    }

    const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.currentTarget.value)

    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addTaskHandler()
        }
        setError(null)
    }

    const onClickFilterHandler = (nameButton: filterValueType) => {
        props.filerTask(nameButton);
        console.log(props.filter)
    }
    const onClickRemoveTaskHandler = (taskId: string) => props.removeTask(taskId)

    const onChangeCheckboxHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(taskId, newIsDoneValue)
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={title}
                       onChange={onChangeInputHandler}
                       onKeyDown={onKeyPressHandler}
                       className={error ? 'error' : ''}
                />
                <Button title={'+'} callback={addTaskHandler}/>
                {error && <div className='error-message'>{error}</div>}
            </div>
            <ul>
                {props.tasks.map((task) => {
                    const {id, isDone, title} = task;
                    return (
                        <li key={id} className={isDone ? 'is-done' : ''}>
                            <input type="checkbox" checked={isDone} onChange={(e) => onChangeCheckboxHandler(e, id)}/>
                            <span>{title}</span>
                            <Button title={'✖️'} callback={() => onClickRemoveTaskHandler(id)}/>
                        </li>
                    )
                })}
            </ul>
            <div>
                <Button className={props.filter === title ? 'active-filter' : ''} title={'All'}
                        callback={() => onClickFilterHandler('All')}/>
                <Button className={props.filter === title ? 'active-filter' : ''} title={'Active'}
                        callback={() => onClickFilterHandler('Active')}/>
                <Button className={props.filter === title ? 'active-filter' : ''} title={'Completed'}
                        callback={() => onClickFilterHandler('Completed')}/>
            </div>
        </div>
    )
}