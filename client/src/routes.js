import React from "react"
import {Switch, Route, Redirect} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import FilmsPage from "./pages/FilmsPage";
import ArtistsPage from "./pages/ArtistsPage";
import FilmPage from "./pages/FilmPage";
import RegistrationPage from "./pages/RegistrationPage";
import WelcomePage from "./pages/WelcomePage";


export const useRoutes = (payload) => {
    function PrivateRoute({children}) {
        return (
            <Route exact
                   render={() => {
                       if (payload) {
                           return (<Redirect
                               to={{
                                   pathname: "/films",
                               }}
                           />)
                       } else {
                           return children
                       }
                   }}
            />
        );
    }

    return (<Switch>
        <Route path="/films/:id">
            <FilmPage/>
        </Route>
        <Route path="/films" exact>
            <FilmsPage/>
        </Route>
        <Route path="/artists" exact>
            <ArtistsPage/>
        </Route>
        <Route path="/" exact>
            <WelcomePage/>
        </Route>
        <PrivateRoute path="/login">
            <AuthPage/>
        </PrivateRoute>
        <PrivateRoute path="/registration">
            <RegistrationPage/>
        </PrivateRoute>
        <Route exact render={() => <Redirect to='/'/>}/>
    </Switch>)

}