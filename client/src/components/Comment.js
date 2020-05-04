import React, {useContext, useEffect, useState} from "react"
import {TextField} from "@material-ui/core";
import AlertDialogComponent from "./AlertDialogComponent";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";
import {useHttp} from "../hooks/http.hook";

const Comment = ({comment,deleteComment}) => {

    const [open, setOpen] = useState(false)
    const {token} = useContext(AuthContext)
    const message = useMessage()
    const {request, loading, error, clearError} = useHttp()

    const MONTH_NAMES = [
        'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
        'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
    ];

    useEffect(() => {
        message(error, "red")
        clearError()
    }, [error, message, clearError])

    const inputProps = {
        background: "white",
        color: "black"
    };


    const dialogTitle = `Вы действительно хотите удалить комментарий "${comment.body.length > 50 ? comment.body.substr(0, 50) +
        '..' : comment.body}"?`

    function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
        const day = date.getDate();
        const month = MONTH_NAMES[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        if (prefomattedDate) {
            return `${prefomattedDate} в ${hours}:${minutes}`;
        }

        if (hideYear) {
            return `${day} ${month} в ${hours}:${minutes}`;
        }

        return `${day} ${month} ${year} в ${hours}:${minutes}`;
    }


    function timeAgo(dateParam) {
        if (!dateParam) {
            return null;
        }

        const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
        const DAY_IN_MS = 86400000;
        const today = new Date();
        const yesterday = new Date(today - DAY_IN_MS);
        const seconds = Math.round((today - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const isToday = today.toDateString() === date.toDateString();
        const isYesterday = yesterday.toDateString() === date.toDateString();
        const isThisYear = today.getFullYear() === date.getFullYear();


        if (seconds < 5) {
            return 'now';
        } else if (seconds < 60) {
            return `${seconds} секунд назад`;
        } else if (seconds < 90) {
            return 'минуту назад';
        } else if (minutes < 60) {
            if (minutes % 10 === 2 || minutes % 10 === 3 || minutes % 10 === 4)
                return `${minutes} минуты назад`;
            if (minutes % 10 === 1) {
                return `${minutes} минуту назад`;
            }
            return `${minutes} минут назад`;
        } else if (isToday) {
            return getFormattedDate(date, 'сегодня');
        } else if (isYesterday) {
            return getFormattedDate(date, 'вчера');
        } else if (isThisYear) {
            return getFormattedDate(date, false, true);
        }

        return getFormattedDate(date);
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleDeleteComment = async () => {
        try {
            const data = await request(`/api/comments/${comment._id}`, 'DELETE', {}, {
                'Authorization':
                    `JWT ${token}`,
                'Context-Type': 'Application/json'
            })
            deleteComment()
            message(data.message, "green")
        } catch (e) {

        }
    }

    return (
        <div>
            <li key={comment._id} className='media'>
                <img src={require('../uploads/avatar.png')} className="mr-3 avatar-img" alt="..." width={80}
                     height={80}/>
                <div className="media-body">
                    <h5 className="mt-0 mb-1">{comment.user.clientName}</h5>
                    <div className='delete-film-red'>
                        <a onClick={handleOpen}>
                            <i className="material-icons right">delete</i>
                        </a>
                    </div>
                    <p>
                        <h10>{timeAgo(comment.timestamp)}</h10>
                    </p>

                    <p>
                        <TextField
                            multiline
                            value={comment.body}
                            fullWidth
                            inputProps={inputProps}
                            color="primary"
                            InputProps={{
                                style: {
                                    color: "black"
                                }
                            }}
                            variant="outlined"
                            disabled
                        />
                    </p>
                </div>
            </li>
            <AlertDialogComponent open={open}
                                  toClose={handleClose}
                                  dialogTitle={dialogTitle}
                                  dialogDescription='Это изменение вернуть назад будет невозможно!'
                                  confirmDialog={handleDeleteComment}
                                  acceptText='Да'
                                  cancelText='Нет'
            />
        </div>
    )
}
export default Comment