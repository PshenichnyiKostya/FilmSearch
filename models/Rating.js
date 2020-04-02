import {model, Schema} from 'mongoose'

const Rating = new Schema({
    mark: {type: Number, require: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    film: {type: Schema.Types.ObjectId, ref: 'Film', required: true}
})


export default model('Rating', Rating)