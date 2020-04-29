import React, {useContext, useEffect, useState} from "react"
import {Link} from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AlertDialogComponent from "./AlertDialogComponent";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {CircularProgress} from "@material-ui/core";

const PaginationFilmItem = ({film, deleteFilm}) => {

    const auth = useContext(AuthContext)
    const [open, setOpen] = useState(false)
    const {token} = useContext(AuthContext)
    const {request, loading, error, clearError} = useHttp()
    const message = useMessage()

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        message(error, "red")
        clearError()
    }, [error, message, clearError])

    const handleDeleteFilm = async () => {
        try {
            const data = await request(`/api/films/${film._id}`, 'DELETE', {}, {
                'Authorization':
                    `JWT ${token}`,
                'Context-Type': 'Application/json'
            })
            deleteFilm()
            message(data.message, "green")
        } catch (e) {

        }
    }

    const dialogTitle = `Вы действительно хотите удалить фильм "${film.name}"?`

    return (
        <div className='col container'>
            {loading ? <div className="center"><CircularProgress color="secondary"/></div> :
                <div className='row s1 m1'>
                    <div className="card">
                        <div className="card-image waves-effect waves-block waves-light">
                            {film.image ? <img className="activator"
                                               src={require(`../${film.image}`)}
                                               height={400}
                                               alt={film.name}/> : <img className="activator"
                                                                        src={require('../uploads/defaultFilm.png')}
                                                                        height={400}
                                                                        alt={film.name}/>}
                        </div>
                        <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">
                        <p>{film.name}</p>
                        <p>{film.rating ? film.rating.toFixed(1) : null} <i className="material-icons">grade</i></p>

                        <i className="material-icons right">more_vert</i>
                    </span>
                            {auth.payload && auth.payload.type === "Admin" &&
                            <div>
                                <div className='delete-film-red'>
                                    <a onClick={handleOpen}>
                                        <i className="material-icons right">delete</i>
                                    </a>
                                </div>
                                <div className='delete-film-green'>
                                    <a>
                                        <i className="material-icons right">edit</i>
                                    </a>
                                </div>
                            </div>
                            }
                            <Link to={`/films/${film._id}`}>Подробнее</Link>
                        </div>
                        <div className="card-reveal">
                        <span className="card-title grey-text text-darken-4">
                            <i className="material-icons right">close</i></span>
                            <h3>О фильме</h3>
                            <h6><p>{film.description}</p></h6>
                        </div>
                    </div>
                </div>}
            <AlertDialogComponent open={open}
                                  toClose={handleClose}
                                  dialogTitle={dialogTitle}
                                  dialogDescription='Это изменение вернуть назад будет невозможно!'
                                  confirmDialog={handleDeleteFilm}
                                  acceptText='Да'
                                  cancelText='Нет'
            />
        </div>
    )
}
export default PaginationFilmItem