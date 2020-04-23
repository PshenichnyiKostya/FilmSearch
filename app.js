import express from 'express'
import config from 'config'
import mongoose from 'mongoose'
import authRouter from "./routes/auth"
import filmRouter from "./routes/films"
import artistRouter from "./routes/artists"
import ratingRouter from './routes/rating'
import configurePassport from "./middlewares/passport"
import bodyParser from 'body-parser'
import logger from "morgan"
import cors from "cors";
import passport from "passport";
import commentsRouter from "./routes/comments";
import multer from 'multer'

configurePassport(passport)

const app = express()
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(cors());
app.use(passport.initialize());
app.use(multer({dest: "client/src/uploads"}).single("file"));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/api/auth', authRouter);
app.use('/api/films', filmRouter);
app.use('/api/artists', artistRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/ratings', ratingRouter);

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`Server has been started on PORT ${PORT}...`)
        })
    } catch (e) {
        console.log(`Server error ${e.mean}!!!`)
        process.exit(1)
    }
}

start().then();




