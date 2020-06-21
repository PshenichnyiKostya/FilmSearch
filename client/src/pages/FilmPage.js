import React, {useEffect, useState} from "react"
import {useHttp} from "../hooks/http.hook";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import {Carousel} from "react-responsive-carousel";
import CommentsList from "../components/CommentsList";
import {useMessage} from "../hooks/message.hook";
import RatingFilm from "../components/RatingFilm";
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
}))

const FilmPage = ({...props}) => {

    const classes = useStyles()
    const [film, setFilm] = useState([])
    const {request, loading, error, clearError} = useHttp()
    const message = useMessage()

    useEffect(() => {
        message(error, "red")
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        const func = async () => {
            const {filmId} = props.match.params
            try {
                const data = await request(`/api/films/${filmId}`, 'GET')
                return data
            } catch (e) {
                return e.message
            }
        }
        func().then(r => {
            setFilm(r.film)
        })
    }, [props.match.params, request])

    useEffect(() => {
        message(error, "red")
        clearError()
    }, [error, message, clearError])


    return (
        <div className='container'>
            <div className={classes.root}>
                <div>
                    {loading ? <div className='center'><CircularProgress color="secondary"/></div> :
                        <div>
                            <h2 className="header">{film.name}</h2>
                            <div className="card horizontal">
                                <div className="card-image padding-film-image">
                                    {film.image ?
                                        <img alt={film.name} src={require(`../${film.image}`)} width={100}
                                             height={300}/> :
                                        <img alt={film.name} src={require('../uploads/defaultFilm.png')} width={100}
                                             height={300}/>}

                                </div>
                                <div className="card-stacked">
                                    <div className="card-content">
                                        <ul className="collection">
                                            <li className="collection-item">
                                                <p>Cтрана: {film.country ? film.country : "Неизвестно"}</p>
                                            </li>
                                            <li className='collection-item'>
                                                <p>Год: {film.year ? film.year : "Неизвестно"}</p>
                                            </li>
                                            <li className='collection-item'>
                                                <p>Рейтинг: {film.rating ? film.rating : "Неизвестно"}</p>
                                            </li>
                                        </ul>
                                        <div>
                                            {film.artists && film.artists.length > 0 ? <div>
                                                <p>В ролях</p>
                                                {film.artists.map((artist, index) => <span>
                                                {index === film.artists.length - 1 ?
                                                    <Link to={`/artists/${artist._id}`}>{artist.name} </Link> :
                                                    <Link to={`/artists/${artist._id}`}>{artist.name}, </Link>}

                                                </span>
                                                )}
                                            </div> : null}

                                        </div>

                                    </div>
                                    <div className="card-content">
                                        <h5>Твоя оценка</h5>
                                        <RatingFilm filmId={props.match.params.filmId}/>
                                    </div>

                                </div>
                            </div>

                            <div
                                className="card-panel teal blue-grey darken-1 white-text">Описание: <br/>
                                {film.description ? film.description : "Описание отсутствует"}
                            </div>


                            {film.relatedMovies && film.relatedMovies.length > 0 ?
                                <div className='center margin-top-15'>
                                    <h4>Похожие фильмы</h4>
                                    <Carousel className='carousel-height' showThumbs={false} showStatus={false}
                                              infiniteLoop={true}>
                                        {film.relatedMovies.map(film => <div key={film._id}>
                                            {film.image ?
                                                <img height={400}
                                                     alt={film.name}
                                                     src={require(`../${film.image}`)}/>
                                                :
                                                <img height={400}
                                                     alt={film.name}
                                                     src={require('../uploads/defaulFilmRelated.png')}/>}
                                            <p className="legend">{film.name}</p>
                                        </div>)}
                                    </Carousel></div> : null}


                            <CommentsList filmId={props.match.params.filmId}/>
                        </div>}
                </div>
            </div>
        </div>

    )
}
export default FilmPage