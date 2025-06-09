const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    email: { type: String },
    active: { type: Boolean },
    dateCreated: { type: Date },
    dateModified: { type: Date },
    token: { type: String }
}, { collection: 'users', timestamps: true })

module.exports = mongoose.model('users', UsersSchema)