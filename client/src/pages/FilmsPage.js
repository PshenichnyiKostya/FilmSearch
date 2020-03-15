import React, {useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import {useHttp} from "../hooks/http.hook";
import PaginationFilmItem from "./PaginationFilmItem";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
}))
const FilmsPage = () => {
    const classes = useStyles()
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [films, setFilms] = useState([])
    const {request} = useHttp()

    useEffect(() => {

        const func = async () => {
            const data = await request(`/api/films?page=${page}`, 'GET')
            return data
        }
        func().then(r => {
            setFilms(r.films)
            setMaxPage(r.maxPage)
        })
    }, [page])
    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <div className={classes.root}>
            <ul className="collection">
                {films.map(film =>
                    <li key={film._id}>
                        {/*<span>Название: <b>{film.name}</b></span>*/}
                        {/*<span>Страна: <b>{film.country}</b></span>*/}
                        <PaginationFilmItem film={film}/>
                    </li>
                )}
            </ul>
            <Typography>Page: {page}</Typography>

            <Pagination count={maxPage} page={page} onChange={handleChange}/>

        </div>
    );

}
export default FilmsPage