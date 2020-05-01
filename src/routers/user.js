const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp=require('sharp')
const multer = require('multer')
const upload = multer({
   // dest: 'avatar', //where images store
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
           cb( Error("error"))
        }
        cb(undefined,true)
    }
})
const router = new express.Router() //custmize router for work make it one with express app

//tokens to make user can made any request jwt
router.post('/users', async (req, res) => {
    const me = new User(req.body)
    try {
        await me.save()
        const token = await me.genrateAuthToken()
        res.status(201).send({
            me,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }

})
//vlidate file size type
//without avatar image will throw to post function
router.post('/users/me/avatar',auth, upload.single('avatar'),async (req, res) => {
  const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()//access
  req.user.avatar=  buffer//bin of data
 
  await req.user.save()
    res.send()
},(error,req,res,next)=>{
    //handle error
    res.status(400).send({error:error.message})
})
router.delete('users/me/avatar',auth,async(req,res)=>{
    
    // if (req.user.avatar) {
    req.user.avatar=undefined    
    // }
    await req.user.save()
    res.status(200).send()
})
router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        if (!user||!user.avatar) {
            throw new Error()
        }
        //header setup
        res.set('Content-Type','image/png')//def application/json
        res.send(user.avatar)


    } catch (error) {
        res.status(404).send()
    }
})


router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.genrateAuthToken()
        //send obj to json
        res.send({
            user,
            token
        })

    } catch (error) {
        res.status(400).send()

    }

})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }

})
//before run async function
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})
//dynamic

//update particle res
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((Element) =>
        allowedUpdates.includes(Element)
    )
    if (!isValid) {
        return res.status(400).send({
            "error": "error"
        })
    }

    try {
        const user = req.user
        //await User.findById(req.params.id) //access to its values
        updates.forEach((update) =>
            user[update] = req.body[update]
        )
        await user.save()

        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router