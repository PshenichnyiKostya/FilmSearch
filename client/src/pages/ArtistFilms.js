import React, {useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles";
import {useHttp} from "../hooks/http.hook";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
}))

const ArtistFilms = ({...props}) => {
    const classes = useStyles()
    const [artist, setArtist] = useState([])
    const {request, loading} = useHttp()
    useEffect(() => {
        const func = async () => {
            const {artistId} = props.match.params
            const data = await request(`/api/films/artist/${artistId}`, 'GET')
            return data
        }
        func().then(r => {
            setArtist(r.artist)
        })
    }, [])

    return (
        <div>
            {artist.name}
        </div>
    )
}
export default ArtistFilms