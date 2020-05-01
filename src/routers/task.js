const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router() //custmize router for work make it one with express app


//update particle res
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((Element) =>
        allowedUpdates.includes(Element)
    )
    if (!isValid) {
        return res.status(400).send({
            "error": "error"
        })
    }

    try {

        //run validator to check for the valid
        // const user = await Task.findByIdAndUpdate(_id, req.body, {
        //     new: true,
        //     runValidators: true
        // })
        const user = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!user) {
            return res.status(404).send()
        }
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})
//limit result skip itreator
//third arg option
router.get('/tasks', auth, async (req, res) => {
     const match={}
     const sort={}
     if (req.query.completed) {
         match.completed=req.query.completed==='true'
     }
     if(req.query.sortBy){
         const parts=req.query.sortBy.split(':')
         console.log(parts)
         sort[parts[0]]=parts[1]==='desc'?-1:1
         
     }
    try {
        //const tasks = await Task.find({owner:req.user.id})
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),//string to int//2task will render
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
    //all users
})
router.get('/tasks/:id', async (req, res) => {
    //route parameters
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)

    } catch (error) {
        res.status(500).send()
    }

}) //dynamic
router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    //copy properties in req.body
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send()

    }

})
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        //const user = await Task.findByIdAndDelete(req.params.id)
        //const task=await Task.findOneAndDelete({_id:req.params._id,owner:req.user._id})
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
module.exports = router