const express = require('express')
const app = express()
const {connectdb} = require('./src/dbconfig/database')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const authRouter = require('./src/routes/authRout')
const profileRouter = require('./src/routes/profileRout')
const connRestRouter = require('./src/routes/connReqRout')
const userRouter = require('./src/routes/userRout')

const User = require('./src/models/user')
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',connRestRouter)
app.use('/',userRouter)


app.get('/user' , async (req, res) =>{
    const email = req.body.emailId
    try {
        const users = await User.find({ emailId: email })
        if(users.length === 0){
            res.status(404).send({ error: 'Email ID is not Found'})
        }
        else{
            res.send(users)
        }
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

app.get('/feed' , async (req , res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;

    try {
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }
        const user = await User.findByIdAndDelete(userId); 
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).send({ error: error.message});
    }
});


app.patch('/user/:userId' ,async (req,res) => {
    const userId = req.params?.userId
    const data = req.body;
    try {
        const allowed_Updates = ['age','gender','photoUrl','about','skill']
        const isUpdateAllowed = Object.keys(data).every((key)=>allowed_Updates.includes(key))
        if(!isUpdateAllowed){
            throw new Error('Update is not allowed')
        }
        const user = await User.findByIdAndUpdate({_id : userId} , data ,{returnDocument : "after" , runValidators : true});
        res.status(201).send({ message: 'User updated Successfully'});
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {   
        res.status(400).send({error: error.message});
    }
})


const PORT = process.env.PORT || 5000; 

connectdb()
    .then(() => {
        console.log('DB is connected successfully.......');
        app.listen(PORT, () => { 
            console.log(`Server is listening at http://localhost:${PORT}`);
        });
        })
    .catch((err) => {
        console.error('DB Connection Error:', err.message); 
    });



