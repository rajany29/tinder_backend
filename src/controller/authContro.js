const User = require('../models/user')
const bcrypt = require('bcrypt')

const register = async (req , res) =>{
    try {
        const { firstname,lastname,emailId,password } = req.body
        const passwordHash = await bcrypt.hash(password,10)        
        const user = new User({firstname,lastname,emailId,password:passwordHash})
        await user.save()
        res.status(201).send({ message: 'User added successfully'});
    } catch (error) {
        return res.status(400).send({ message: 'Validation Error', error: error.message });
    }
}

const login = async (req , res) =>{
    try {
        const {emailId,password } = req.body
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).send({ message: 'Invalid Credentials'});
        }
        const isMatch = await user.validatePassword(password);
        
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid Credentials'});
        }
        const usertoken = await user.getJWT()
        res.cookie('token',usertoken)
        res.status(200).send({ message: 'Login successful' });
    } catch (error) {
        return res.status(400).send({ message: 'Validation Error', error: error.message });
    }
}

const logout = async (req , res) => {
    res.cookie('token', null , {
        expires: new Date(0)
    })
    res.status(200).send({ message: 'Logged out successfully' })
}


module.exports = {
    register , login , logout
}