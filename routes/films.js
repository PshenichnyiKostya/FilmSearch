import {Router} from 'express'
import Film from "../models/Film";
import Artist from "../models/Artist";
import User from "../models/User";
import Rating from "../models/Rating";
import passport from "passport";

const filmRouter = Router()

filmRouter.get('/', async (req, res) => {
    const limit = 2
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
                    resultModels = await Film.find().sort({name: 1}).limit(limit).skip(startIndex).populate('relatedMovies', 'name')
                    break
                case 'rating':
                    resultModels = await Film.find().sort('-rating').limit(limit).skip(startIndex).populate('relatedMovies', 'name')
                    break
                case 'date':
                    resultModels = await Film.find().sort('-year').limit(limit).skip(startIndex).populate('relatedMovies', 'name')
                    break
                default:
                    resultModels = await Film.find().limit(limit).skip(startIndex).populate('relatedMovies', 'name')
            }

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
filmRouter.post('/ratings/:filmId', passport.authenticate("jwt"), async (req, res) => {
    if (req.user) {
        try {
            console.log(req.user)
            if (req.body.mark < 1 || req.body.mark > 10) {
                return res.status(400).json({message: "Оценка должна быть от 1 до 10"})
            }
            const film = await Film.findById(req.params.filmId)
            if (!film) {
                return res.status(400).json({message: "Фильм не найден"})
            }
            const rating = await Rating.findOne({user: req.user, film: req.params.filmId})
            if (rating) {
                return res.status(400).json({message: "Оценка уже выставлена"})
            }
            const user = await User.findById(req.user)
            const newRating = new Rating({
                mark: req.body.mark,
                user,
                film,
            })
            const numRatings = await Rating.find({film: req.params.filmId}).countDocuments()
            const totalRating = (req.body.mark - (film.rating !== null ? film.rating : 0)) / (numRatings + 1) + (film.rating !== null ? film.rating : 0)
            await film.updateOne({
                rating: totalRating
            })
            await newRating.save()
            return res.status(200).json({message: "Оценка добавлена", mark: req.body.mark, totalRating: totalRating})
        } catch (e) {
            return res.status(500).json({message: "Что-то пошло не так!("})
        }
    } else {
        return res.status(401).json({message: "Вы не авторизировались на сайте"})
    }
})
export default filmRouter