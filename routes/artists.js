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
artistRouter.post('/', async (req, res) => {
    const {name} = req.body
    console.log(req.body)
    const artist = new Artist({
        name,
    })
    const savedArtist = await artist.save()
    return res.status(200).json({artist: savedArtist})

})
export default artistRouter