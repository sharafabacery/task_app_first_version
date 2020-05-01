const moongoose = require('mongoose')
//const vlidator = require('validator')

const TaskSchema = new moongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: moongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Tasks = moongoose.model('Tasks', TaskSchema)


module.exports = Tasks