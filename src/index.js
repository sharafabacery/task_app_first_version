//express middleware cutmize our behavior server


const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();

const PORT = process.env.PORT || 3000

// app.use((req,res,next)=>{
// if (req.method==='GET') {
//     res.send('Get requests are disable')
// }else{
//     next()
// }
// })//before going to toute

// app.use((req, res, next) => {
//     res.status(503).send()
// })

app.use(express.json()) //used to parse any json file automate

//custmize router for work make it one with express app
//to make express use our router
app.use(userRouter)
app.use(taskRouter)



app.listen(PORT, () => {
    console.log(PORT)
})
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const myfunction = async () => {
//     const password = 'red123!'
//     //store hash password
//     //function return promise
//     //second args to how many algo will work
//     const hashedPassword = await bcrypt.hash(password, 8) //best 8
//     console.log(password)
//     console.log(hashedPassword)
//     //compare passwords

//     const isMatch = await bcrypt.compare('red123!', hashedPassword)
//     console.log(isMatch)

// }
// const myfunction2 = async () => {
//     //create //hide data create data
//     //expire 
//     const token = jwt.sign({
//         _id: 'abc'
//     }, 'thisismycourse', {
//         expiresIn: '7 days'
//     }) //return authotication token data uniquee data
//     console.log(token)
//     //veify
//     const data = jwt.verify(token, 'thisismycourse')
//     console.log(data)


// }
//myfunction2( )

//jsonwebtoken
// const pet={
//     name:'Hal'
// }
// pet.toJSON=function () {
//     //tojson send this data
//     console.log(this)
//     return this
// }
// console.log(JSON.stringify(pet))
// const Task=require('./models/task')
// const User=require('./models/user')

// const main=async()=>{
//     // const task=await Task.findById('5ea5e822480f1f10287618a1')
//     // await task.populate('owner').execPopulate()//get the user how is assoctaite with task
//     // console.log(task);
//     //5ea5e47123bb623d809ea9f4
//     const user=await User.findById('5ea5e47123bb623d809ea9f4')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()

const multer=require('multer')
const upload=multer({
    dest:'images',//where images store
    limits:{
        //bytes
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        // cb(new Error('ffffffffffffff'))
        // cb(undefined,true)//accepted
        if (!file.originalname.match(/\.(doc|docx)$/)) {//find regular exp
            return cb(Error('word doc'))
        }
        cb(undefined,true)//accepted

    }
})
// const errorMiddleware=(req,res,next)=>{
//     throw new Error("error")
// }
// //post request to upload image
// //middleware for upload photo in multer
// app.post('/upload',upload.single('upload'),(req,res)=>{//configured to accrpt and save files find file called upload to upload
//     res.send()
// },(error,req,res,next)=>{
//     //handle error
//     res.status(400).send({error:error.message})
// })