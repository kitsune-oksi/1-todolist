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

    const removeTask = (taskId: string, todoListId: string) => {
        // const todoListsTasks = tasks[todoListId];
        // tasks[todoListId] = todoListsTasks.filter((task) => task.taskId != taskId);
        // setTasks({...tasks})
        setTasks({...tasks, [todoListId]: tasks[todoListId].filter(el => el.id !== taskId)})
    }


    const changeFiler = (value: FilterValueType, todoListId: string) => {
        // const todoList = todoLists.find(tl => tl.id === todoListId);
        // if (todoList) {
        //     todoList.filter = value;
        //     setTodoLists([...todoLists])
        // }
        setTodoLists(todoLists.map(el => el.id === todoListId ? {...el, filter: value} : el))
    }

    const addTask = (title: string, todoListId: string) => {
        // const todoListsTasks = tasks[todoListId];
        const newTask = {id: v1(), title: title, isDone: false};
        // tasks[todoListId] = [newTask, ...todoListsTasks];
        // setTasks({...tasks});
        setTasks({...tasks, [todoListId]: [newTask, ...tasks[todoListId]]})
    }

    const changeTaskStatus = (taskId: string, isDone: boolean, todoListId: string) => {
        // const todoListsTasks = tasks[todoListId];
        // const task = todoListsTasks.find(t => t.id === taskId)
        // if (task) {
        //     task.isDone = isDone;
        //     setTasks({...tasks})
        // }
        setTasks({...tasks, [todoListId]: tasks[todoListId].map(el => el.id === taskId ? {...el, isDone} : el)}) // если названия совпадают, то переприсваивать не нужно isDone: isDone
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
