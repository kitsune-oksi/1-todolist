import React, {ChangeEvent, useCallback} from 'react';
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {TaskType} from "./state/tasks-reducer";
import { FilterValueType } from './state/todolists-reducer';
import { Task } from './Task';

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

export const Todolist = React.memo((props: PropsType) => {

    const addTask = useCallback((title:string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    const onClickFilterHandler = useCallback((nameButton: FilterValueType) => {
        props.filerTask(nameButton, props.id);
    }, [props.filerTask, props.id])

    const onClickRemoveTaskHandler = useCallback((taskId: string) => props.removeTask(taskId, props.id), [])

    const onChangeCheckboxHandler = useCallback((e: ChangeEvent<HTMLInputElement>, taskId: string) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(taskId, newIsDoneValue, props.id)
    }, [props.id])

    const changeTodoListTitleCallback = useCallback((newValue: string) => {
        props.changeTodoListTitle(newValue, props.id)
    }, [props.changeTodoListTitle, props.id])

    let tasksForToDoList = props.tasks;

    if (props.filter === 'Active') {
        tasksForToDoList = tasksForToDoList.filter((task) => !task.isDone)
    } else if (props.filter === 'Completed') {
        tasksForToDoList = tasksForToDoList.filter((task) => task.isDone)
    }

    return (
        <div>
            <h3>
                <EditableSpan value={props.title} onChange={changeTodoListTitleCallback}/>
                <IconButton aria-label="delete" onClick={()=>props.removeTodoList(props.id)}>
                    <DeleteIcon />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul style={{listStyleType: "none"}}>
                <Task tasksForToDoList={tasksForToDoList}
                      changeTaskTitle={props.changeTaskTitle}
                      onChangeCheckboxHandler={onChangeCheckboxHandler}
                      onClickRemoveTaskHandler={onClickRemoveTaskHandler}
                      todolistId = {props.id}
                />
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
})

