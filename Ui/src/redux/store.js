import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice'
import { useSelector } from "react-redux";
import createAccountReducer from './features/createAccountSlice'

export const store = configureStore({
  reducer: {
    authReducer,
    createAccountReducer
  },
});


export const useAppSelector = useSelector