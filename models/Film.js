import {model, Schema} from 'mongoose'

const Film = new Schema({
    name: {type: String, required: true},
    rating: {type: Number, default: null},
    artists: [{type: Schema.Types.ObjectId, ref: 'Artist', default: []}],
    country: {type: String, default: "Неизвестно"},
    description: {type: String, default: "Описание отсутствует"},
    relatedMovies: [{type: Schema.Types.ObjectId, ref: 'Film', default: []}],
    year: {type: Number, default: null},
})


export default model('Film', Film)