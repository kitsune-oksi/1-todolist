import React from 'react';
import './App.css';
import Container from '@mui/material/Container';
import {Header} from "../components/Header/Header";
import { TodolistsList } from '../features/Todolists/TodolistsList';
import {LinearProgress} from "@mui/material";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../store/store";
import {RequestStatusType} from "./app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";


function App() {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

    return (
        <div className="App">
            <ErrorSnackbar/>
            <Header/>
            {status === 'loading' && <LinearProgress/>}
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default App;
