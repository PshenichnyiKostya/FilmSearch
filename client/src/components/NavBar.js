import React, {useContext} from "react";
import {NavLink} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export const NavBar = () => {

    const auth = useContext(AuthContext)

    const logoutHandler = (e) => {
        e.preventDefault()
        auth.logout()
    }
    return (
        <nav>
            <div className="nav-wrapper blue-grey darken-1 padding-nav">
                <a href="/" className="brand-logo">
                    Фильмо Поиск</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to='/films'>Фильмы</NavLink></li>
                    <li><NavLink to='/artists'>Актеры</NavLink></li>
                    <li><a href='/' onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}