import {Router} from 'express'
import Film from "../models/Film";
import paginatedResults from "../middlewares/paginatedResults";
import Artist from "../models/Artist";

const filmRouter = Router()

filmRouter.get('/', paginatedResults(Film, 2), async (req, res) => {
    try {
        return res.status(200).json({films: res.pagenatedResults, maxPage: res.maxPage})
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }

})
filmRouter.get('/artist/:artistId', async (req, res) => {
    try {
        await Artist.findById(req.params.artistId).populate({
            path: 'films',
            select: 'name'
        }).then(artist => {
            return res.status(200).json({artist: artist})
        })
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})
filmRouter.post('/:artistId', async (req, res) => {
    try {
        const films = await Film.find({})
        const artist = await Artist.findById(req.params.artistId)
        await artist.updateOne({$push: {films: films[1]._id}})
        return res.status(200).json({artist: artist})
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})
export default filmRouter