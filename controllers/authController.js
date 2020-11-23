const User = require('../models/User')

//handle errors
const handleErrors = function(err){
    let errors = {email: '', password: ''}

    //duplicate error
    if(err.code == 11000){
        errors.email = 'Email is already registered'
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach((e)=>{
            errors[e.path] = e.message
        })
    }
    return errors
}

module.exports.signup_get = (req,res) =>{
    res.render('signup')
}

module.exports.signup_post = async(req,res) =>{
    const {email, password} = req.body

    try{
        const user = await User.create({email, password})
        res.status(201).json(user)
    }catch(err){
        errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

module.exports.login_get = async(req,res) =>{
    res.render('login')
}

module.exports.login_post = (req,res) =>{
    res.send('new login')
}