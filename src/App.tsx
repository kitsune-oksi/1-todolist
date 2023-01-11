import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";

export type filterValueType = 'All' | 'Active' | 'Completed'

function App() {
    let [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: 'HTML&CSS', isDone: true},
        {id: 2, title: 'JS', isDone: true},
        {id: 3, title: 'ReactJS', isDone: false}
    ])

    const removeTask = (id: number) => {
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

    return (
        <div className="App">
            <Todolist title='What to learn' tasks={tasksForToDoList} removeTask={removeTask} filerTask={changeFiler}/>
        </div>
    );
}

export default App;
