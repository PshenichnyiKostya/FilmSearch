import LocalStrategy from "passport-local"
import passportJwt from "passport-jwt"
import User from '../models/User'
import jwt from "jsonwebtoken";

import config from 'config'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

export default passport => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                session: false
            },
            function (email, password, done) {
                User.findOne({email}, (err, user) => {
                    if (err) {
                        return done(err)
                    }
                    if (!user || !user.checkPassword(password)) {
                        return done(null, false, {
                            message: "Пользователь не найден("
                        });
                    }
                    return done(null, user)
                })
            }
        )
    )

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.get('secret')
    };


    passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
            User.findById(payload.id, (err, user) => {
                if (err) {
                    return done(err)
                }
                if (user) {
                    done(null, {
                        _id: user._id,
                        email: user.email,
                        type: user.type,
                    })
                } else {
                    done(null, false)
                }
            })
        })
    )

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

}