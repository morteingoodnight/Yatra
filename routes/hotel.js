const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateHotel } = require('../middleware')
const hotels = require('../controllers/hotels')
const { storage } = require('../cloudinary')
const multer = require('multer')
const upload = multer({ storage })



const Kat = require('../models/hotel')
const Review = require('../models/reviewSchema')



router.route('/')
    .get(catchAsync(
        hotels.index
    ))
    .post(isLoggedIn, upload.array('image'), validateHotel, catchAsync(
        hotels.postNewForm
    ))

router.get('/new', isLoggedIn,
    hotels.newForm
)



router.route('/:id')
    .get(catchAsync(
        hotels.showHotel
    ))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHotel, catchAsync(
        hotels.editRoute
    ))
    .delete(isLoggedIn, isAuthor, catchAsync(
        hotels.deleteRoute
    ))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(
    hotels.editPage
))


module.exports = router