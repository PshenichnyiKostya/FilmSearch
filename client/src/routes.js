import React from "react"
import {Redirect, Route, Switch} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import FilmsPage from "./pages/FilmsPage";
import ArtistsPage from "./pages/ArtistsPage";
import FilmPage from "./pages/FilmPage";
import RegistrationPage from "./pages/RegistrationPage";
import WelcomePage from "./pages/WelcomePage";
import ArtistPage from "./pages/ArtistPage";
import UploadPage from "./pages/UploadPage";


export const useRoutes = (user) => {

    function UnauthorizedRoute({children}) {
        return (
            <Route exact
                   render={() => {
                       if (user) {
                           return (<Redirect
                               to={{
                                   pathname: "/",
                               }}
                           />)
                       } else {
                           return children
                       }
                   }}
            />
        )
    }

    function AdminRoute({children}) {
        return (
            <Route exact
                   render={() => {
                       if (user !== "Admin") {
                           return (<Redirect
                               to={{
                                   pathname: "/",
                               }}
                           />)
                       } else {
                           return children
                       }
                   }}
            />
        )
    }

    return (<Switch>
        <Route path="/films/:filmId" component={FilmPage}/>
        <Route path="/films" exact component={FilmsPage}/>
        <Route path="/artists" exact component={ArtistsPage}/>
        <Route path="/" exact component={WelcomePage}/>
        <Route path="/artists/:artistId" render={(props => <ArtistPage {...props}/>)}/>
        <UnauthorizedRoute path="/login">
            <AuthPage/>
        </UnauthorizedRoute>

        <UnauthorizedRoute path="/registration" children={<RegistrationPage/>}/>
        {/*<UnauthorizedRoute path="/upload" children={<UploadPage/>}/>*/}
        <AdminRoute path="/upload" children={<UploadPage/>}/>
        <Route render={() => <Redirect to='/'/>}/>
    </Switch>)

}