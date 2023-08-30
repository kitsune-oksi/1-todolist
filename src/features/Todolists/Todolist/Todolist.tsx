import React, {useCallback, useEffect} from 'react';
import '../../../App/App.css';
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import Button, {ButtonProps} from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {addTaskTC, fetchTasksTC} from "../../../store/tasks-reducer";
import {changeTodoListFilterAC, FilterValueType, removeTodolistTC} from '../../../store/todolists-reducer';
import {Task} from '../Task/Task';
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../../store/store";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {useAppDispatch} from "../../../store/store.hooks/store.hooks";
import {RequestStatusType} from "../../../App/app-reducer";

type PropsType = {
    id: string
    title: string
    filter: FilterValueType
    entityStatus: RequestStatusType
}

const ALL = "All";
const ACTIVE = "Active";
const COMPLETED = "Completed"

export const Todolist = React.memo((props: PropsType) => {

    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.id]);
    const dispatch = useAppDispatch();

    if (props.filter === ACTIVE) {
        tasks = tasks.filter((task) => task.status !== TaskStatuses.New)
    } else if (props.filter === COMPLETED) {
        tasks = tasks.filter((task) => task.status === TaskStatuses.New)
    }

    const onClickFilterHandler = useCallback((nameButton: FilterValueType) => {
        dispatch(changeTodoListFilterAC(nameButton, props.id))
    }, [props.id])

    const removeTodoListHandler = useCallback((id: string) => {
        dispatch(removeTodolistTC(id))
    }, [])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(props.id, title))
    }, [props.id])

    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [props.id])

    return (
        <div>
            <h3>
                <EditableSpan value={props.title} todolistId={props.id} disabled={props.entityStatus === 'loading'}/>
                <IconButton aria-label="delete" onClick={() => removeTodoListHandler(props.id)}
                            disabled={props.entityStatus === 'loading'}>
                    <DeleteIcon/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.entityStatus === 'loading'}/>
                <ul style={{listStyleType: "none"}}>
            {tasks.map(task => {
                return <Task key={task.id} task={task} todolistId={props.id} entityStatus={props.entityStatus}/>
            })}
                </ul>
                <div>
                <ButtonWithMemo
                onClick={useCallback(() => onClickFilterHandler(ALL),[])}
                variant={props.filter === ALL ? 'outlined' : 'text'}
                color={"inherit"}
                title={ALL}
                />
                <ButtonWithMemo
                onClick={useCallback(() => onClickFilterHandler(ACTIVE),[])}
                variant={props.filter === ACTIVE ? 'outlined' : 'text'}
                color={"primary"}
                title={ACTIVE}
                />
                <ButtonWithMemo
                onClick={useCallback(() => onClickFilterHandler(COMPLETED),[])}
                variant={props.filter === COMPLETED ? 'outlined' : 'text'}
                color={"secondary"}
                title={COMPLETED}
                />
                </div>
                </div>
                )
            })

            const ButtonWithMemo: React.FC<ButtonProps> = React.memo(({onClick, variant, color, title}) => {
            return <Button onClick={onClick}
            variant={variant}
            color={color}>
        {title}
            </Button>
        })

