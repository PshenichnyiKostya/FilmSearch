import {Router} from 'express'
import Film from "../models/Film";
import Artist from "../models/Artist";

const filmRouter = Router()

filmRouter.get('/', async (req, res) => {
    const limit = 2
    try {
        let page = parseInt(req.query.page)
        if (page === 0 || isNaN(page)) {
            return res.status(404).json({message: "Контента на данной странице нет("})
        }
        const startIndex = (page - 1) * limit
        try {
            const resultModels = await Film.find().limit(limit).skip(startIndex).populate('relatedMovies', 'name')
            if (resultModels.length === 0) {
                return res.status(404).json({message: "Контента на данной странице нет("})
            }
            const size = await Film.find().countDocuments()
            const pagenatedResults = resultModels
            const maxPage = Math.ceil(size / limit)
            return res.status(200).json({films: pagenatedResults, maxPage: maxPage})
        } catch (e) {
            res.status(500).json({message: e.message})
        }

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
filmRouter.get('/:filmId', async (req, res) => {
    try {
        await Film.findById(req.params.filmId).populate({
            path: 'relatedMovies',
            select: 'name'
        }).then(film => {
            if (!film) {
                return res.status(404).json({message: "Фильм не найден"})
            }
            return res.status(200).json({film: film})
        })
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})
export default filmRouter