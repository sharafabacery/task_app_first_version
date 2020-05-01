const moongoose = require('mongoose')
const vlidator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
//save tokken for user to give him abllity to login to multible devices
//diff tokken for each device
const userSchema = new moongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true, //index email
        validate(value) {
            if (!vlidator.isEmail(value)) {
            throw new Error('this is not email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
            throw new Error('must be not empty')
            }
        }

    },
    age: {
        type: Number,
        default: 0,

        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive num')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }

    }],
    avatar:{
        type:Buffer
    }
}, {
    timestamps: true
})

//virtual property
//way to make relaship
userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    //_id in Users==Owner in task
    foreignField: 'owner' //forign key
})
//make our new db method
//access from model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email: email
    })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
} //i need to made my own func.
//make new method for the user 
//instance
userSchema.methods.genrateAuthToken = async function () {
    const user = this //get our instance
    const token = jwt.sign({
        _id: user._id.toString()
    }, 'this is my new course')
    user.tokens = user.tokens.concat({
        token
    }) //add new tokken 
    await user.save()

    return token

}
//automate way on the user
//send obj to toJson to change pro. and send stringfy
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    //json to object
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
//cust. user model middlware
//register some fun. events before  
//method to turn on middleware pre before,post after
userSchema.pre('save', async function (next) {
    //document we save,indi
    const user = this
    //true update or post
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)

    }
    next()
})
userSchema.pre('remove', async function (params) {
    const owner = this._id
    await Task.deleteMany({
        owner
    })
    params()
})
const User = moongoose.model('User', userSchema)
module.exports = User