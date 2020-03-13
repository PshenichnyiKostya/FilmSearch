import {Schema, model} from 'mongoose'

const Rating = new Schema({
    mark: {type: Number, require: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
})


export default model('Rating', Rating)