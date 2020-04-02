import React, {useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles";
import {useHttp} from "../hooks/http.hook";
import CircularProgress from "@material-ui/core/CircularProgress";
import NoItems from "../components/NoItems";
import {Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
}))

const ArtistPage = ({...props}) => {
    const classes = useStyles()
    const [artist, setArtist] = useState([])
    const {request, loading, error} = useHttp()

    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июеь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

    const getMonthAndDay = (date) => {
        let month = date.getMonth()
        let day = date.getDate()
        return months[month].toString() + " " + day + ", "
    }

    useEffect(() => {
        const func = async () => {
            const {artistId} = props.match.params
            try {
                const data = await request(`/api/artists/${artistId}`, 'GET')
                return data
            } catch (e) {
                return e.message
            }
        }
        func().then(r => {
            setArtist(r.artist)
        })
    }, [props.match.params, request])

    return (
        <div className={classes.root}>
            <div>
                {loading ? <div className='center'><CircularProgress color="secondary"/></div> :
                    <div>
                        {!error ? <div className="col container">
                            <h2 className="header">{artist.name}</h2>
                            <div className="card horizontal">
                                <div className="card-image">
                                    <img alt={artist.name} src={require('../filmImages/6750.jpg')} width={100}
                                         height={300}/>
                                </div>
                                <div className="card-stacked">
                                    <div className="card-content">
                                        <ul className="collection">
                                            <li className="collection-item">
                                                {artist.birthday && <p>Дата
                                                    рождения: {getMonthAndDay(new Date(artist.birthday))} {new Date(artist.birthday).getFullYear()}
                                                </p>}
                                            </li>
                                            {artist.films && <div>
                                                <li className="collection-item">
                                                    <p>Всего фильмов: {artist.films.length}</p>
                                                </li>
                                            </div>}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {artist.films && artist.films.length > 0 ?
                                <div>
                                    <h4>Фильмы</h4>
                                    <ul className="collection">
                                        {artist.films.map(film =>
                                            <Link to={`/films/${film._id}`}>
                                                <li className="collection-item avatar grey-text" key={film._id}>
                                                    <i className="material-icons circle green">local_movies
                                                    </i>
                                                    <span className="title">Название: {film.name}</span>
                                                    <p>Страна: {film.country}<br/>
                                                        Год: {film.year}
                                                    </p>
                                                    <div className='secondary-content'>
                                                        <i className='rating'>{film.rating}</i>
                                                        <i className="material-icons">grade</i>
                                                    </div>
                                                </li>
                                            </Link>
                                        )}
                                    </ul>
                                </div> : null}

                        </div> : <NoItems error={error}/>}
                    </div>}
            </div>
        </div>
    )
}
export default ArtistPage