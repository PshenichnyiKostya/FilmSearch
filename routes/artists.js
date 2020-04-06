import {Router} from 'express'
import Artist from "../models/Artist";

const artistRouter = Router()

artistRouter.get('/', async (req, res) => {
    const limit = 4
    try {
        const filterParam = req.query.sort
        let page = parseInt(req.query.page)
        if (page === 0 || isNaN(page)) {
            return res.status(404).json({message: "Контента на данной странице нет("})
        }
        const startIndex = (page - 1) * limit
        try {
            let resultModels
            switch (filterParam) {
                case 'name':
                    resultModels = await Artist.find().sort('name').limit(limit).skip(startIndex).populate('films')
                    break
                case 'birthday':
                    resultModels = await Artist.find().sort('birthday').limit(limit).skip(startIndex).populate('films')
                    break
                case 'filmsCount':
                    resultModels = await Artist.find().sort('-films').limit(limit).skip(startIndex).populate('films')
                    break
                case 'clicks':
                    resultModels = await Artist.find().sort('-clicks').limit(limit).skip(startIndex).populate('films')
                    break
                default:
                    resultModels = await Artist.find().limit(limit).skip(startIndex).populate('films')
            }

            if (resultModels.length === 0) {
                return res.status(404).json({message: "Контента на данной странице нет("})
            }
            const size = await Artist.find().countDocuments()
            const pagenatedResults = resultModels
            const maxPage = Math.ceil(size / limit)
            return res.status(200).json({artists: pagenatedResults, maxPage: maxPage})
        } catch (e) {
            res.status(500).json({message: e.message})
        }

    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})
artistRouter.get('/:artistId', async (req, res) => {
    try {
        await Artist.findByIdAndUpdate(req.params.artistId, {$inc: {clicks: 1}}).populate({
            path: 'films',
            select: 'name country year rating'
        }).then(async artist => {
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