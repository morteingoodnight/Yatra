const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const { validateReview } = require('../middleware')
const Kat = require('../models/hotel')
const Review = require('../models/reviewSchema')




router.post('/', validateReview, catchAsync(async (req, res) => {
    const id = req.params.id
    const hotel = await Kat.findById(id)
    const eview = new Review(req.body.review)
    hotel.review.push(eview)
    await hotel.save()
    await eview.save()
    req.flash('success', "Successfully created a new comment")
    res.redirect(`/hotels/${id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params

    await Kat.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', "Successfully deleted comment")
    res.redirect(`/hotels/${id}`)
}))

module.exports = router