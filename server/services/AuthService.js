const jwt = require('jsonwebtoken')

class AuthService {

	// TODO add logic for getting user roles

	createJWT = (uid) => {
		const token = jwt.sign({
		  name: uid,
		  roles: []
		}, process.env.JWT_SECRET_KEY, { expiresIn: '3h' });

		return token
	}

}

module.exports = new AuthService()
