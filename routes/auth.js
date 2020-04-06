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
        check('password', 'Пароль как минимум 6 символов').isLength({min: 6}),
        check('password2', 'Пароль как минимум 6 символов').isLength({min: 6}),
        check('clientName', 'Имя как минимум 4 символа').isLength({min: 4}),
    ],
    (async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при регистрации <br/>" + errors.array()[0].msg
                })
            }
            const {email, password, type = "User", password2, clientName} = req.body
            const myErrors = []

            await User.findOne({email}).then(user => {
                if (user) {
                    myErrors.push({message: 'Такой email уже существует'})
                }
            })
            if (password !== password2) {
                myErrors.push({message: "Пароли не совпадают"})
            }
            await User.findOne({clientName}).then(user => {
                if (user) {
                    myErrors.push({message: "Такое имя уже существует"})
                }
            })
            if (myErrors.length > 0) {
                return res.status(400).json({message: "Некорректные данные при регистрации <br/> " + myErrors[0].message})
            } else {
                const newUser = new User({
                    email,
                    type,
                    password,
                    clientName,
                })
                const savedUser = await newUser.save()
                const payload = {
                    id: savedUser._id,
                    type: savedUser.type,
                    email: savedUser.email,
                    clientName: savedUser.clientName,
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
                    message: "Некорректные данные при авторизации <br/>" + errors.array()[0].msg
                })
            }
            await passport.authenticate("local", function (err, user, message) {
                if (user === false) {
                    return res.status(400).json({message: "Такого пользователя не существует("})
                } else {
                    const payload = {
                        id: user._id,
                        clientName: user.clientName,
                        type: user.type,
                        email: user.email
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