import {Router} from 'express'
import Comment from "../models/Comment";
import passport from "passport";
import User from "../models/User";
import Film from "../models/Film";

const commentsRouter = Router()

commentsRouter.get('/:filmId', async (req, res) => {
    const limit = 2
    try {
        let page = parseInt(req.query.page)
        if (page <= 0 || isNaN(page)) {
            return res.status(400).json({message: "Комментарии не найдены"})
        }
        const startIndex = (page - 1) * limit
        try {
            let resultModels = await Comment.find({film: req.params.filmId}).limit(limit).skip(startIndex).sort('-timestamp').populate('user', 'clientName')

            if (resultModels.length === 0) {
                return res.status(400).json({message: "Комментарии не найдены"})
            }
            const size = await Comment.find({film: req.params.filmId}).countDocuments()
            const pagenatedResults = resultModels
            const maxPage = Math.ceil(size / limit)
            return res.status(200).json({comments: pagenatedResults, maxPage: maxPage})
        } catch (e) {
            res.status(500).json({message: e.message})
        }

    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})
commentsRouter.post('/:filmId', passport.authenticate('jwt'), async (req, res) => {
    const limit = 2
    try {
        if (req.body.bodyComment.length > 500) {
            return res.status(400).json({message: "Максимальная длина комментария 500 символов"})
        }
        if (req.body.bodyComment.length === 0) {
            return res.status(400).json({message: "Пожалуйста, введите комментарий в текстовое поле"})
        }
        const user = await User.findById(req.user)
        if (!user) {
            return res.status(401).json({message: "Вы не авторизованы"})
        }
        const film = await Film.findById(req.params.filmId)
        if (!film) {
            return res.status(400).json({message: "Фильм не найден"})
        }
        const comment = new Comment({
            body: req.body.bodyComment,
            user,
            film,
            timestamp: new Date()
        })
        await comment.save()
        const size = await Comment.find({film: req.params.filmId}).countDocuments()
        const maxPage = Math.ceil(size / limit)
        return res.status(200).json({message: "Комментарий успешно добавлен", comment: comment, maxPage})
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})

commentsRouter.delete('/delete',async(req,res)=>{
    await Comment.find({}).deleteMany()
    return res.status(200).json({message: "Ура"})
})
export default commentsRouter