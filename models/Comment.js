import {model, Schema} from 'mongoose'


const Comment = new Schema({
    body: {type: String, require: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    film: {type: Schema.Types.ObjectId, ref: 'Film', required: true},
    timestamp: {type: Date, default: new Date()},
})

export default model('Comment', Comment)