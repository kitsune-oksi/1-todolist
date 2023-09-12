import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useSelector } from "react-redux";
import { logoutTC } from "store/auth-reducer";
import { useAppDispatch } from "store/store.hooks/store.hooks";
import { LinearProgress } from "@mui/material";
import { selectStatus } from "App/appSelectors";
import { selectIsLoggedIn } from "features/Login/loginSelector";

export function Header() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const status = useSelector(selectStatus);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todolist
          </Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={() => dispatch(logoutTC())}>
              Logout
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
    </Box>
  );
}
