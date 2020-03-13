import React from 'react'
import 'materialize-css'
import {useRoutes} from "./routes"
import {BrowserRouter} from "react-router-dom";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {NavBar} from "./components/NavBar";
import StickyFooter from "./pages/StickyFooter";

function App() {
    const {login, logout, token, payload} = useAuth()
    const isUser = payload ? payload.type === "User" : false
    const routes = useRoutes(isUser)
    return (
        <AuthContext.Provider value={{
            login, logout, token, payload
        }}>

            <BrowserRouter>
                {/*{payload && <NavBar/>}*/}
                {<NavBar/>}
                <div className='container'>
                    {routes}
                </div>
                <StickyFooter/>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App
