import React from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {AddItemForm} from "./AddItemForm";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Header} from "./Header";
import {
    addTodoListAC, changeTodoListFilterAC,
    changeTodoListTitleAC, FilterValueType,
    removeTodoListAC,
    TodoListsType
} from "./state/todolists-reducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    TasksStateType
} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";


function App() {
    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, Array<TodoListsType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);

    const changeTaskTitle = (newValue: string, taskId: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(newValue, taskId, todoListId))
    }

    const changeTodoListTitle = (newValue: string, todoListId: string) => {
        dispatch(changeTodoListTitleAC(newValue, todoListId))
    }

    const removeTask = (taskId: string, todoListId: string) => {
        dispatch(removeTaskAC(taskId, todoListId))
    }

    const removeTodoList = (id: string) => {
        dispatch(removeTodoListAC(id))
    }

    const addTask = (title: string, todoListId: string) => {
        dispatch(addTaskAC(title, todoListId))
    }

    const addTodoList = (title: string) => {
        dispatch(addTodoListAC(title))
    }

    const changeTaskStatus = (taskId: string, isDone: boolean, todoListId: string) => {
        dispatch(changeTaskStatusAC(taskId, isDone, todoListId))
    }

    const changeFiler = (value: FilterValueType, todoListId: string) => {
        dispatch(changeTodoListFilterAC(value, todoListId))
    }


    return (
        <div className="App">
            <Header/>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {todoLists.map(todoList => {
                            const todoListsTasks = tasks[todoList.id];
                            let tasksForToDoList = todoListsTasks;

                            if (todoList.filter === 'Active') {
                                tasksForToDoList = todoListsTasks.filter((task) => !task.isDone)
                            } else if (todoList.filter === 'Completed') {
                                tasksForToDoList = todoListsTasks.filter((task) => task.isDone)
                            }
                            return (
                                <Grid item>
                                    <Paper style={{padding: "10px"}}>
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
                                                  changeTaskTitle={changeTaskTitle}
                                                  changeTodoListTitle={changeTodoListTitle}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        }
                    )}
                </Grid>
            </Container>

        </div>
    );
}

export default App;
