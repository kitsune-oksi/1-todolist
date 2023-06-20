import React, {useCallback} from 'react';
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

    const changeTaskTitle = useCallback((newValue: string, taskId: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(newValue, taskId, todoListId))
    }, [])

    const changeTodoListTitle = useCallback((newValue: string, todoListId: string) => {
        dispatch(changeTodoListTitleAC(newValue, todoListId))
    }, [])

    const removeTask = useCallback((taskId: string, todoListId: string) => {
        dispatch(removeTaskAC(taskId, todoListId))
    }, [])

    const removeTodoList = useCallback((id: string) => {
        dispatch(removeTodoListAC(id))
    }, [])

    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(addTaskAC(title, todoListId))
    }, [])

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodoListAC(title))
    }, [])

    const changeTaskStatus = useCallback((taskId: string, isDone: boolean, todoListId: string) => {
        dispatch(changeTaskStatusAC(taskId, isDone, todoListId))
    }, [])

    const changeFiler = useCallback((value: FilterValueType, todoListId: string) => {
        dispatch(changeTodoListFilterAC(value, todoListId))
    }, [])


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
                            return (
                                <Grid item>
                                    <Paper style={{padding: "10px"}}>
                                        <Todolist id={todoList.id}
                                                  key={todoList.id}
                                                  title={todoList.title}
                                                  tasks={todoListsTasks}
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
