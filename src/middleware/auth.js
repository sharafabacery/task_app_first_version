const jwt = require('jsonwebtoken')

const User = require('../models/user')


const auth = async (req, res, next) => {
    try {
        //header of req
        const token = req.header('Authorization').replace('Bearer ', '')
        
        //give us from req. header of him

        const decoded = jwt.verify(token, 'this is my new course')
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        }) //finding a user whose id and token is ok in array of token
        if (!user) {

            throw new Error()
        }
        req.token=token 
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({
            error: "please auth"
        })

    }


}



module.exports = auth