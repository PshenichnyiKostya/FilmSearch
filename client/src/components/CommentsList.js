import React, {useEffect, useState} from "react"
import Comment from "./Comment";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import {makeStyles} from "@material-ui/core/styles";
import {useHttp} from "../hooks/http.hook";
import NoItems from "./NoItems";
import BodyComment from "./BodyComment";


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

    const handleComments = (comment, countMaxPage) => {
        const newComments = comments.slice()
        if (comments.length > 0) {
            if (comments.length === 2) {
                newComments.pop()
                newComments.unshift(comment)
            } else if (comments.length === 1) {
                newComments.unshift(comment)
            }
        } else {
            newComments.push(comment)
        }
        setMaxPage(countMaxPage)
        setComments(newComments)
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
            if (r.comments) {
                setComments(r.comments)
            }
            if (r.maxPage) {
                setMaxPage(r.maxPage)
            }
        }).catch(() => {

        })
    }, [request, commentPage,comments,filmId])

    return (
        <div>
            <BodyComment filmId={filmId} setComments={handleComments}/>
            {!loading ? (<div>
                {comments.length===0 ? <NoItems error={error}/> : <div>
                    <ul className="list-unstyled">
                        {comments.map((comment =>
                                <li id={comment._id}>
                                    <Comment comment={comment}/>
                                </li>
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