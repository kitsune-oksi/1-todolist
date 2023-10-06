import React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { useAppDispatch } from "store/store.hooks";
import { appActions } from "store/app-reducer";
import { selectError } from "App";
import { Snackbar } from "@mui/material";
import { SnackbarCloseReason } from "@mui/material/Snackbar/Snackbar";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ErrorSnackbar: React.FC = () => {
  const error = useSelector(selectError);
  const dispatch = useAppDispatch();

  const handleClose = (event: React.SyntheticEvent<any> | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(appActions.setAppError({ error: null }));
  };

  return (
    <Snackbar open={!!error} autoHideDuration={4000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};
