const router = require('express').Router();
const Image = require('../models/Image')

// routes
router.get('/', async(req, res) => {
    const images = await Image.find();
    if (!images) {
        res.redirect()
    }
    res.render('index', { images })
})

module.exports = router;