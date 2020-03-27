import React, {useEffect, useState} from "react"
import {useHttp} from "../hooks/http.hook";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import {Carousel} from "react-responsive-carousel";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
}))

const FilmPage = ({...props}) => {

    const classes = useStyles()
    const [film, setFilm] = useState([])
    const {request, loading, error} = useHttp()
    useEffect(() => {
        let elems = document.querySelectorAll('.carousel');
        window.M.Carousel.init(elems, {indicators: true, duration: 100, fullWidth: false, shift: 20});
        const func = async () => {
            const {filmId} = props.match.params
            const data = await request(`/api/films/${filmId}`, 'GET')
            return data
        }
        func().then(r => {
            setFilm(r.film)
        })
    }, [props.match.params, request])

    return (
        <div className={classes.root}>
            <div>
                {loading ? <div className='center'><CircularProgress color="secondary"/></div> :
                    <div>
                        <h2 className="header">{film.name}</h2>
                        <div className="card horizontal">
                            <div className="card-image padding-film-image">
                                <img alt={film.name} src={require('../filmImages/186013_900.jpg')} width={100}
                                     height={300}/>
                            </div>
                            <div className="card-stacked">
                                <div className="card-content">
                                    <ul className="collection">
                                        <li className="collection-item">
                                            <p>Cтрана: {film.country}</p>
                                        </li>
                                        <li className="collection-item">
                                            <p>Год: {film.year ? film.year : "Неизвестно"}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {film.description &&
                        <div className="card-panel teal blue-grey darken-1 white-text">Описание: <br/>{film.description}
                        </div>
                        }
                        {film.relatedMovies && film.relatedMovies.length > 0 ? <div className='center'>
                            <h4>Похожие фильмы</h4>
                            <Carousel showThumbs={false} showStatus={false} infiniteLoop={true}>
                                {film.relatedMovies.map(film => <div>
                                    <img src={require(`../filmImages/186013_900.jpg`)}/>
                                    <p className="legend">{film.name}</p>
                                </div>)}
                            </Carousel></div> : <div>Похожих фильмов не найдено</div>
                        }
                    </div>}
                {/*{film.relatedMovies &&*/}
                {/*<div className="carousel carousel-slider center">*/}
                {/*    <div className="carousel-fixed-item center">*/}
                {/*        <a href='#qwe' className="btn waves-effect white grey-text darken-text-2">Перейти к фильму</a>*/}
                {/*    </div>*/}
                {/*    <div className="carousel-item red white-text" href="#one!">*/}
                {/*        <h2>First Panel</h2>*/}
                {/*        <p className="white-text">This is your first panel</p>*/}
                {/*    </div>*/}
                {/*</div>}*/}
                {/* {film.relatedMovies && film.relatedMovies.length > 0 ?
                    <div className="carousel carousel-slider center">
                        <div className="carousel-fixed-item center">
                            <a className="btn waves-effect white grey-text darken-text-2">Перейти к фильму</a>
                        </div>
                        <div className="carousel-item red white-text" href="#one!">
                            <h2>First Panel</h2>
                            <p className="white-text">This is your first panel</p>
                        </div>
                    </div>
                    : <div>Похожих фильмов не найдено</div>
                }*/}
            </div>
        </div>

    )
}
export default FilmPage