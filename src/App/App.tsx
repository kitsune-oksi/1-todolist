import React from 'react';
import './App.css';
import Container from '@mui/material/Container';
import {Header} from "../components/Header/Header";
import { TodolistsList } from '../features/Todolists/TodolistsList';


function App() {

    return (
        <div className="App">
            <Header/>
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default App;
