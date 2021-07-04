const {Router} = require('express')
const router = Router()


const { signup_post, login_post, logout, get_new_access_token,  request_reset_password_post, reset_password_post, change_password_post} = require('../controllers/authController')
const { validateLoginData, verifyValidationResults, validateSignupData, validatePassword } = require('../validators/authValidator')
const {requireAuth} = require('../middleware/authMiddleware')

router.post('/signup', validateSignupData, verifyValidationResults, signup_post)
router.post('/login', validateLoginData, verifyValidationResults, login_post)
router.get('/logout', requireAuth, logout)

router.get('/token', requireAuth, get_new_access_token)
router.post('/request-reset-password', request_reset_password_post)
router.post('/reset-password/:reset_token', validatePassword, verifyValidationResults, reset_password_post)

//update 
router.post('/user/update/password', requireAuth, validatePassword, verifyValidationResults, change_password_post)

module.exports = router