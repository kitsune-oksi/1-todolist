import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValueType} from "./App";
import {Button} from "./Button";
import './App.css';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todoListId: string) => void
    filerTask: (value: FilterValueType, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todoListId: string) => void
    filter: FilterValueType
    removeTodoList: (id: string) => void
}

const ALL = "All";
const ACTIVE = "Active";
const COMPLETED = "Completed"

export function Todolist(props: PropsType) {
    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const addTaskHandler = () => {
        const newTitle = title.trim()
        if (newTitle) {
            props.addTask(title, props.id)
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

    const onClickFilterHandler = (nameButton: FilterValueType) => {
        props.filerTask(nameButton, props.id);
    }
    const onClickRemoveTaskHandler = (taskId: string) => props.removeTask(taskId, props.id)

    const onChangeCheckboxHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(taskId, newIsDoneValue, props.id)
    }

    return (
        <div>

            <h3>
                {props.title}
                <Button title={'✖️'} callback={()=>props.removeTodoList(props.id)}/>
            </h3>
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
                <Button className={props.filter === ALL ? 'active-filter' : ''} title={ALL}
                        callback={() => onClickFilterHandler(ALL)}/>
                <Button className={props.filter === ACTIVE ? 'active-filter' : ''} title={ACTIVE}
                        callback={() => onClickFilterHandler(ACTIVE)}/>
                <Button className={props.filter === COMPLETED ? 'active-filter' : ''} title={COMPLETED}
                        callback={() => onClickFilterHandler(COMPLETED)}/>
            </div>
        </div>
    )
}