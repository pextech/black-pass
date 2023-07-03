import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    value: {
        isLogin: false,
    }
}

export const auth = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        logOut: () => {
            return initialState
        },
        logIn: (state, action) => {
            return{
                value: {
                    isLogin: true,
                }
            }
        }
    }
})

export const {logIn, logOut} = auth.actions
export default auth.reducer