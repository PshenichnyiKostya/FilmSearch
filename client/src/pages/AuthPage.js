import React, {useContext, useEffect, useState} from "react"
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {useHistory} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

const AuthPage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const [form, serForm] = useState({
        email: '',
        password: '',
    })

    const {loading, request, error, clearError} = useHttp()
    const message = useMessage()
    useEffect(() => {
        message(error, "red")
        clearError()
    }, [error, message, clearError])

    const changeHandler = (event) => {
        serForm({...form, [event.target.name]: event.target.value})
    }
    const handleRegisterPage = (event) => {
        event.preventDefault()
        history.push('/registration')
    }
    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userInfo)
        } catch (e) {

        }
    }
    return (
        <div className='container'>
            <div className='row'>
                <div className="col s6 offset-s3">
                    <h1 className='center'>ФильмоПоиск</h1>
                    {loading && <div className="center"><CircularProgress color="secondary"/></div>}
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Авторизация</span>
                            <div className="input-field ">
                                <input id="email" type="email" name='email' className="validate"
                                       onChange={changeHandler}/>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input id="password" type="password" name='password' className="validate"
                                       onChange={changeHandler}/>
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        <div className="card-action">
                            <button
                                className="waves-effect waves-light btn margin-10"
                                disabled={loading}
                                onClick={loginHandler}
                            >
                                Войти
                            </button>
                            <button
                                className="waves-effect waves-light btn margin-10"
                                disabled={loading}
                                onClick={handleRegisterPage}
                            >
                                На страницу регистрации
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
