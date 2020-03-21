import React from "react"
import {Redirect, Route, Switch} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import FilmsPage from "./pages/FilmsPage";
import ArtistsPage from "./pages/ArtistsPage";
import FilmPage from "./pages/FilmPage";
import RegistrationPage from "./pages/RegistrationPage";
import WelcomePage from "./pages/WelcomePage";
import ArtistFilms from "./pages/ArtistFilms";


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
        <Route path="/films/:id" component={FilmPage}/>
        <Route path="/films" exact component={FilmsPage}/>
        <Route path="/artists" exact component={ArtistsPage}/>
        <Route path="/" exact component={WelcomePage}/>
        <Route path="/artists/:artistId/films" render={(props => <ArtistFilms {...props}/>)}/>
        <PrivateRoute path="/login">
            <AuthPage/>
        </PrivateRoute>
        <PrivateRoute path="/registration" children={<RegistrationPage/>}/>
        <Route exact render={() => <Redirect to='/'/>}/>
    </Switch>)

}