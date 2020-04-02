import React, {useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import {useHttp} from "../hooks/http.hook";
import PaginationFilmItem from "../components/PaginationFilmItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
import {useHistory} from "react-router-dom";
import NoItems from "../components/NoItems";
import SortComponentFilms from "../components/SortComponentFilms";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
}))
const FilmsPage = ({location}) => {
    const classes = useStyles()
    const [maxPage, setMaxPage] = useState(1)
    const [films, setFilms] = useState([])
    const {request, loading, error} = useHttp()
    const [page, setPage] = useState()
    const [filter, setFilter] = useState('rating')
    const history = useHistory()

    useEffect(() => {
        const {page} = queryString.parse(location.search)
        const func = async () => {
            try {
                const data = await request(`/api/films?page=${page}&sort=${filter}`, 'GET')
                return data
            } catch (e) {
                return e.message
            }
        }
        func().then(r => {
            setPage(page)
            setFilms(r.films)
            setMaxPage(r.maxPage)
        }).catch(() => {

        })
    }, [location.search, request, filter])
    const handleChange = (event, value) => {
        history.push(`/films/?page=${value}`)
    };

    const changeFilter = (value) => {
        setFilter(value)
    }
    return (
        <div className={classes.root}>
            <div>
                {loading ? <div className="center"><CircularProgress color="secondary"/></div> : <div>

                    {/*<div className='right margin-sort'>*/}

                    {/*</div>*/}
                    <SortComponentFilms parentCallback={changeFilter} filter={filter}/>
                    {error ? <NoItems error={error}/> : <div>
                        <ul className="collection">
                            {films.map(film =>
                                <li key={film._id}>
                                    <PaginationFilmItem film={film}/>
                                </li>
                            )}
                        </ul>
                        <Typography>Page: {page}</Typography>

                        <Pagination count={maxPage} page={Number(page)} onChange={handleChange}/>
                    </div>}
                </div>}
            </div>

        </div>
    );

}
export default FilmsPage