import {Router} from 'express'
import Comment from "../models/Comment";
import passport from "passport";
import Film from "../models/Film";

const commentsRouter = Router()

commentsRouter.get('/:filmId', async (req, res) => {
    const limit = 2
    try {
        console.log(req.params.filmId)
        let page = parseInt(req.query.page)
        if (page <= 0 || isNaN(page)) {
            return res.status(404).json({message: "Комментарии не найдены"})
        }
        const startIndex = (page - 1) * limit
        try {
            let resultModels = await Comment.find({film: req.params.filmId}).limit(limit).skip(startIndex).populate('user', 'clientName')

            if (resultModels.length === 0) {
                return res.status(404).json({message: "Комментарии не найдены"})
            }
            const size = await Comment.find().countDocuments()
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
commentsRouter.post('/', passport.authenticate('jwt'), async (req, res) => {

})
export default commentsRouter