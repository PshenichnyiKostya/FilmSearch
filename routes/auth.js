import {Router} from 'express'
import User from "../models/User"
import {check, validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'
import config from 'config'
import passport from 'passport'

const authRouter = Router()

authRouter.post(
    '/register',
    [
        check('email', ' Некорректный email').isEmail(),
        check('password', 'Пароль должен содержать как минимум 6 символов').isLength({min: 6}),
    ],
    (async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при регистрации"
                })
            }
            const {email, password, type = "User"} = req.body
            const user = await User.findOne({email})
            if (user) {
                return res.status(400).json({message: 'Такой пользователь уже существует'})
            } else {
                const newUser = new User({
                    email,
                    type,
                    password,
                })
                const savedUser = await newUser.save()
                const payload = {
                    id: savedUser._id,
                    type: savedUser.type,
                    email: savedUser.email,
                }
                const token = jwt.sign(payload, config.get('secret'), {
                    expiresIn: "7d"
                })
                return res.status(201).json({message: "Вы успешно зарегистрированы!", userInfo: payload, token})
            }

        } catch (e) {
            res.status(500).json({message: "Что-то пошло не так!("})
        }
    }))

authRouter.post('/login',
    [
        check('email', 'Введите корректный email').isEmail(),
        check('password', 'Введите пароль').exists(),
    ],
    (async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при авторизации"
                })
            }
            await passport.authenticate("local", function (err, user, message) {
                if (user === false) {
                    return res.status(400).json({message: "Такого пользователя не существует("})
                } else {
                    const payload = {
                        id: user._id,
                        name: user.name,
                        type: user.type,
                        login: user.login
                    }
                    const token = jwt.sign(payload, config.get('secret'), {
                        expiresIn: "7d"
                    })
                    return res.status(200).json({userInfo: payload, token, message})
                }
            })(req)
        } catch (e) {
            res.status(500).json({message: "Что-то пошло не так!("})
        }
    }))


export default authRouter