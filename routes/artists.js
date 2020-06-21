import {Router} from 'express'
import Artist from "../models/Artist";
import passport from "passport";
import User from "../models/User";
import Film from "../models/Film";
import fs from "fs";

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
            return res.status(200).json({artists: pagenatedResults, maxPage: maxPage, curPage: page})
        } catch (e) {
            res.status(500).json({message: e.message})
        }

    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})

artistRouter.get('/all', async (req, res) => {
    try {
        const artists = await Artist.find({})
        return res.status(200).json({artists: artists})
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

artistRouter.post('/', passport.authenticate('jwt'), async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.type !== "Admin") {
            return res.status(401).json({message: "Вы не авторизованы как администратор"})
        }
        const {name, date} = req.body
        const newArtist = new Artist({
            name,
            birthday: date,
            image: req.file.path.substr(req.file.path.indexOf('u'))
        })
        await newArtist.save()
        return res.status(200).json({message: "Актер добавлен"})
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }


})

artistRouter.delete('/:artistId', passport.authenticate('jwt'), async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.type !== "Admin") {
            return res.status(401).json({message: "Вы не авторизованы как администратор"})
        }
        const artist = await Artist.findById(req.params.artistId)
        if (!artist) {
            return res.status(400).json({message: "Актер не найден"})
        } else {
            if (artist.image) {
                try {
                    fs.unlinkSync(`client/src/${artist.image}`)
                } catch (e) {
                    return res.status(500).json({message: "Что-то пошло не так!("})
                }
            }
            await Film.find({artists: {"$in": [artist]}}).updateMany({$pull: {artists: artist._id}})
            await artist.deleteOne()
            return res.status(200).json({message: "Актер успешно удален"})
        }
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})

artistRouter.put('/:artistId', passport.authenticate('jwt'), async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.type !== "Admin") {
            return res.status(401).json({message: "Вы не авторизованы как администратор"})
        }
        const artist = await Artist.findById(req.params.artistId)
        if (!artist) {
            return res.status(400).json({message: "Актер не найден"})
        } else {
            const {isUpdateFile, name, birthday} = req.body
            const file = req.file
            if (!name || !birthday) {
                return res.status(400).json({message: "Указаны не все данные"})
            }

            if (isUpdateFile === 'true') {
                if (artist.image) {
                    try {
                        fs.unlinkSync(`client/src/${artist.image}`)
                    } catch (e) {
                        return res.status(500).json({message: "Что-то пошло не так!("})
                    }
                }
                if (file) {
                    await artist.updateOne({name, birthday, image: file.path.substr(req.file.path.indexOf('u'))})
                } else {
                    await artist.updateOne({name, birthday, image: file})
                }
            } else {
                await artist.updateOne({name, birthday})
            }
            return res.status(200).json({message: 'Актер успешно изменен'})
        }
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }
})

export default artistRouter