import React, {useContext} from "react";
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export const NavBar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const logoutHandler = (e) => {
        e.preventDefault()
        auth.logout()
        history.push('/login')
    }
    const loginHandler = (e) => {
        e.preventDefault()
        history.push('/login')
    }
    const onRegisterPageHandler = (e) => {
        e.preventDefault()
        history.push('/registration')
    }
    const onUploadPage = (e) => {
        e.preventDefault()
        history.push('/upload')
    }
    return (
        <nav>
            <div className="nav-wrapper blue-grey darken-1 padding-nav">
                <a href="/" className="brand-logo">
                    Фильмо Поиск</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {auth.payload && auth.payload.type === "Admin" &&
                    <li><a href="/" onClick={onUploadPage}>Добавить</a></li>
                    }
                    <li><NavLink to='/films?page=1'>Фильмы</NavLink></li>
                    <li><NavLink to='/artists/?page=1'>Актеры</NavLink></li>
                    {auth.payload &&
                    <li><a href="/" onClick={logoutHandler}>Выйти</a></li>}
                    {!auth.payload && <li><a href="/" onClick={loginHandler}>Войти</a></li>}
                    {!auth.payload && <li><a href="/" onClick={onRegisterPageHandler}>Регистрация</a></li>}
                </ul>
            </div>
        </nav>
    )
}