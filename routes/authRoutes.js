const {Router} = require('express')
const router = Router()


const { signup_get, signup_post, login_get, login_post, logout, get_new_refresh_token, request_reset_password_get, request_reset_password_post, reset_password_get, reset_password_post} = require('../controllers/authController')
const { validateLoginData, verifyValidationResults, validateSignupData, validatePassword } = require('../validators/authValidator')


router.get('/signup', signup_get)
router.post('/signup', validateSignupData, verifyValidationResults, signup_post)
router.get('/login', login_get)
router.post('/login', validateLoginData, verifyValidationResults, login_post)
router.get('/logout', logout)
router.get('/token', get_new_refresh_token)
router.get('/request-reset-password', request_reset_password_get)
router.post('/request-reset-password', request_reset_password_post)
router.get('/reset-password/:reset_token', reset_password_get)
router.post('/reset-password/:reset_token', validatePassword, verifyValidationResults, reset_password_post)

module.exports = router