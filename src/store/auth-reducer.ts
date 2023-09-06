import {SetAppErrorACType, setAppStatusAC, SetAppStatusACType} from "./app-reducer"
import {AppDispatch} from "./store";
import {authAPI} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState = {
    isLoggedIn: false,
    isInitialized: false
}

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.payload.value}
        case "login/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.payload.value}
        default:
            return state
    }
}

// actions
const setIsLoggedInAC = (value: boolean) => {
    return {
        type: 'login/SET-IS-LOGGED-IN',
        payload: {
            value
        }
    } as const
}
const setIsInitializedAC = (value: boolean) => {
    return {
        type: 'login/SET-IS-INITIALIZED',
        payload: {
            value
        }
    } as const
}

// thunks
export const loginTC = (values: LoginDataType) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC('loading'));
    authAPI.login(values)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const initializeAppTC = () => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC('loading'));
    authAPI.me()
        .then((res) => {
            dispatch(setIsInitializedAC(true));
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = () => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}


// types
type InitialStateType = typeof initialState
type ActionsType =
    SetAppStatusACType |
    SetAppErrorACType |
    ReturnType<typeof setIsLoggedInAC> |
    ReturnType<typeof setIsInitializedAC>
export type LoginDataType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}