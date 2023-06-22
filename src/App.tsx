import React, {useCallback} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {AddItemForm} from "./AddItemForm";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Header} from "./Header";
import {addTodoListAC, TodoListsType} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";


function App() {
    const todoLists = useSelector<AppRootStateType, Array<TodoListsType>>(state => state.todolists);
    const dispatch = useDispatch();

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodoListAC(title))
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
                            return (
                                <Grid item key={todoList.id}>
                                    <Paper style={{padding: "10px"}}>
                                        <Todolist id={todoList.id}
                                                  title={todoList.title}
                                                  filter={todoList.filter}
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
