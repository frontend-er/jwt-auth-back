const Router = require('express')
const userController = require('../controllers/user-controller.js')
const {
   body
} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware.js')
const router = new Router()


router.post('/registration',
   body('email').isEmail(),
   body('password').isLength({
      min: 3,
      max: 30
   }), userController.regestration)
router.post('/logout', userController.logout)
router.post('/login', userController.login)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router