const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const handleUserSignUp = async (req, res) => {
	try {
		const { username, location } = req.body;

		// make API call to diamante to get wallet address
		const wallet_address = '0xabc...xyz';

		// Check whether the email is already registered
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: 'User already exist' });
		}

		// Check for valid username
		if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
			return res.status(400).json({ error: 'Invalid username' });
		}

		// Create a new user
		const newUser = new User({ username, wallet_address, location });
		await newUser.save();

		// Generate a JWT token with payload data
		const token = jwt.sign(
			{ userId: newUser._id, username: newUser, username },
			process.env.JWT_SECRET_KEY
		);

		res.status(201).json({
			result: newUser,
			access_token: token,
			message: 'User registered successfully',
		});
	} catch (error) {
		console.error('Error registering user:', error);
		res.status(500).json({ error: error.message });
	}
};

const handleUserLogin = async (req, res) => {
	try {
		const { username } = req.body;

		// Check if the user exists
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(401).json({ error: "User doesn't exist" });
		}

		// Generate a JWT token with payload data
		const token = jwt.sign(
			{ userId: user._id, username: user.username },
			process.env.JWT_SECRET_KEY
		);

		res
			.status(200)
			.json({ result: user, access_token: token, message: 'User logged in' });
	} catch (error) {
		console.error('Error logging in:', error);
		res.status(500).json({ error: error.message });
	}
};

module.exports = { handleUserLogin, handleUserSignUp };