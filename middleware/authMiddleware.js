const { response, request } = require('express')
const jwt = require('jsonwebtoken')


exports.requireAuth = async(request, response, next)=>{
    const bearerToken = request.headers.authorization && request.headers.authorization.split(' ')[1]
    const cookieToken = request.cookies.access_token
    
    const access_token = bearerToken || cookieToken
    try {
        if(!access_token){throw Error('Unauthorized')}
            
        const decoded_token = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)
        request.user = decoded_token
        next()
    } catch (error) {
        response.status(403).json({message: 'Login to continue'})
    }

}
