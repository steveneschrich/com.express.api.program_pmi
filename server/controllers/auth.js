const Users = require('../models/Users')
const jwt = require('jsonwebtoken')
const ldap = require('ldapjs')
const AuthService = require('../services/AuthService')

module.exports.auth = (req, res) => {

console.log(req.body)

    const dn = 'dc=phsu-mcc,dc=moffitt,dc=org'
    const context = `ou=users,${dn}`

    const LDAP_RESPONSE_OBJ = {
        header: 'LDAP Response',
        err: false,
        message: '',
        authenticatedResult: false,
        token: null
    }

    const uid = req.body.email
    const password = req.body.password

    const client = ldap.createClient({
        url: ['ldap://impactme', 'ldap://0.0.0.0'],
        connectTimeout: 10000,
        reconnect: true
    })

    client.on('error', err => {
        console.log('connection error')
        console.log(err)
        LDAP_RESPONSE_OBJ.err = true
        LDAP_RESPONSE_OBJ.authenticatedResult = false
        LDAP_RESPONSE_OBJ.message = 'Connection error.  Check authentication server is running'
        return res.status(500).json(LDAP_RESPONSE_OBJ)
    })

    client.on('connect', connection => {
        console.log('connected to LDAP server')
    })

    const opts = {
        filter: `(uid=${uid})`,
        scopt: 'sub',
        attributes: ['dn', 'uid', 'cn', 'mail']
    }

    client.bind(`cn=${uid},${context}`, password, (bindErr,bindRes) => {

        if (bindErr) {
	    console.log(bindErr)
            LDAP_RESPONSE_OBJ.err = true
            LDAP_RESPONSE_OBJ.authenticatedResult = false
            LDAP_RESPONSE_OBJ.message = bindErr.lde_message
            return res.status(401).json(LDAP_RESPONSE_OBJ)
        }

        const token = AuthService.createJWT(uid)
        // TODO write token to mongo

        LDAP_RESPONSE_OBJ.authenticatedResult = true
        LDAP_RESPONSE_OBJ.token = token

        return res.status(200).json(LDAP_RESPONSE_OBJ)

        /*
        // code block for searching against LDAP server
        client.search(`${context}`, opts, (searchErr, searchRes) => {

            // TODO add searchErr handler here
            if (searchErr) {
                return res.status(401).json()
            }
            
            searchRes.on('error', (err) => {
                console.error('error: ' + err.message)
            })

            searchRes.on('end', (result) => {
                console.log('end')
                console.log(result)
                console.log('status: ' + result.status)
            })
        })
        */

    })
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

module.exports.authSimple = async (req, res) => {

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
