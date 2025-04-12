const validateProfileData = (req) =>{
    const allowed_Updates = ["firstName","lastName","emailId","photoUrl","gender","age","about","skill"]
    const isUpdateAllowed = Object.keys(req.body).every((key)=>allowed_Updates.includes(key))
    if(!isUpdateAllowed){
      throw new Error('Invalid input. Please provide the correct details.');
    }
    return isUpdateAllowed
}

module.exports = {
    validateProfileData
}