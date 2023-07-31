const mongoose = require('mongoose')
const city = require('./in')
const { descriptors, places } = require('./helper')
const Kat = require('../models/hotel')
mongoose.connect('mongodb://127.0.0.1:27017/hotel', { useNewUrlParser: true })
    .then(() => {
        console.log('connected to database')
    })
    .catch((e) => {
        console.log('Error in connecting to database')
        console.log(e)
    })

const kamal = (lemon) => lemon[Math.floor(Math.random() * lemon.length)];

seedDB = async () => {
    await Kat.deleteMany({});
    // c = new Kat({ name: "Taj", location: "Mumbai" });
    // c.save()
    for (let i = 0; i < 200; i++) {
        const random150 = Math.floor(Math.random() * 150)
        const rando = Math.floor(Math.random() * 5000) + 30
        c = new Kat({
            author: '64a4f2f76e5b7a239c5885a3',
            name: `${kamal(places)} ${kamal(descriptors)} `, location: `${city[random150].city}, ${city[random150].admin_name}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: rando,
            image: [
                {
                    url: 'https://res.cloudinary.com/dsgocdrme/image/upload/v1690522252/hotel/pfkuircwgujasdj3xhii.jpg',
                    filename: 'hotel/pfkuircwgujasdj3xhii',
                },
                {
                    url: 'https://res.cloudinary.com/dsgocdrme/image/upload/v1690522259/hotel/lu8suqcci4tzsoydgysf.jpg',
                    filename: 'hotel/lu8suqcci4tzsoydgysf',
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [city[random150].lng, city[random150].lat]
            }
        })
        c.save()
    }
}
seedDB()
