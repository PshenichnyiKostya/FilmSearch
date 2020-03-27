import React, {useEffect, useState} from "react"
import Pagination from "@material-ui/lab/Pagination";
import {useHttp} from "../hooks/http.hook";
import CircularProgress from "@material-ui/core/CircularProgress";
import PaginationArtistItem from "../components/PaginationArtistItem";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import queryString from 'query-string';
import NoItems from "../components/NoItems";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
}))
const ArtistsPage = ({location}) => {
    const classes = useStyles()
    const [maxPage, setMaxPage] = useState(1)
    const [artists, setArtists] = useState([])
    const [page, setPage] = useState()
    const {request, loading, error} = useHttp()
    const history = useHistory()

    useEffect(() => {
        const {page} = queryString.parse(location.search)

        const func = async () => {
            try {
                const data = await request(`/api/artists?page=${page}`, 'GET')
                return data
            } catch (e) {
                return e.message
            }
        }

        func().then(r => {
            setPage(page)
            setArtists(r.artists)
            setMaxPage(r.maxPage)
        }).catch(() => {

        })
    }, [location.search, request])

    const handleChange = (event, value) => {
        history.push(`/artists/?page=${value}`)
    };

    return (
        <div className={classes.root}>
            <div className>
                {loading ? <div className="center"><CircularProgress color="secondary"/></div> : <div>
                    {error ? <NoItems error={error}/> : <div>
                        <ul className="collection">
                            {artists.map(artist =>
                                <li key={artist._id}>
                                    <PaginationArtistItem artist={artist}/>
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
export default ArtistsPage