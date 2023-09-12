import React, { useEffect, useRef } from "react";
import "./App.css";
import Container from "@mui/material/Container";
import { Header } from "components/Header/Header";
import { TodolistsList } from "features/Todolists/TodolistsList";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "features/Login/Login";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import { initializeAppTC } from "store/auth-reducer";
import { selectIsInitialized } from "features/Login/loginSelector";

function App() {
  const isInitialized = useSelector(selectIsInitialized);
  const dispatch = useAppDispatch();
  const refFirstRender = useRef(true);

  useEffect(() => {
    if (!isInitialized && refFirstRender.current) {
      dispatch(initializeAppTC());
      refFirstRender.current = false;
    }
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <Header />
      <Container fixed>
        <Routes>
          <Route path="/" element={<TodolistsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path="*" element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
