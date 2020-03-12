import {createContext} from 'react'

export const AuthContext = createContext({
    token: null,
    userInfo: null,
    login: () => {
    },
    logout: () => {

    }
})