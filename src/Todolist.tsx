import React from "react";
import {filterValueType} from "./App";

export type TaskType = {
    id: number
    title: string
    isDone: boolean
}



type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (id: number)=>void
    filerTask:(value:filterValueType)=>void
}

export function Todolist(props: PropsType) {
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {props.tasks.map((task) => {
                    return (
                        <li key={task.id}>
                            <input type="checkbox" checked={task.isDone}/>
                            <span>{task.title}</span>
                            <button onClick={()=>props.removeTask(task.id)}>✖️</button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button onClick={()=>props.filerTask('All')}>All</button>
                <button onClick={()=>props.filerTask('Active')}>Active</button>
                <button onClick={()=>props.filerTask('Completed')}>Completed</button>
            </div>
        </div>
    )
}