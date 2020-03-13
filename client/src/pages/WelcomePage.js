import React, {useEffect, useState} from "react"
import {useMessage} from "../hooks/message.hook";
import {useHttp} from "../hooks/http.hook";
import {useHistory} from "react-router-dom";

const WelcomePage = () => {
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, serForm] = useState({
        email: '',
        password: '',
        password2: '',
        clientName: '',
    })
    useEffect(() => {
        message(error, "red")
        clearError()
    }, [error, message, clearError])
    const changeHandler = (event) => {
        serForm({...form, [event.target.name]: event.target.value})
    }
    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message, "green")
        } catch (e) {

        }
    }
    return (
        <div className='row'>
            <div className="col s6 offset-s3">
                <h1 className='center'>ФильмоПоиск</h1>
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Регистрация</span>
                        <div className="input-field ">
                            <input id="email" type="email" name='email' className="validate" onChange={changeHandler}
                                   autoComplete="new-password"
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-field">
                            <input id="password" type="password" name='password' className="validate"
                                   onChange={changeHandler}
                                   autoComplete="new-password"
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="input-field">
                            <input id="password2" type="password" name='password2' className="validate"
                                   onChange={changeHandler}/>
                            <label htmlFor="password2">Repeat password</label>
                        </div>
                        <div className="input-field">
                            <input id="clientName" type="text" name='clientName' className="validate"
                                   onChange={changeHandler}/>
                            <label htmlFor="clientName">Your unique name</label>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="waves-effect waves-light btn"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default WelcomePage