import {Router} from 'express'
import Film from "../models/Film";
import paginatedResults from "../middlewares/paginatedResults";

const filmRouter = Router()

filmRouter.get('/', paginatedResults(Film, 3), async (req, res) => {
    try {
        return res.status(200).json({films: res.pagenatedResults, maxPage: res.maxPage})
    } catch (e) {
        return res.status(500).json({message: "Что-то пошло не так!("})
    }

})
export default filmRouter