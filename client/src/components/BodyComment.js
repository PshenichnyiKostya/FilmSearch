import React, {useContext, useState} from "react"
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";

const BodyComment = ({filmId, setComments}) => {
    const message = useMessage()
    const [bodyComment, setBodyComment] = useState('')
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()

    const handleBodyComment = (event) => {
        if (event.target.value.length <= 500) {
            setBodyComment(event.target.value)
        }
    }

    const handleComment = async () => {
        try {
            if (!token) {
                message("Вы не авторизованы", "red")
            } else if (bodyComment.length === 0) {
                message("Нельзя оставлять пустой комментарий", "red")
            } else {
                const data = await request(`/api/comments/${filmId}`, 'POST', {
                    bodyComment
                }, {
                    'Authorization':
                        `JWT ${token}`,
                    'Context-Type': 'Application/json'
                })
                message(data.message, "green")
                setBodyComment('')
                setComments(data.comment, data.maxPage)
            }
        } catch (e) {

        }
    }

    return (
        <div className="row">
            <div className="input-field col s12">
                                        <textarea name="message"
                                                  className="materialize-textarea"
                                                  onChange={handleBodyComment}
                                                  value={bodyComment}
                                                  maxLength={500}/>
                <label htmlFor="textarea2">Твой комментарий</label>
            </div>
            <div className='right'>
                {`${bodyComment.length}/500`}
            </div>
            <button disabled={loading} className="btn waves-effect waves-light" onClick={handleComment}
                    onSubmit={false}>
                Отправить &#10148;
            </button>
        </div>
    )
}
export default BodyComment
