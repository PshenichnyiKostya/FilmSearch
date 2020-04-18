import React, {useContext, useRef, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";
import axios from 'axios';
import {CircularProgress} from "@material-ui/core";

const UploadArtistComponent = () => {


    const [date, setDate] = useState(null)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const fileInputRef = useRef()
    const {token} = useContext(AuthContext)
    const message = useMessage()

    const handleChangeDate = (date) => {
        setDate(date)
    }

    const uploadArtist = async () => {
        setLoading(true)
        try {
            if (!token) {
                message("Вы не авторизованы", "red")
                setLoading(false)
            } else if (!name || !date || !file) {
                message("Заполните все данные", "red")
                setLoading(false)
            } else {
                let formData = new FormData()
                formData.append('name', name)
                formData.append('date', date)
                formData.append('file', file)
                const data = await axios.post(`api/artists`, formData, {
                    headers: {
                        'Authorization': `JWT ${token}`
                    }
                }).catch(e => {
                    message(e.response.data.message, "red")
                })
                message(data.data.message, "green")
                setDate(null)
                setFile(null)
                setName('')
                document.getElementById('fileNameArtist').value = ''
                fileInputRef.current.value = null
                setLoading(false)
            }
        } catch (e) {
            setLoading(false)
        }
    }
    const handleName = (event) => {
        setName(event.target.value)
    }
    const handleFile = (event) => {
        setFile(event.target.files[0])
    }


    return (
        <div className='date-height'>
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
                        placeholderText="Выберите дату"
                        shouldCloseOnSelect={false}
                    />
                </div>
            </div>


            <div className="file-field input-field">
                <div className="btn">
                    <i className="material-icons">file_upload</i>
                    <input ref={fileInputRef} type="file" id='uploadImageArtist' accept="image/*"
                           onChange={handleFile}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" id='fileNameArtist' type="text"
                           placeholder="Загрузите фотографию актера"></input>
                </div>
            </div>

            {loading && <div className='center'><CircularProgress color="secondary"/></div>}
            <div className='center' style={{"padding-top": '50px'}}>
                <a className="waves-effect waves-light btn-large" onClick={uploadArtist}><i
                    className="material-icons left">send</i>Сохранить</a>
            </div>
        </div>
    )
}

export default UploadArtistComponent