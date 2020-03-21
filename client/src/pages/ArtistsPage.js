import React, {useEffect, useState} from "react"
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import {useHttp} from "../hooks/http.hook";
import CircularProgress from "@material-ui/core/CircularProgress";
import PaginationArtistItem from "./PaginationArtistItem";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
}))
const ArtistsPage = () => {
    const classes = useStyles()
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [artists, setArtists] = useState([])
    const {request, loading} = useHttp()

    useEffect(() => {

        const func = async () => {
            const data = await request(`/api/artists?page=${page}`, 'GET')
            return data
        }
        func().then(r => {
            setArtists(r.artists)
            setMaxPage(r.maxPage)
        })
    }, [page])
    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <div className={classes.root}>
            <div className="center">
                {loading && <CircularProgress color="secondary"/>}
            </div>
            <ul className="collection">
                {artists.map(artist =>
                    <li key={artist._id}>
                        <PaginationArtistItem artist={artist}/>
                    </li>
                )}
            </ul>
            <Typography>Page: {page}</Typography>

            <Pagination count={maxPage} page={page} onChange={handleChange}/>
        </div>
    );
}
export default ArtistsPage