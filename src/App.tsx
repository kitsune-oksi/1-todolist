import React, {useState} from 'react';
import { v1 } from 'uuid';
import './App.css';
import {TaskType, Todolist} from "./Todolist";

export type filterValueType = 'All' | 'Active' | 'Completed'

function App() {
    let [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'ReactJS', isDone: false}
    ])

    const removeTask = (id: string) => {
        let filteredTask = tasks.filter((task) => task.id != id);
        setTasks(filteredTask)
    }

    let [filter, setFilter] = useState<filterValueType>('All');

    let tasksForToDoList = tasks;

    if (filter === 'Active') {
        tasksForToDoList = tasks.filter((task) => task.isDone)
    } else if (filter === 'Completed') {
        tasksForToDoList = tasks.filter((task) => !task.isDone)
    }

    const changeFiler = (value: filterValueType) => {
        setFilter(value)
    }

    const addTask = (title: string) => {
        let task = {id: v1(), title: title, isDone: false};
        let newTasks = [task, ...tasks];
        setTasks(newTasks);
    }

    return (
        <div className="App">
            <Todolist title='What to learn' tasks={tasksForToDoList} removeTask={removeTask} filerTask={changeFiler} addTask={addTask}/>
        </div>
    );
}

export default App;
