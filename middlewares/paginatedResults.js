export default function (model, limit) {
    return async (req, res, next) => {
        let page = parseInt(req.query.page)
        if (page === 0 || isNaN(page)) {
            return res.status(404).json({message: "Контента на данной странице нет("})
        }
        const startIndex = (page - 1) * limit
        try {
            const resultModels = await model.find().limit(limit).skip(startIndex).exec()
            if (resultModels.length === 0) {
                return res.status(404).json({message: "Контента на данной странице нет("})
            }
            const size = await model.find().countDocuments()
            res.pagenatedResults = resultModels
            res.maxPage = Math.ceil(size / limit)
            res.curPage = page
            next()
        } catch (e) {
            res.status(500).json({message: e.message})
        }
    }
}