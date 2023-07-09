const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateHotel } = require('../middleware')


const Kat = require('../models/hotel')
const Review = require('../models/reviewSchema')



router.get('', catchAsync(async (req, res) => {
    const list = await Kat.find();
    // console.log(list)
    // res.render('Goodbye')
    res.render('hotels/show', { list })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('hotels/new')
})

router.post('/', isLoggedIn, validateHotel, catchAsync(async (req, res, next) => {
    const body = req.body
    //console.log(req.user)
    const c = new Kat({ name: body.name, location: body.location, image: body.image, price: body.price, description: body.description, author: req.user._id })
    await c.save()
    req.flash('success', "Successful in making a new hotel")
    res.redirect(`/hotels/${c._id}`)
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params

    const hotel = await Kat.findById(id).populate('review').populate('author')
    if (!hotel) {
        req.flash('error', 'hotel does not exist')
        return res.redirect('/hotels')
    }
    // console.log(hotel)
    res.render('hotels/index', { hotel })
}))

router.put('/:id', isLoggedIn, isAuthor, validateHotel, catchAsync(async (req, res, next) => {
    const body = req.body
    const id = req.params.id
    // res.send(body)
    const c = await Kat.findByIdAndUpdate(id, body)
    // // res.send(c)
    req.flash('success', "Successfully Updated the hotel")
    res.redirect(`/hotels/${c._id}`)
}))



router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const id = req.params.id
    // const c = await Kat.findById(id.substring(1))
    //    res.send(c)
    const c = await Kat.findByIdAndDelete(id)
    // res.send("Done")
    req.flash('success', "Successfully deleted hotel")
    res.redirect('/hotels')
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const id = req.params.id;
    const motel = await Kat.findById(id)
    if (!motel) {
        req.flash('error', 'hotel does not exist')
        return res.redirect('/hotels')
    }
    res.render('hotels/edit', { motel })
}))


module.exports = router