import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, {AlertProps} from '@mui/material/Alert'
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../store/store";
import {useAppDispatch} from "../../store/store.hooks/store.hooks";
import {setAppErrorAC} from "../../App/app-reducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export function ErrorSnackbar() {
    const error = useSelector<AppRootStateType, null | string>(state => state.app.error)
    const dispatch = useAppDispatch();

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        dispatch(setAppErrorAC(null))
    }
    return (
        <Snackbar open={error !== null} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='error' sx={{width: '100%'}}>
                {error}
            </Alert>
        </Snackbar>
    )
}