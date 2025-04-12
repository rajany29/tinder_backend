const { validateProfileData } = require("../utils/validataion");
const bcrypt = require('bcrypt')

const getUserProfile  = async (req , res) => {
    try {
        const user = req.user
        res.status(200).send({ message: 'Profile Data', user });
    } catch (error) {
        res.status(400).send({error: error.message})
    }
}

const getUserProfileEdit = async (req, res) => {
    try {
        if(!validateProfileData(req)){
            return res.status(400).send({ message: 'Invalidated Profile Data'})
        }
        const loggedUser = req.user;
        Object.assign(loggedUser, req.body);

        // Object.keys(req.body).forEach((key)=>loggedUser[key] = req.body[key])
        await loggedUser.save()
        res.status(200).send({ message: `${loggedUser.firstname} your profile update successfully`});
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getProfileUpdatePassword = async (req , res) => {
    try {
        const newPassword = req.body.password
        if (!newPassword) {
            return res.status(400).send({ error: "New password is required" });
        }
        const newhashPassword = await bcrypt.hash(newPassword , 10)
        req.user.password = newhashPassword
        await req.user.save()
        res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}
module.exports = {getUserProfile , getUserProfileEdit , getProfileUpdatePassword }