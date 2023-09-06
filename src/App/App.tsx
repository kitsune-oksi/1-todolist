import React, {useEffect} from 'react';
import './App.css';
import Container from '@mui/material/Container';
import {Header} from "../components/Header/Header";
import { TodolistsList } from '../features/Todolists/TodolistsList';
import {CircularProgress, LinearProgress} from "@mui/material";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../store/store";
import {RequestStatusType} from "../store/app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {useAppDispatch} from "../store/store.hooks/store.hooks";
import {initializeAppTC} from "../store/auth-reducer";


function App() {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status);
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.login.isInitialized)
    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(initializeAppTC())
    },[])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <Header/>
            {status === 'loading' && <LinearProgress/>}
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistsList/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>} />
                    <Route path='*' element={<Navigate to={'/404'}/>} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
