const Users = require('../models/Users')
const jwt = require('jsonwebtoken')

module.exports.auth = async (req, res) => {

    const validPassword = req.body.password === process.env.LOGIN_PASSWORD ? true : false
    const doc = await Users.findOne({ email: { '$regex': new RegExp(req.body.email, 'i') } }, { _id: 0, email: 1, active: 1 })

    if (validPassword && doc && doc.active) {
        const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })

        Users.findOneAndUpdate({ email: req.body.email }, { $set: { token: token } }, (err, r) => {
            if (err) {
                return res.status(500).json({ err: true, message: 'Server Error: cannot authorize user' })
            }
            return res.status(200).json({ err: false, token })
        })

    } else {
        return res.status(401).json({ err: true, message: 'User is not authorized on PROGRAM-PMI' })
    }

}

module.exports.validateToken = (req, res, next) => {
    const token = req.headers.authorization.replace('Bearer ', '')

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ err: true, message: 'Invalid token' })
        }
        next()
    })
}