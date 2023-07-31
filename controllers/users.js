const User = require('../models/user')


module.exports.registerPage = (req, res) => {
    res.render('user/register')
}

module.exports.postRegister = async (req, res) => {
    //    res.send(req.body)
    try {
        const { username, password, email } = req.body
        const user = new User({ username, email })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Congratulation you have been registered')
            res.redirect('/hotels')
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login')
}

module.exports.postLogin = (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = res.locals.returnTo || '/hotels'
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/hotels');
    });
}