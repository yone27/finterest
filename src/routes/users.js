const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/signin', (req, res) => {
    res.render('users/signin')
})
router.get('/signup', (req, res) => {
    res.render('users/signup')
})
router.post('/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: true
}))
router.post('/signup', async(req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    const errors = [];

    if (name.length < 1 || email.length < 1 || password.length < 1) {
        errors.push({ text: 'Fill all inputs ' })
    }
    if (password != passwordConfirm) {
        errors.push({ text: 'Password do not match' })
    }
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' })
    }
    if (errors.length > 0) {
        req.flash('errorMsg', errors);
        res.render('users/signup', { errors, name, email, password, passwordConfirm })
    } else {
        // Emails not repeat
        const emailUser = await User.findOne({ email });
        if (emailUser) {
            req.flash('errorMsg', 'the email is aleady in use');
            res.redirect('/users/signup');
        } else {
            const newUser = new User({ name, email, password });
            // contraseña cifrada
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('successMsg', 'You are registered');
            res.redirect('/users/signin');
        }
    }
})
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;