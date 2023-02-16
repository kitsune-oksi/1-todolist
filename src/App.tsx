import React, {useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {TaskType, Todolist} from "./Todolist";

export type FilterValueType = 'All' | 'Active' | 'Completed'

type TodoListsType = {
    id: string
    title: string
    filter: FilterValueType
}

type TaskStateType = {
    [key: string]: TaskType[]
}

function App() {

    const todoListId1 = v1();
    const todoListId2 = v1();

    const [todoLists, setTodoLists] = useState<Array<TodoListsType>>(
        [
            {id: todoListId1, title: 'What to learn', filter: 'All'},
            {id: todoListId2, title: 'What to buy', filter: 'Active'}
        ]
    )

    const [tasks, setTasks] = useState<TaskStateType>(
        {
            [todoListId1]: [
                {id: v1(), title: 'HTML&CSS', isDone: true},
                {id: v1(), title: 'JS', isDone: true},
                {id: v1(), title: 'ReactJS', isDone: false}
            ],
            [todoListId2]: [
                {id: v1(), title: 'Apples', isDone: true},
                {id: v1(), title: 'Oranges', isDone: true},
                {id: v1(), title: 'Cake', isDone: false}
            ],
        }
    )

    const removeTask = (id: string, todoListId: string) => {
        const todoListsTasks = tasks[todoListId];
        tasks[todoListId] = todoListsTasks.filter((task) => task.id != id);
        setTasks({...tasks})
    }


    const changeFiler = (value: FilterValueType, todoListId: string) => {
        const todoList = todoLists.find(tl => tl.id === todoListId);
        if (todoList) {
            todoList.filter = value;
            setTodoLists([...todoLists])
        }
    }

    const addTask = (title: string, todoListId: string) => {
        const todoListsTasks = tasks[todoListId];
        const task = {id: v1(), title: title, isDone: false};
        tasks[todoListId] = [task, ...todoListsTasks];
        setTasks({...tasks});
    }

    const changeTaskStatus = (id: string, isDone: boolean, todoListId: string) => {
        const todoListsTasks = tasks[todoListId];
        const task = todoListsTasks.find(t => t.id === id)
        if (task) {
            task.isDone = isDone;
            setTasks({...tasks})
        }
    }

    const removeTodoList = (id: string) => {
        setTodoLists(todoLists.filter(tl => tl.id !== id));
        delete tasks[id];
        setTasks({...tasks})
    }

    return (
        <div className="App">
            {todoLists.map(todoList => {
                    const todoListsTasks = tasks[todoList.id];
                    let tasksForToDoList = todoListsTasks;

                    if (todoList.filter === 'Active') {
                        tasksForToDoList = todoListsTasks.filter((task) => !task.isDone)
                    } else if (todoList.filter === 'Completed') {
                        tasksForToDoList = todoListsTasks.filter((task) => task.isDone)
                    }
                    return (
                        <Todolist id={todoList.id}
                                  key={todoList.id}
                                  title={todoList.title}
                                  tasks={tasksForToDoList}
                                  removeTask={removeTask}
                                  filerTask={changeFiler}
                                  addTask={addTask}
                                  changeTaskStatus={changeTaskStatus}
                                  filter={todoList.filter}
                                  removeTodoList={removeTodoList}
                        />
                    )
                }
            )}
        </div>
    );
}

export default App;
