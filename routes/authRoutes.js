const {Router} = require('express')
const AuthController = require('../controllers/authController')

const router = Router()


router.get('/signup', AuthController.signup_get)
router.post('/signup', AuthController.signup_post)
router.get('/login', AuthController.login_get)
router.post('/login', AuthController.login_post)

module.exports = router