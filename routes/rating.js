import {Router} from 'express'
import passport from "passport";
import Film from "../models/Film";
import Rating from "../models/Rating";
import User from "../models/User";

const ratingRouter = Router()

ratingRouter.post('/:filmId', passport.authenticate("jwt"), async (req, res) => {
    try {
        if (req.body.mark < 1 || req.body.mark > 10) {
            return res.status(400).json({message: "Оценка должна быть от 1 до 10"})
        }
        const film = await Film.findById(req.params.filmId)
        if (!film) {
            return res.status(400).json({message: "Фильм не найден"})
        }
        const rating = await Rating.findOne({user: req.user, film: req.params.filmId})
        const user = await User.findById(req.user)
        if (rating) {
            const numRatings = await Rating.find({film: req.params.filmId}).countDocuments()
            const totalRating = (req.body.mark - rating.mark) / numRatings + film.rating
            await film.updateOne({
                rating: totalRating
            })
            await rating.updateOne({
                mark: req.body.mark
            })
            return res.status(200).json({message: "Оценка изменена", mark: req.body.mark})
        }

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
ratingRouter.delete('/:filmId', passport.authenticate("jwt"), async (req, res) => {
    try {
        const film = await Film.findById(req.params.filmId)
        if (!film) {
            return res.status(400).json({message: "Фильм не найден"})
        }
        const rating = await Rating.findOne({user: req.user, film: req.params.filmId})
        if (rating) {
            const numRatings = await Rating.find({film: req.params.filmId}).countDocuments()
            let totalRating
            if (numRatings === 1) {
                totalRating = 0
            } else {
                totalRating = (film.rating - rating.mark) / (numRatings - 1) + film.rating
            }
            await film.updateOne({
                rating: totalRating
            })
            await rating.remove()
            return res.status(200).json({message: "Оценка удалена"})
        } else {
            return res.status(400).json({message: "Оценка еще не выставлена"})
        }
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})
ratingRouter.get('/:filmId', passport.authenticate('jwt'), async (req, res) => {
    try {
        const film = await Film.findById(req.params.filmId)
        if (!film) {
            return res.status(400).json({message: "Фильм не найден"})
        }
        const rating = await Rating.findOne({user: req.user, film: req.params.filmId})
        if (rating) {
            return res.status(200).json({mark: rating.mark})
        } else {
            return res.status(400).json({message: "Оценка еще не выставлена"})
        }
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})
export default ratingRouter