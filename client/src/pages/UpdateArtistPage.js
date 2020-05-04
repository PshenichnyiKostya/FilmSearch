import React, {useContext, useEffect, useRef, useState} from "react";
import {CircularProgress} from "@material-ui/core";
import DatePicker from "react-datepicker";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";
import {useHttp} from "../hooks/http.hook";
import AlertDialogUpdateComponent from "../components/AlertDialogUpdateComponent";
import AlertDialogComponent from "../components/AlertDialogComponent";
import axios from "axios";
import {useHistory} from "react-router-dom";

const UpdateArtistPage = ({...props}) => {

    const [date, setDate] = useState(null)
    const [file, setFile] = useState(null)
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [dialogTitle, setDialogTitle] = useState('')
    const {request} = useHttp()
    const fileInputRef = useRef()
    const {token} = useContext(AuthContext)
    const message = useMessage()
    const history = useHistory()

    const handleChangeDate = (date) => {
        setDate(date)
    }

    const handleName = (event) => {
        setName(event.target.value)
    }
    const handleFile = (event) => {
        setFile(event.target.files[0])
    }


    const handleClose = () => {
        setOpen(false)
    }


    const handleClose2 = () => {
        setOpen2(false)
    }

    useEffect(() => {
        const func = async () => {
            const {artistId} = props.match.params
            try {
                const data = await request(`/api/artists/${artistId}`, 'GET')
                return data
            } catch (e) {
                return e.message
            }
        }
        func().then(r => {
            let date = new Date(r.artist.birthday)
            setDate(date)
            setName(r.artist.name)
        })
    }, [props.match.params, request, token])
    const updateArtistDialog = () => {
        if (file) {
            setDialogTitle(`Вы действительно хотите сохранить данные изменения?`)
            setOpen2(true)
        } else {
            setDialogTitle(`Вы не выбрали файл. Нажмите "удалить", если хотите удалить аватарку актера и сохранить изменения. Нажмите "оставить", если хотите сохранить изменения и оставить старую аватарку актера`)
            setOpen(true)
        }

    }

    const handleUpdateArtist = async () => {
        setLoading(true)
        try {
            if (!token) {
                message("Вы не авторизованы", "red")
                setLoading(false)
            } else if (!name || !date) {
                message("Заполните все данные", "red")
                setLoading(false)
            } else {
                let formData = new FormData()
                formData.append('name', name)
                formData.append('birthday', date)
                formData.append('file', file)
                formData.append('isUpdateFile', true)
                const data = await axios.put(`/api/artists/${props.match.params.artistId}`, formData, {
                    headers: {
                        'Authorization': `JWT ${token}`
                    }
                }).catch(e => {
                    message(e.response.data.message, "red")
                })
                message(data.data.message, "green")
                setLoading(false)
                history.push('/artists/?page=1')
                // alert('pushed')
            }
        } catch (e) {
            setLoading(false)
        }
    }
    const handleUpdateArtistWithAvatar = async () => {
        setLoading(true)
        try {
            if (!token) {
                message("Вы не авторизованы", "red")
                setLoading(false)
            } else if (!name || !date) {
                message("Заполните все данные", "red")
                setLoading(false)
            } else {
                let formData = new FormData()
                formData.append('name', name)
                formData.append('birthday', date)
                formData.append('file', file)
                formData.append('isUpdateFile', false)
                const data = await axios.put(`/api/artists/${props.match.params.artistId}`, formData, {
                    headers: {
                        'Authorization': `JWT ${token}`
                    }
                }).catch(e => {
                    message(e.response.data.message, "red")
                })
                message(data.data.message, "green")
                setLoading(false)
                history.push('/artists/?page=1')
                // alert('pushed')
            }
        } catch (e) {
            setLoading(false)
        }
    }

    return (
        <div>
            {!name || !date ? <div className='center'><CircularProgress сolor="secondary"/></div> :
                <div className='date-height'>
                    <div className="center">
                        <p className="flow-text"> Редактирование</p>
                    </div>
                    <div className="input-field col s6 padding-artist-params">
                        <i className="material-icons prefix">account_circle</i>
                        <input id="icon_prefix" placeholder='Имя' type="text" className="validate"
                               onChange={handleName}
                               value={name}>
                        </input>
                    </div>

                    <div className="input-field col s6 padding-artist-params">
                        <i className="material-icons prefix margin-icon-date">date_range</i>
                        <div className='padding-date'>
                            <DatePicker
                                showPopperArrow={false}
                                selected={date}
                                onChange={handleChangeDate}
                                dateFormat="yyyy/MM/dd"
                                placeholderText="Дата рождения"
                                shouldCloseOnSelect={false}
                            />
                        </div>
                    </div>


                    <div className="file-field input-field">
                        <div className="btn">
                            <i className="material-icons">file_upload</i>
                            <input ref={fileInputRef} type="file" accept="image/*"
                                   onChange={handleFile}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" id='fileNameArtist' type="text"
                                   placeholder="Загрузите фотографию актера"/>
                        </div>
                    </div>

                    {loading && <div className='center'><CircularProgress color="secondary"/></div>}
                    <div className='center' style={{"padding-top": '50px'}}>
                        <a className="waves-effect waves-light btn-large" onClick={updateArtistDialog}><i
                            className="material-icons left">send</i>Сохранить</a>
                    </div>

                </div>}
            <AlertDialogUpdateComponent open={open}
                                        toClose={handleClose}
                                        dialogTitle={dialogTitle}
                                        dialogDescription='Это изменение вернуть назад будет невозможно!'
                                        confirmDialog={handleUpdateArtist}
                                        noConfirmDialog={handleUpdateArtistWithAvatar}
                                        thirdButton='Назад'
                                        acceptText='Удалить'
                                        cancelText='Оставить'
            />
            <AlertDialogComponent open={open2}
                                  toClose={handleClose2}
                                  dialogTitle={dialogTitle}
                                  dialogDescription='Это изменение вернуть назад будет невозможно!'
                                  confirmDialog={handleUpdateArtist}
                                  acceptText='Да'
                                  cancelText='Нет'
            />
        </div>
    )
}


export default UpdateArtistPage