import express from 'express'
import config from 'config'
import mongoose from 'mongoose'
import authRouter from "./routes/auth"
import configurePassport from "./config/password"
import passport from "passport"
import bodyParser from 'body-parser'
import logger from "morgan"

const app = express()
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api/auth', authRouter);
configurePassport(passport)
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




