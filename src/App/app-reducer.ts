export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type InitialStateType = {
    status: RequestStatusType
    error: null | string
}

export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>;

type ActionsType =
    SetAppStatusACType |
    SetAppErrorACType

const initialState: InitialStateType = {
    status: 'idle' as RequestStatusType,
    error: null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        case "APP/SET-ERROR":
            return {...state, error: action.payload.error}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        payload: {
            status
        }
    } as const
}

export const setAppErrorAC = (error: string | null) => {
    return {
        type: 'APP/SET-ERROR',
        payload: {
            error
        }
    } as const
}