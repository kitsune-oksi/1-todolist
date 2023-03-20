import React, {ChangeEvent} from 'react';
import {FilterValueType} from "./App";
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import { Delete } from '@mui/icons-material'

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
    changeTaskTitle: (newValue: string, taskId: string, todoListId: string)=> void
    changeTodoListTitle: (newValue: string, todoListId: string)=> void
}

const ALL = "All";
const ACTIVE = "Active";
const COMPLETED = "Completed"

export function Todolist(props: PropsType) {

    const addTask = (title:string) => {
        props.addTask(title, props.id)
    }

    const onClickFilterHandler = (nameButton: FilterValueType) => {
        props.filerTask(nameButton, props.id);
    }
    const onClickRemoveTaskHandler = (taskId: string) => props.removeTask(taskId, props.id)

    const onChangeCheckboxHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(taskId, newIsDoneValue, props.id)
    }

    const changeTodoListTitleCallback = (newValue: string) => {
        props.changeTodoListTitle(newValue, props.id)
    }

    return (
        <div>
            <h3>
                <EditableSpan value={props.title} onChange={changeTodoListTitleCallback}/>
                <IconButton aria-label="delete" onClick={()=>props.removeTodoList(props.id)}>
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul style={{listStyleType: "none"}}>
                {props.tasks.map((task) => {
                    const {id, isDone, title} = task;
                    const changeTitleTaskCallback = (newValue: string) => {
                        props.changeTaskTitle(newValue, id, props.id)
                    }
                    return (
                        <li key={id} className={isDone ? 'is-done' : ''}>
                            <Checkbox
                                checked={isDone}
                                onChange={(e) => onChangeCheckboxHandler(e, id)}
                            />
                            <EditableSpan value={title} onChange={changeTitleTaskCallback}/>
                            <IconButton aria-label="delete" onClick={() => onClickRemoveTaskHandler(id)}>
                                <Delete />
                            </IconButton>
                        </li>
                    )
                })}
            </ul>
            <div>
                <Button
                    onClick={() => onClickFilterHandler(ALL)}
                    variant={props.filter === ALL ? 'outlined' : 'text'}
                    color={"inherit"}
                >{ALL}</Button>
                <Button
                    onClick={() => onClickFilterHandler(ACTIVE)}
                    variant={props.filter === ACTIVE ? 'outlined' : 'text'}
                    color={"primary"}
                >{ACTIVE}</Button>
                <Button
                    onClick={() => onClickFilterHandler(COMPLETED)}
                    variant={props.filter === COMPLETED ? 'outlined' : 'text'}
                    color={"secondary"}
                >{COMPLETED}</Button>
            </div>
        </div>
    )
}

