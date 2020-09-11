const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    async createUser(req, res) {
        try {
            const { email, firstName, lastName, password } = req.body

            const existentUser = await User.findOne({email})
            if(!existentUser) {
                const hashedPassword = await bcrypt.hash(password, 10)
                const userResponse = await User.create({
                    firstName,
                    lastName,
                    email: email,
                    password: hashedPassword
                })

                return jwt.sign({ user: userResponse }, 'secret', (err, token) => {
					return res.json({
						user: token,
						user_id: userResponse._id
					})
				})
            }
            return res.status(400).json({
                message: 'email/user already exists. Do you want to login instead?'
            })
        } catch (err) {

            throw Error(`Error while registering new user: ${err}`)
        }
    },
    // Create very similar method
    async getUserById(req, res) {
        // Earlier we were retrieving the JSON body as request. Now we get the params. We will get whole object
        // but we will use object destructuring and get only the userId
        const { userId } = req.params

        try {
            const user = await User.findById(userId)
            return res.json(user)
        } catch(error) {
            return res.status(400).json({
                // This will be handy to handle from frontend to reroute and register client
                message: 'User ID does not exist. Do you want to register?' 
            })
        }
    }
}