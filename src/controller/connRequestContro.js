const ConnectionRequest = require('../models/connRequest')
const User = require('../models/user')

const connectionRequestIntersted = async (req , res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.userId
        const status = req.params.status
        const allowedStatus = ['interested','ignored']
        if(!allowedStatus.includes(status)){
            return res.status(200).send({ message: 'Not allowed you to connect'});
        }
        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(200).send({ message: 'User not found '});
        }

        const existingUser = await ConnectionRequest.findOne({
            $or :[
                {fromUserId , toUserId },
                {fromUserId:toUserId , toUserId:fromUserId}
            ]
        })
        if(existingUser){
            return res.status(200).send({ message: "Connection request already exits"});
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
          });
    
        const data = await connectionRequest.save();
        res.status(200).send({ message: req.user.firstname+ " is " + status + " in " + toUser.firstname, data });
    } catch (error) {
        res.status(400).send({error: error.message})
    }
}

const connectionAcceptedRejected = async (req , res) =>{
    try {
        const loggedUser = req.user
        const {status , requestId} = req.params
        const allowedStatus = ['accepted','rejected']
        if(!allowedStatus.includes(status)){
            return res.status(404).send({message: 'Invalid Status'})
        }
        const connectionRequest  = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId : loggedUser._id,
            status: "interested"
        })
        if(!connectionRequest){
            return res.status(404).send({message: 'Connection request not found'})
        }
        connectionRequest.status = status
        await connectionRequest.save()

        return res.status(200).send({message: 'Request Accepted Successfully'})

    } catch (error) {
       return res.status(400).send({error: error.message})
    }
}
module.exports = {connectionRequestIntersted,connectionAcceptedRejected}