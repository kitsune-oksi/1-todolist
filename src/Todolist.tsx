import React, {useCallback} from 'react';
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {addTaskAC, TaskType} from "./state/tasks-reducer";
import {
    changeTodoListFilterAC,
    FilterValueType,
    removeTodoListAC
} from './state/todolists-reducer';
import { Task } from './Task';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

type PropsType = {
    id: string
    title: string
    filter: FilterValueType
}

const ALL = "All";
const ACTIVE = "Active";
const COMPLETED = "Completed"

export const Todolist = React.memo((props: PropsType) => {

    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.id]);
    const dispatch = useDispatch();

    if (props.filter === ACTIVE) {
        tasks = tasks.filter((task) => !task.isDone)
    } else if (props.filter === COMPLETED) {
        tasks = tasks.filter((task) => task.isDone)
    }

    const onClickFilterHandler = useCallback((nameButton: FilterValueType) => {
        dispatch(changeTodoListFilterAC(nameButton, props.id))
    }, [props.id])

    const removeTodoListHandler = useCallback((id: string) => {
        dispatch(removeTodoListAC(id))
    }, [])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, props.id))
    }, [])

    return (
        <div>
            <h3>
                <EditableSpan value={props.title} todolistId={props.id}/>
                <IconButton aria-label="delete" onClick={()=>removeTodoListHandler(props.id)}>
                    <DeleteIcon />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul style={{listStyleType: "none"}}>
                <Task todolistId = {props.id} tasks={tasks}/>
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

