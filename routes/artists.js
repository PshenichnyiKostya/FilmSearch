import {Router} from 'express'
import paginatedResults from "../middlewares/paginatedResults";
import Artist from "../models/Artist";

const artistRouter = Router()

artistRouter.get('/', paginatedResults(Artist, 4), async (req, res) => {
    try {
        return res.status(200).json({artists: res.pagenatedResults, maxPage: res.maxPage})
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})
artistRouter.get('/:artistId', async (req, res) => {
    try {
        await Artist.findById(req.params.artistId).populate({
            path: 'films',
            select: 'name country year'
        }).then(artist => {
            if (!artist) {
                return res.status(404).json({message: "Актер не найден"})
            }
            return res.status(200).json({artist: artist})
        })
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})
artistRouter.post('/', async (req, res) => {
    const {name} = req.body
    const artist = new Artist({
        name,
    })
    const savedArtist = await artist.save()
    return res.status(200).json({artist: savedArtist})

})
export default artistRouter