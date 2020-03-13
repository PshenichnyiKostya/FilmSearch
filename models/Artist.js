import {Schema, model, Types} from 'mongoose'


const Artist = new Schema({
    name: {type: String, required: true},
    films: [{type: Schema.Types.ObjectId, ref: 'Film', default: []}],
    age: {type: Number, required: true},
})

export default model('Artist', Artist)