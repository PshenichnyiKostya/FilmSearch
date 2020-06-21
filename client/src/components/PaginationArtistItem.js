import React, {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import AlertDialogComponent from "./AlertDialogComponent";

const PaginationArtistItem = ({artist, deleteArtist}) => {

    const [open, setOpen] = useState(false)
    const {request, clearError, error} = useHttp()
    const message = useMessage()
    const auth = useContext(AuthContext)
    const {token} = useContext(AuthContext)
    const history = useHistory()

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июеь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    const getMonthAndDay = (date) => {
        let month = date.getMonth()
        let day = date.getDate()
        return months[month].toString() + " " + day + ", "
    }

    useEffect(() => {
        message(error, "red")
        clearError()
    }, [error, message, clearError])

    const handleToFilms = (e) => {
        e.preventDefault()
        history.push(`/artists/${artist._id}`)
    }

    const handleDeleteArtist = async () => {
        try {
            const data = await request(`/api/artists/${artist._id}`, 'DELETE', {}, {
                'Authorization':
                    `JWT ${token}`,
                'Context-Type': 'Application/json'
            })
            deleteArtist()
            message(data.message, "green")
        } catch (e) {

        }
    }

    const handleUpdateArtist = () => {
        history.push(`/update/artists/${artist._id}`)
    }


    const dialogTitle = `Вы действительно хотите удалить актера ${artist.name}?`

    return (
        <div className="col container">
            <h2 className="header">{artist.name}</h2>
            <div className="card horizontal">
                {artist.image ? <div className="card-image" style={{width: 200, height: 300}}>
                    <img alt={artist.name} src={require(`../${artist.image}`)} width={200} height={300}/>
                </div> : <div className="card-image" style={{width: 200, height: 300}}>
                    <img alt={artist.name} src={require('../uploads/defaultArtist.png')} width={200} height={300}/>
                </div>}

                <div className="card-stacked">
                    <div className="card-content">
                        <ul className="collection">
                            <li className="collection-item">
                                <p>Дата
                                    рождения: {getMonthAndDay(new Date(artist.birthday))} {new Date(artist.birthday).getFullYear()}
                                </p>
                            </li>
                            <li className="collection-item">
                                <p>Всего фильмов: {artist.films.length}</p>
                            </li>
                        </ul>
                    </div>
                    <div className="card-action">
                        <a href="#" onClick={handleToFilms}>На страницу актера</a>
                        {auth && auth.payload && auth.payload.type === "Admin" && <span>
                            <a className='delete-film-green' onClick={handleUpdateArtist}>
                                <i className="material-icons right">edit</i>
                            </a>
                            <a className='delete-film-green' onClick={handleOpen}>
                                <i className="material-icons right">delete</i>
                            </a>
                        </span>
                        }
                    </div>
                </div>
                <AlertDialogComponent open={open}
                                      toClose={handleClose}
                                      dialogTitle={dialogTitle}
                                      dialogDescription='Это изменение вернуть назад будет невозможно!'
                                      confirmDialog={handleDeleteArtist}
                                      acceptText='Да'
                                      cancelText='Нет'
                />
            </div>
        </div>
    )
}
export default PaginationArtistItem