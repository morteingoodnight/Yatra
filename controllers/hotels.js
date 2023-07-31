const Kat = require('../models/hotel')
const { cloudinary } = require('../cloudinary')
const mbxStyles = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxtoken = process.env.mapbox_token;
const geomoder = mbxStyles({ accessToken: mapboxtoken });

module.exports.index = async (req, res) => {
    const list = await Kat.find();
    // console.log(list)
    // res.render('Goodbye')
    res.render('hotels/show', { list })
}

module.exports.newForm = (req, res) => {
    res.render('hotels/new')
}

module.exports.postNewForm = async (req, res, next) => {
    const geoData = await geomoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()

    const body = req.body
    const c = new Kat({ name: body.name, location: body.location, price: body.price, description: body.description, author: req.user._id })
    c.geometry = geoData.body.features[0].geometry
    c.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    await c.save()
    console.log(c)
    req.flash('success', "Successful in making a new hotel")
    res.redirect(`/hotels/${c._id}`)
}

module.exports.showHotel = async (req, res, next) => {
    const { id } = req.params

    const hotel = await Kat.findById(id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!hotel) {
        req.flash('error', 'hotel does not exist')
        return res.redirect('/hotels')
    }
    // console.log(hotel)
    res.render('hotels/index', { hotel })
}

module.exports.editPage = async (req, res) => {
    const id = req.params.id;
    const motel = await Kat.findById(id)
    if (!motel) {
        req.flash('error', 'hotel does not exist')
        return res.redirect('/hotels')
    }
    res.render('hotels/edit', { motel })
}

module.exports.deleteRoute = async (req, res) => {
    const id = req.params.id
    // const c = await Kat.findById(id.substring(1))
    //    res.send(c)
    const c = await Kat.findByIdAndDelete(id)
    // res.send("Done")
    req.flash('success', "Successfully deleted hotel")
    res.redirect('/hotels')
}

module.exports.editRoute = async (req, res, next) => {
    const body = req.body
    const id = req.params.id
    // res.send(body)
    const c = await Kat.findByIdAndUpdate(id, body)
    const arr = req.files.map(f => ({ url: f.path, filename: f.filename }))
    c.image.push(...arr)
    await c.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await c.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    // // res.send(c)
    req.flash('success', "Successfully Updated the hotel")
    res.redirect(`/hotels/${c._id}`)
}