import React from "react"
import {useHistory} from "react-router-dom";

const PaginationArtistItem = ({artist}) => {

    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июеь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    const getMonthAndDay = (date) => {
        let month = date.getMonth()
        let day = date.getDate()
        return months[month].toString() + " " + day + ", "
    }
    const history = useHistory()
    const handleToFilms = (e) => {
        e.preventDefault()
        history.push(`/artists/${artist._id}`)
    }
    return (
        <div className="col container">
            <h2 className="header">{artist.name}</h2>
            <div className="card horizontal">
                <div className="card-image">
                    <img alt={artist.name} src={require('../filmImages/6750.jpg')} width={100} height={300}/>
                </div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PaginationArtistItem