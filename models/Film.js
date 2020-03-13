import {Schema, model} from 'mongoose'

const Film = new Schema({
    name: {type: String, required: true},
    ratings: [{type: Schema.Types.ObjectId, ref: 'Rating', default: []}],
    artists: [{type: Schema.Types.ObjectId, ref: 'Artist', default: []}],
    country: {type: String, default: "Unknown"},
})


export default model('Film', Film)