import React, {useEffect, useState} from "react"
import Comment from "./Comment";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import {makeStyles} from "@material-ui/core/styles";
import {useHttp} from "../hooks/http.hook";
import NoItems from "./NoItems";


const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
}))

const CommentsList = ({filmId}) => {

    const classes = useStyles()
    const [commentPage, setCommentPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [comments, setComments] = useState([])
    const {request, loading, error} = useHttp()

    const handleChange = (event, value) => {
        setCommentPage(value)
    }
    useEffect(() => {
        const func = async () => {
            try {
                const data = await request(`/api/comments/${filmId}?page=${commentPage}`, 'GET')
                return data
            } catch (e) {
                return e.message
            }
        }
        func().then(r => {
            setCommentPage(commentPage)
            setComments(r.comments)
            setMaxPage(r.maxPage)
        }).catch(() => {

        })
    }, [request,commentPage])
    return (
        <div>
            {!loading ? (<div>
                {error ? <NoItems error={error}/> : <div>
                    <ul className="list-unstyled">
                        {comments.map((comment =>
                                <Comment comment={comment}/>
                        ))}
                    </ul>
                    <div className={classes.root}>
                        <Typography>Страница: {commentPage}</Typography>
                        <Pagination count={maxPage} page={Number(commentPage)} onChange={handleChange}/>
                    </div>
                </div>}
            </div>) : null}

        </div>
    )
}
export default CommentsList