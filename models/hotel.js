const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./reviewSchema')

const hotelSchema = new Schema({
    name: String,
    image: String,
    price: {
        type: Number,
        required: true
    },
    location: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

hotelSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Kat = mongoose.model('Kat', hotelSchema)
module.exports = Kat;