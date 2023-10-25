import React from "react";
import { useSelector } from "react-redux";
import { authThunks } from "store/auth-reducer";
import { useAppDispatch } from "store/store.hooks";
import { AppBar, Box, Button, LinearProgress, Toolbar, Typography } from "@mui/material";
import { selectStatus } from "App";
import { selectIsLoggedIn } from "features/Login";

export const Header: React.FC = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const status = useSelector(selectStatus);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todolist
          </Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={() => dispatch(authThunks.logout())}>
              Logout
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
    </Box>
  );
};
