if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
//console.log(process.env.secret)

const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const appError = require('./utils/appError')
const mongoose = require('mongoose')
const catchAsync = require('./utils/catchAsync')
//const joi = require('joi')
const hotelRoutes = require('./routes/hotel')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/user')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStratergy = require('passport-local')
const mongo_sanitize = require('express-mongo-sanitize')
const MongoStore = require('connect-mongo')(session);

const { hotelSchema, reviewSchema } = require('./schemas')

const Kat = require('./models/hotel')
const Review = require('./models/reviewSchema')
const User = require('./models/user');
const { func } = require('joi');
const dbURL = 'mongodb://127.0.0.1:27017/hotel'
//dbURL
mongoose.connect(dbURL, { useNewUrlParser: true })
    .then(() => {
        console.log('connected to database')
    })
    .catch((e) => {
        console.log('Error in connecting to database')
        console.log(e)
    })

const store = new MongoStore({
    url: dbURL,
    secret: 'itShouldBeMoreComicallyAccurate',
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("Session store error", e);
})

const sessionConfig = {
    store,
    secret: 'itShouldBeMoreComicallyAccurate',
    resave: false,
    saveUninitialized: true,
    cookies: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session(sessionConfig))
app.use(flash())
app.use(mongo_sanitize());


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStratergy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))



app.use('/hotels', hotelRoutes)
app.use('/hotels/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

app.get('/', catchAsync(async (req, res) => {
    // const hotel = new Kat({ name: 'Maharaja', description: 'Great Butter Chicken' })
    // await hotel.save()
    res.render('basic')
}))

app.all('*', (req, res, next) => {
    next(new appError(404, "Page not found"))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})

