const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Please enter an email'],
        unique: [true, 'Email address already in use'],
        lowercase: true,
        validate: [
            {
                validator: (val)=>/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(val), 
                message: 'Please enter a valid email'
            }
        ]
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }, 
    token_version:{
        type: Number, 
        default: 0
    }, 
    passwordResetToken: {
        type: String,
    }, 
    passwordResetTokenExpiry: {
        type: Date
    }
},{timestamps: true})


// fire a function before doc saved to db
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){return next()}
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods = {
    authenticate: async function(password){
        let valid = await bcrypt.compare(password, this.password)
        return valid
    }, 
    generatePasswordReset: function() {
        this.passwordResetToken = crypto.randomBytes(20).toString('hex');
        this.passwordResetTokenExpiry = Date.now() + 3600000; //expires in an hour
    }, 
    generatePasswordResetEmailBody: function(){
        let link = "http://" + process.env.HOST_NAME + "/auth/reset-password/" + this.passwordResetToken;
        let body = `
            Hi ${this.email} <br>
            Please click on the following link ${link} to reset your password. <br>
            If you did not request this, please ignore this email and your password will remain unchanged.<hr>`
        return body
    }
}

const User = mongoose.model('user', userSchema)

module.exports = User