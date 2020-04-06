import React, {useContext, useEffect, useState} from "react"
import {useHttp} from "../hooks/http.hook";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import {Carousel} from "react-responsive-carousel";
import {AuthContext} from "../context/AuthContext";
import CommentsList from "../components/CommentsList";

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
    const [bodyComment, setBodyComment] = useState('')
    const {payload, token} = useContext(AuthContext)

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


    const handleComment = async () => {
        try {
            const data = await request('/api/comments/', 'POST', {
                bodyComment, headers: {
                    'Authorization':
                        `JWT ${token}`
                }
            })
        } catch (e) {

        }
    }

    const handleBodyComment = (event) => {
        setBodyComment(event.target.value)
    }

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
                                        <li className='collection-item'>
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
                        {film.relatedMovies && film.relatedMovies.length > 0 ? <div className='center margin-top-15'>
                            <h4>Похожие фильмы</h4>
                            <Carousel showThumbs={false} showStatus={false} infiniteLoop={true}>
                                {film.relatedMovies.map(film => <div key={film._id}>
                                    <img src={require(`../filmImages/186013_900.jpg`)}/>
                                    <p className="legend">{film.name}</p>
                                </div>)}
                            </Carousel></div> : null}
                        <React.Fragment>
                            <form method="post">
                                <div className="form-group center">
                                <textarea
                                    className="form-control"
                                    placeholder="🤬 Твой комментрий"
                                    name="message"
                                    onChange={handleBodyComment}
                                />
                                </div>

                                <div className="form-group">
                                    <button disabled={loading} className="btn btn-primary" onClick={handleComment}>
                                        Отправить &#10148;
                                    </button>
                                </div>
                            </form>
                        </React.Fragment>
                        <CommentsList filmId={props.match.params.filmId}/>
                    </div>}
            </div>
        </div>

    )
}
export default FilmPage