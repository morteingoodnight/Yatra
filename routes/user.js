const express = require('express')
const router = express.Router({ mergeParams: true })
const passport = require('passport')
const User = require('../models/user')
const user = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo } = require('../middleware')

router.route('/register')
    .get(user.registerPage)
    .post(catchAsync(
        user.postRegister
    ))

router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.postLogin)


router.get('/logout', user.logout);
module.exports = router