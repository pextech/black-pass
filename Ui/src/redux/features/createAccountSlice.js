import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    value: {
        username: "",
        email: "",
        accountId: "",
    }
}

export const createAccount = createSlice({
    name: 'createAccount',
    initialState: initialState,
    reducers: {
        createNewAccount: (state, action) => {
            return{
                value: {
                    username: action.payload,
                    email: action.payload,
                    accountId: action.payload,
                }
            }
        }
    }
})

export const {createNewAccount} = createAccount.actions
export default createAccount.reducer