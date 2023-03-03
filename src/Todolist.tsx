import React, {ChangeEvent} from 'react';
import {FilterValueType} from "./App";
import {Button} from "./Button";
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";

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
                <Button title={'✖️'} callback={()=>props.removeTodoList(props.id)}/>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul>
                {props.tasks.map((task) => {
                    const {id, isDone, title} = task;
                    const changeTitleTaskCallback = (newValue: string) => {
                        props.changeTaskTitle(newValue, id, props.id)
                    }
                    return (
                        <li key={id} className={isDone ? 'is-done' : ''}>
                            <input type="checkbox" checked={isDone} onChange={(e) => onChangeCheckboxHandler(e, id)}/>
                            <EditableSpan value={title} onChange={changeTitleTaskCallback}/>
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

