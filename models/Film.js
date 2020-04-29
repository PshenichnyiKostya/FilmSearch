import {model, Schema} from 'mongoose'

const Film = new Schema({
    name: {type: String, required: true},
    rating: {type: Number, default: null},
    artists: [{type: Schema.Types.ObjectId, ref: 'Artist', default: []}],
    country: {type: String, default: null},
    description: {type: String, default: null},
    relatedMovies: [{type: Schema.Types.ObjectId, ref: 'Film', default: []}],
    year: {type: Number, default: null},
    clicks: {type: Number, default: 0},
    image: {type: String}
})


export default model('Film', Film)