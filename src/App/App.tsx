import React, { useEffect, useRef } from "react";
import "./App.css";
import { TodolistsList } from "features/Todolists";
import { CircularProgress, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "features/Login";
import { useAppDispatch } from "store/store.hooks";
import { selectIsInitialized } from "features/Login";
import { ErrorSnackbar, Header } from "common/components";
import { authThunks } from "store/auth-reducer";

export const App: React.FC = () => {
  const isInitialized = useSelector(selectIsInitialized);
  const dispatch = useAppDispatch();
  const refFirstRender = useRef(true);

  useEffect(() => {
    if (!isInitialized && refFirstRender.current) {
      dispatch(authThunks.initializeApp());
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
};
