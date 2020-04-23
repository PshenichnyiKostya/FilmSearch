import React, {useContext, useRef, useState} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";
import {CircularProgress} from "@material-ui/core";
import CountryAutocomplete from "./CountryAutocomplete";
import RelatedFilmsAutocompleteComponent from "./RelatedFilmsAutocompleteComponent";
import ArtistsAutocompleteComponent from "./ArtistsAutocompleteComponent";
import axios from 'axios'

const UploadFilmComponent = () => {


    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [country, setCountry] = useState('')
    const [relatedFilms, setRelatedFilms] = useState([])
    const [artists, setArtists] = useState([])
    const [description, setDescription] = useState('')
    const [year, setYear] = useState(null)
    const fileInputRef = useRef()
    const {token} = useContext(AuthContext)
    const message = useMessage()

    const uploadFilm = async () => {
        setLoading(true)
        try {
            if (!token) {
                message("Вы не авторизованы", "red")
                setLoading(false)
            } else if (!name) {
                message("Заполните все данные", "red")
                setLoading(false)
            } else {
                let formData = new FormData()
                let relatedMoviesId = []
                relatedFilms.map(value => relatedMoviesId.push(value._id))
                let artistsId = []
                artists.map(value => artistsId.push(value._id))
                formData.append('name', name)
                formData.append('year', year)
                formData.append('file', file)
                formData.append('country', country)
                formData.append('relatedMovies', relatedMoviesId)
                formData.append('artists', artistsId)
                formData.append('description', description)

                const data = await axios.post(`api/films`, formData, {
                    headers: {
                        'Authorization': `JWT ${token}`
                    }
                }).catch(e => {
                    message(e.response.data.message, "red")
                })

                message(data.data.message, "green")
                setYear(null)
                setDescription('')
                setFile(null)
                setArtists([])
                setRelatedFilms([])
                setName('')
                document.getElementById('fileNameFilm').value = ''
                fileInputRef.current.value = null
                setLoading(false)
            }
        } catch (e) {
            setLoading(false)
        }
    }

    const handleCountry = (value) => {
        console.log(value)
        setCountry(value)
    }
    const handleArtists = (value) => {
        console.log(value)
        setArtists(value)
    }

    const handleName = (event) => {
        setName(event.target.value)
    }

    const handleYear = (event) => {
        setYear(event.target.value)
    }

    const handleDescription = (event) => {
        if (event.target.value.length <= 700) {
            setDescription(event.target.value)
        }
    }

    const handleFile = (event) => {
        setFile(event.target.files[0])
    }

    const handleRelatedFilms = (value) => {
        console.log(value)
        setRelatedFilms(value)
    }


    return (
        <div>
            <div className="input-field col s6 padding-artist-params">
                <i className="material-icons prefix">account_circle</i>
                <input id="icon_prefix" placeholder='Название' type="text" className="validate"
                       onChange={handleName}
                       value={name}>
                </input>
            </div>
            <div className="input-field col s6 padding-artist-params">
                <i className="material-icons prefix">date_range</i>
                <input id="icon_prefix" placeholder='Год' type="number" className="validate"
                       onChange={handleYear}
                       value={year}>
                </input>
            </div>

            <div className="input-field  padding-artist-params">
                <i className="material-icons prefix">description</i>
                <textarea name="message"
                          id="icon_prefix"
                          className="materialize-textarea"
                          onChange={handleDescription}
                          placeholder='Описание'
                          value={description}
                          maxLength={700}/>
                {/*<label htmlFor="textarea2">Описание</label>*/}

                <div className='right'>
                    {`${description.length}/700`}
                </div>
            </div>

            <div className="file-field input-field" style={{paddingTop: "10px"}}>
                <div className="btn">
                    <i className="material-icons">file_upload</i>
                    <input ref={fileInputRef} type="file" accept="image/*"
                           onChange={handleFile}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" id='fileNameFilm' type="text"
                           placeholder="Загрузите постер фильма"/>
                </div>
            </div>

            <div className='padding-film-params' style={{paddingTop: "20px"}}>
                <CountryAutocomplete callback={handleCountry}/>
            </div>

            <div className='padding-film-params' style={{paddingTop: "20px"}}>
                <RelatedFilmsAutocompleteComponent callback={handleRelatedFilms}/>
            </div>

            <div className='padding-film-params' style={{paddingTop: "20px"}}>
                <ArtistsAutocompleteComponent callback={handleArtists}/>
            </div>

            {loading && <div className='center'><CircularProgress color="secondary"/></div>}
            <div className='center' style={{"padding-top": '60px'}}>
                <a className="waves-effect waves-light btn-large" onClick={uploadFilm}><i
                    className="material-icons left">send</i>Сохранить</a>
            </div>
        </div>
    )
}

export default UploadFilmComponent