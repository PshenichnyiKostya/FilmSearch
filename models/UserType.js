import {Schema, model} from 'mongoose'

const UserType = new Schema({
    name: {type: String, require: true},
})

export default model('UserType', UserType)