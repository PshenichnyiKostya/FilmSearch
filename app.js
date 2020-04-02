import express from 'express'
import config from 'config'
import mongoose from 'mongoose'
import authRouter from "./routes/auth"
import filmRouter from "./routes/films"
import artistRouter from "./routes/artists"
import configurePassport from "./middlewares/passport"
import bodyParser from 'body-parser'
import logger from "morgan"
import cors from "cors";
import passport from "passport";

configurePassport(passport)

const app = express()
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(cors());
app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/films', filmRouter);
app.use('/api/artists', artistRouter);

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
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




