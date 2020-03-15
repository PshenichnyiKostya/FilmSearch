export default function (model, limit) {
    return async (req, res, next) => {
        let page = parseInt(req.query.page)
        // let limit = parseInt(req.query.limit)
        if (page === 0 || isNaN(page)) {
            page = 1
        }
        const startIndex = (page - 1) * limit
        try {
            const resultModels = await model.find().limit(limit).skip(startIndex).exec()
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