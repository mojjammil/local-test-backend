const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User');

module.exports = {
    async store(req, res) {
        try {
            // Get the email and password from request body
            const { email, password } = req.body;

            // Check if both input fields have been filled
            if (!email || !password) {
                return res.status(200).json({ message: "Required field missing!" })
            }

            // Find the provided email in our User database
            const user = await User.findOne({ email });

            // Check if user exists. If not, ask to register as response
            if (!user) {
                return res.status(200).json({ message: "User not found! Do you want to register instead?" })
            }

            // Check if user and password combo matches
            // The password we will receive from server will be the hashed password so we need to decrypt and compare
            if (user && await bcrypt.compare(password, user.password)) {
                const userResponse = {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
                return jwt.sign({ user: userResponse }, 'secret', (err, token) => {
					return res.json({
						user: token,
						user_id: userResponse._id
					})
				})
                // return res.json(userResponse)
            } else {
                return res.status(200).json({ message: "Email or Password does not match!" })
            }


        } catch (error) {
            throw Error(`Error while authenticating a User ${error}`)
        }
    }
}