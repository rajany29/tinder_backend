const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authUser =async (req,res,next) =>{
  try {
    const {token} = req.cookies
    
    if(!token){
        throw new Error('Invalid Token')
    }
    const decodedToken = await jwt.verify(token ,process.env.SECRET_JWTKEY)
    const {_id} = decodedToken
    const user = await User.findById({_id})
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }
    req.user = user
    next()
  } catch (error) {
    res.status(400).send({error: error.message})
  }
}

module.exports = {authUser}