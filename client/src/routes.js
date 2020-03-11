import React from "react"
import {Switch, Route, Redirect} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import FilmsPage from "./pages/FilmsPage";
import ArtistsPage from "./pages/ArtistsPage";
import FilmPage from "./pages/FilmPage";

export const useRoutes = (payload) => {
    if (payload) {
        if (payload.type === "User") {
            return (
                <Switch>
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
                </Switch>
            )
        }
    } else {
        return (
            <Switch>
                <Route path='/' exact>
                    <AuthPage/>
                </Route>
                <Redirect to='/'/>
            </Switch>
        )
    }
}