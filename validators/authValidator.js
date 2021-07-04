const { response } = require('express')
const {check, validationResult} = require('express-validator')

exports.validatePassword = check('password')
                                .notEmpty()
                                .withMessage('Password is required')
                                .isLength({min: 6})
                                .withMessage('Password must be at least 6 characters long')
                                .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/)
                                .withMessage('Password must have atleast 1 uppercase, 1 lowercase letter and 1 number')

exports.validateEmail = check('email')
                            .notEmpty()
                            .withMessage('Email is required')
                            .isEmail()
                            .withMessage('Invalid email'), 

exports.validateLoginData = [this.validateEmail, this.validatePassword]

exports.validateSignupData = [this.validateEmail, this.validatePassword]

exports.verifyValidationResults = (request, response, next)=>{
    console.log(request.body)
    const {errors} = validationResult(request)
    if(errors.length > 0){
        return response.status(400).json({message: errors[0].msg})
    }else{
        next()
    }
}