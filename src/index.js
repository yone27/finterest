const express = require('express');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const { format } = require('timeago.js');
const uuid = require('uuid/v4');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const exphbs = require('express-handlebars')
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

// Initializations
const app = express();
require('./database');
require('./config/passport');

// Settings 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', '.hbs')

// Middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'mipalabrasecreta',
    resave: true,
    saveUninitialized: true
}))
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: function(req, file, cb, filename) {
        cb(null, uuid() + path.extname(file.originalname))
    }
})
app.use(multer({ storage }).single('image'))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

// Globals Variables
app.use((req, res, next) => {
    app.locals.format = format
    res.locals.successMsg = req.flash('successMsg');
    res.locals.errorMsg = req.flash('errorMsg');
    res.locals.user = req.user || null;
    next();
})

// Routes
app.use(require('./routes/index'))
app.use(require('./routes/images'))
app.use('/users', require('./routes/users'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Server start :D
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'))
})