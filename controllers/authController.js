const User = require('../models/User')
const jwt = require('jsonwebtoken')
const nodeMailer = require('../utils/nodeMailer')
const { response } = require('express')

//handle errors
const handleErrors = function(err){
    let errors = {message: err.message}

    //duplicate error
    if(err.code == 11000){
        errors.message = 'Email is already registered'
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        errors.message = e.message
    }

    return errors
}

const createToken = (data, type)=>{
    if(type == 'access'){
        return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
    }else{
        return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET)
    }
}

const validate_refresh_token = async(user, refresh_token) =>{
    try{
        const decoded_token = await jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
        return decoded_token.token_version === user.token_version
    }catch(error){
        return false
    }
}

const get_token_expiry_date = ()=>{
    var today = new Date();
    today.setHours(today.getHours() + 1); // token life is 1hr, so expiry date is 1hr from now
    return today
}

module.exports.signup_get = (req,response) =>{
    response.render('signup')
}

module.exports.signup_post = async(req,response) =>{
    const {email, password} = req.body

    try{
        const user = await User.create({email, password})
        const access_token = createToken({_id: user._id, email: user.email}, 'access')
        const refresh_token = createToken({_id: user._id, email: user.email, token_version: user.token_version}, 'refresh')
        response.cookie('access_token', access_token, {httpOnly: true, maxAge: 24*60*60*1000})
        response.cookie('refresh_token', refresh_token, {httpOnly: true, maxAge: 365*24*60*60*1000})
        response.status(201).json({user, access_token, token_expiry_date: get_token_expiry_date()})
    }catch(err){
        errors = handleErrors(err)
        response.status(400).json(errors)
    }
}

module.exports.login_get = async(req,response) =>{
    response.render('login')
}

module.exports.login_post = async(req,response) =>{
    const {email, password, remember_me} = req.body
    let token_options = {
        httpOnly: true
    }

    try{
        let user = await User.findOne({email: email})
        console.log(user)
        if(!user) {
            throw Error('User not found')
        }
        let valid = await user.authenticate(password)
        if(valid){
            const access_token = createToken({_id: user._id, email: user.email}, 'access')
            const refresh_token = createToken({_id: user._id, email: user.email, token_version: user.token_version}, 'refresh')
            response.cookie('access_token', access_token, remember_me ? {...token_options, maxAge: 24*60*60*1000} : token_options) //not setting a maxAge makes this a session cookie
            response.cookie('refresh_token', refresh_token, remember_me ? {...token_options, maxAge: 365*24*60*60*1000} : token_options)
            response.status(201).json({user, access_token, token_expiry_date: get_token_expiry_date()})
        }else{
            response.status(403).json({message: 'Wrong password'})
        }
    }catch(error){
        errors = handleErrors(error)
        response.status(400).json(errors)
    }
}

exports.logout = async(request, response)=>{
    try {   
        const current_user = await User.findById(request.user._id)
        await current_user.update({token_version: current_user.token_version++})
        response.cookie('access_token', '', {maxAge: 1})
        response.cookie('refresh_token', '', {maxAge: 1})
        response.redirect('/')
    } catch (error) {
        response.status(400).json({message: 'Logged out succesfully'})
    }
}


exports.get_new_refresh_token = async(request, response)=>{
  
    try {
        const user = await User.findById(request.user._id)
        if(validate_refresh_token(user, request.cookies.refresh_token)){
            await user.update({token_version: user.token_version++})
            const access_token = createToken({_id: user._id, email: user.email}, 'access')
            response.cookie('access_token', access_token, {httpOnly: true, maxAge: 24*60*60*1000})
            response.status(200).json({access_token, token_expiry_date: get_token_expiry_date()})
        }else{
            throw Error('Invalid token')
        }
    
    } catch (error) {
        response.status(403).json({message: 'Invalid token'})
    }
}

exports.request_reset_password_get = async(request, response)=>{
    response.render('request_reset_password')
}


exports.request_reset_password_post = async(request, response)=>{
    try{
        let user = await User.findOne({email: request.body.email})
        if(!user){
            throw Error('User doesn\'t exist')
        }else{
            user.generatePasswordReset()
            user = await user.save()
            let email_body = user.generatePasswordResetEmailBody()
            let maildata = await nodeMailer.sendMail(user.email, 'Reset your password', email_body)
            response.json({message: `A password reset email has been sent to ${request.body.email}`})
        }
    }catch(error){
        response.status(400).json({status: false, message: error.message})
    }
}

exports.reset_password_get = async(request, response) => {
    let tokenExpired = false
    let user = await User.findOne({passwordResetToken: request.params.reset_token})
    if(Date.now() > user.passwordResetTokenExpiry){tokenExpired = true}
    response.render('reset_password', {tokenExpired: tokenExpired, user})
}

exports.reset_password_post = async(request, response) => {
    try{
        let user = await User.findOne({passwordResetToken: request.params.reset_token})
        console.log(user)
        if(!user){
            throw Error('User doesn\'t exist')
        }else{
            user.password = request.body.password
            user = await user.save()
            response.json({status: true, message: `Password reset successfully`})
        }
    }catch(error){
        response.status(400).json({status: false, message: error.message})
    }
}