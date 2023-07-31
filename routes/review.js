const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews')
const Kat = require('../models/hotel')
const Review = require('../models/reviewSchema')




router.post('/', isLoggedIn, validateReview, catchAsync(
    reviews.postReview
))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(
    reviews.deleteReview
))

module.exports = router