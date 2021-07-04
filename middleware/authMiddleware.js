const jwt = require('jsonwebtoken')
const User = require('../models/User')


exports.requireAuth = async(request, response, next)=>{
    const access_token = request.headers.authorization && request.headers.authorization.split(' ')[1]
    console.log(access_token)
    try {
        if(!access_token){throw Error('Unauthorized')}

        const decoded_token = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findOne({email: decoded_token.email})
        if(user.token_version != decoded_token.token_version){throw Error('Unauthorized')}
        request.user = user
        next()
    } catch (error) {
        response.status(403).json({message: 'Login to continue'})
    }

}
