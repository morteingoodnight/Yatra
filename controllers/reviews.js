const Kat = require('../models/hotel')
const Review = require('../models/reviewSchema')


module.exports.postReview = async (req, res) => {
    const id = req.params.id
    const hotel = await Kat.findById(id)
    const eview = new Review(req.body.review)
    eview.author = req.user._id
    hotel.review.push(eview)
    await hotel.save()
    await eview.save()
    req.flash('success', "Successfully created a new comment")
    res.redirect(`/hotels/${id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params

    await Kat.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', "Successfully deleted comment")
    res.redirect(`/hotels/${id}`)
}