const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./reviewSchema')

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

const hotelSchema = new Schema({
    name: String,
    image: [imageSchema],
    price: {
        type: Number,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
    ,
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
}, opts)

hotelSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/hotels/${this._id}">${this.name}</a></strong><p>${this.description.substring(0, 25)}...</p>`
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