import {Schema, model, Types} from 'mongoose'
import crypto from "crypto";


const User = new Schema({
    salt: {type: String},
    passwordHash: {type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    type: {type: String, default: "User"},
    clientName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
})

User.virtual("password")
    .set(function (password) {
        this._plainPassword = password;
        if (password) {
            this.salt = crypto.randomBytes(128).toString("base64");
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, "sha1");
        } else {
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(function () {
        return this._plainPassword;
    });
User.methods.checkPassword = function (password) {
    if (!password) return false;
    if (!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, "sha1").toString() === this.passwordHash;
};
export default model('User', User)