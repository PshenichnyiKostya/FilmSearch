import React, {useContext, useEffect, useState} from "react"
import BeautyStars from "beauty-stars";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";

const RatingFilm = ({filmId}) => {
    const [rating, setRating] = useState(0)
    const {request} = useHttp()
    const {token} = useContext(AuthContext)
    const message = useMessage()

    const handleDeleteRating = async () => {
        try {
            if (!token) {
                message("Вы не авторизованы", "red")
            } else {
                await request(`/api/ratings/${filmId}`, 'DELETE', {}, {
                    'Authorization':
                        `JWT ${token}`,
                    'Context-Type': 'Application/json'
                })
                setRating(0)
            }
        } catch (e) {
            return e.message
        }
    }
    useEffect(() => {
        const func = async () => {
            try {
                if (token) {
                    const data = await request(`/api/ratings/${filmId}`, 'GET', null, {
                        'Authorization':
                            `JWT ${token}`,
                        'Context-Type': 'Application/json'
                    })
                    return data
                }
                return null
            } catch (e) {
                return e.message
            }
        }
        func().then(r => {
            if (r && r.mark) {
                setRating(r.mark)
            }
        }).catch(() => {

        })
    }, [request,filmId,token])
    const handleRating = async (value) => {
        try {
            if (!token) {
                message("Вы не авторизованы", "red")
            } else {
                const data = await request(`/api/ratings/${filmId}`, 'POST', {
                    mark: value
                }, {
                    'Authorization':
                        `JWT ${token}`,
                    'Context-Type': 'Application/json'
                })
                setRating(data.mark)
                message(data.message, "green")
            }
        } catch (e) {

        }
    }
    return (
        <div>
            <BeautyStars
                value={rating}
                onChange={handleRating}
                maxStars={10}
            />
            <br/>
            {rating > 0 ? <a className='delete-film-red' onClick={handleDeleteRating}>
                <h10>Удалить оценку</h10>
            </a> : null}
        </div>
    )
}
export default RatingFilm
