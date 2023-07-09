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
    for (let i = 0; i < 50; i++) {
        const random150 = Math.floor(Math.random() * 150)
        const rando = Math.floor(Math.random() * 5000) + 30
        c = new Kat({
            author: '64a4f2f76e5b7a239c5885a3',
            name: `${kamal(places)} ${kamal(descriptors)} `, location: `${city[random150].city}, ${city[random150].admin_name}`,
            image: "https://images.unsplash.com/photo-1619631428091-1eaa03c3bdf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: rando
        })
        c.save()
    }
}
seedDB()
