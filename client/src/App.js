import React from 'react'
import 'materialize-css'
import {useRoutes} from "./routes"
import {BrowserRouter} from "react-router-dom";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {NavBar} from "./components/NavBar";
import Footer from "./components/Footer";


function App() {
    const {login, logout, token, payload} = useAuth()
    const user = payload ? payload.type : null
    const routes = useRoutes(user)
    return (
        <AuthContext.Provider value={{
            login, logout, token, payload
        }}>
            <BrowserRouter>
                {<NavBar/>}
                <div>
                    {routes}
                </div>
            </BrowserRouter>
            <Footer description="Фильмо Поиск"/>
        </AuthContext.Provider>
    )
}

export default App
