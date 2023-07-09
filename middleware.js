const { hotelSchema, reviewSchema } = require('./schemas')
const Kat = require('./models/hotel')
const appError = require('./utils/appError')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be Logged in')
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const hotel = await Kat.findById(id)
    if (!hotel.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do this task")
        return res.redirect(`/hotels/${id}`)
    }
    next()
}


module.exports.validateHotel = (req, res, next) => {
    const { error } = hotelSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(400, msg)
    }
    else {
        next()
    }
}

module.exports.validateReview = (res, req, next) => {

    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(400, msg)
    }
    else {
        next()
    }
}