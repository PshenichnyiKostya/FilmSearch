import {Router} from 'express'
import Film from "../models/Film";
import User from "../models/User";
import Rating from "../models/Rating";
import passport from "passport";
import Artist from "../models/Artist";
import Comment from "../models/Comment";
import fs from 'fs'

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
                    resultModels = await Film.find().sort({name: 1}).limit(limit).skip(startIndex).populate('relatedMovies', 'name image')
                    break
                case 'rating':
                    resultModels = await Film.find().sort('-rating').limit(limit).skip(startIndex).populate('relatedMovies', 'name image')
                    break
                case 'date':
                    resultModels = await Film.find().sort('-year').limit(limit).skip(startIndex).populate('relatedMovies', 'name image')
                    break
                case 'clicks':
                    resultModels = await Film.find().sort('-clicks').limit(limit).skip(startIndex).populate('relatedMovies', 'name image')
                    break
                default:
                    resultModels = await Film.find().limit(limit).skip(startIndex).populate('relatedMovies', 'name image')
            }

            if (resultModels.length === 0) {
                return res.status(404).json({message: "Контента на данной странице нет("})
            }
            const size = await Film.find().countDocuments()
            const pagenatedResults = resultModels
            const maxPage = Math.ceil(size / limit)
            return res.status(200).json({films: pagenatedResults, maxPage: maxPage, curPage: page})
        } catch (e) {
            res.status(500).json({message: e.message})
        }

    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }

})

filmRouter.get('/all', async (req, res) => {
    try {
        const films = await Film.find({})
        console.log(films)
        return res.status(200).json({films: films})
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})

filmRouter.post('/', passport.authenticate('jwt'), async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.type !== "Admin") {
            return res.status(401).json({message: "Вы не авторизованы как администратор"})
        }
        const {name, artists, country, description, relatedMovies, year} = req.body

        const newFilm = new Film({
            name,
            artists: artists ? artists.split(',') : [],
            country,
            description,
            relatedMovies: relatedMovies ? relatedMovies.split(',') : [],
            year,
            image: req.file.path.substr(req.file.path.indexOf('u'))
        })

        artists.split(',').map(async value => await Artist.findById(value).then(async res => {
            await res.updateOne({$push: {films: newFilm._id}})
        }))
        await newFilm.save()

        return res.status(200).json({message: "Фильм добавлен"})
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }


})

filmRouter.get('/:filmId', async (req, res) => {
    try {
        await Film.findByIdAndUpdate(req.params.filmId, {$inc: {clicks: 1}}).populate('relatedMovies').populate('artists').then(film => {
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
    try {
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

})

filmRouter.delete('/:filmId', passport.authenticate('jwt'), async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.type !== "Admin") {
            return res.status(401).json({message: "Вы не авторизованы как администратор"})
        }
        const film = await Film.findById(req.params.filmId)
        if (!film) {
            console.log('1')
            return res.status(400).json({message: "Фильм не найден"})
        } else {
            if (film.image) {
                try {
                    fs.unlinkSync(`client/src/${film.image}`)
                } catch (e) {
                    return res.status(500).json({message: "Что-то пошло не так!("})
                }
            }
            await Comment.find({film: film}).deleteMany()
            await Artist.find({films: {"$in": [film]}}).updateMany({$pull: {films: film._id}})
            await Rating.find({film: film}).deleteMany()
            await film.deleteOne()
            return res.status(200).json({message: "Фильм успешно удален"})
        }
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})

filmRouter.put('/:filmId', passport.authenticate('jwt'), async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.type !== "Admin") {
            return res.status(401).json({message: "Вы не авторизованы как администратор"})
        }
        const film = await Film.findById(req.params.filmId)
        if (!film) {
            return res.status(400).json({message: "Фильм не найден"})
        } else {
            const {isUpdateFile, name, country, description, relatedMovies, year, artists} = req.body
            const file = req.file
            if (!name || !year) {
                return res.status(400).json({message: "Указаны не все данные"})
            }

            let relatedMoviesArray
            if (relatedMovies) {
                relatedMoviesArray = relatedMovies.split(',')
            } else {
                relatedMoviesArray = null
            }

            relatedMoviesArray ? relatedMoviesArray.forEach(value => {
                if (value === req.params.filmId) {
                    return res.status(400).json({message: "Фильм не может быть похож сам на себя"})
                }
            }) : undefined

            if (isUpdateFile === 'true') {
                if (film.image) {
                    try {
                        fs.unlinkSync(`client/src/${film.image}`)
                    } catch (e) {
                        return res.status(500).json({message: "Что-то пошло не так!("})
                    }
                }
                if (file) {
                    await film.updateOne({
                        name,
                        year,
                        image: file.path.substr(req.file.path.indexOf('u')),
                        relatedMovies: relatedMoviesArray ? relatedMoviesArray : [],
                        artists: artists ? artists.split(',') : [],
                        description,
                        country
                    })
                } else {
                    await film.updateOne({
                        name,
                        year,
                        image: file,
                        relatedMovies: relatedMoviesArray ? relatedMoviesArray : [],
                        artists: artists ? artists.split(',') : [],
                        description,
                        country
                    })
                }
            } else {
                await film.updateOne({
                    name,
                    year,
                    relatedMovies: relatedMoviesArray ? relatedMoviesArray : [],
                    artists: artists ? artists.split(',') : [],
                    description,
                    country
                })
            }
            return res.status(200).json({message: 'Фильм успешно изменен'})
        }
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})

export default filmRouter