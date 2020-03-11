import React from 'react'
import 'materialize-css'
import {useRoutes} from "./routes"
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {NavBar} from "./components/NavBar";
import FilmsPage from "./pages/FilmsPage";
import FilmPage from "./pages/FilmPage";
import ArtistsPage from "./pages/ArtistsPage";
import AuthPage from "./pages/AuthPage";

function App() {
    const {login, logout, token, payload} = useAuth()
    const routes = useRoutes(payload)
    return (
        <AuthContext.Provider value={{
            login, logout, token, payload
        }}>

            <BrowserRouter>
                {payload && <NavBar/>}
                <div className='container'>
                    {/*{routes}*/}
                    {payload && payload.type === "User" && <Switch>
                        <Route path="/films" exact>
                            <FilmsPage/>
                        </Route>
                        <Route path="/films/:id">
                            <FilmPage/>
                        </Route>
                        <Route path="/artists" exact>
                            <ArtistsPage/>
                        </Route>
                        <Route>
                            <Redirect to='/films'/>
                        </Route>
                    </Switch>}
                    {!payload && <Switch>
                        <Route path='/' exact>
                            <AuthPage/>
                        </Route>
                        <Redirect to='/'/>
                    </Switch>}
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App
