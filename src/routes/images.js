const router = require('express').Router();
const Image = require('../models/Image')
const path = require('path')
const User = require('../models/User');
const { unlink } = require('fs-extra')
const { isAuthenticated } = require('../helpers/auth');

router.get('/upload', isAuthenticated, (req, res) => {
    res.render('upload')
})
router.post('/upload', isAuthenticated, async(req, res) => {
    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;
    image.user = req.user.id;

    await image.save();
    res.redirect('/');
})
router.get('/image/:id', isAuthenticated, async(req, res) => {
    const { id } = req.params
    const image = await Image.findById(id)
    const user = await User.findOne({ _id: image.user })

    if (image.user == req.user._id) {
        res.render('profile', { image, isMine: true, user })
    } else {
        res.render('profile', { image, isMine: false, user })
    }
})
router.get('/image/:id/delete', isAuthenticated, async(req, res) => {
    const { id } = req.params;
    const image = await Image.findByIdAndDelete(id)
    await unlink(path.resolve('./src/public' + image.path))
    res.redirect('/');
})

module.exports = router;