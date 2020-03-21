import {model, Schema} from 'mongoose'


const Artist = new Schema({
    name: {type: String, required: true},
    films: [{type: Schema.Types.ObjectId, ref: 'Film', default: []}],
    // birthday: {type: Schema.Types.Date, required: true},
    birthday: {type: Schema.Types.Date, default: new Date()},
})

export default model('Artist', Artist)