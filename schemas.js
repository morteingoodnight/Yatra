const joi = require('joi')




module.exports.hotelSchema = joi.object({
    name: joi.string().required(),
    price: joi.number().required().min(0),
    description: joi.string().required(),
    image: joi.string().required(),
    location: joi.string().required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5),
        body: joi.string().required()
    }).required()
})