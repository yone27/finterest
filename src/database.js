const mongoose = require('mongoose');

mongoose.connect('localhost', {
// mongoose.connect('mongodb+srv://yoneiker:yoneiker@cluster0-t41nx.mongodb.net/finterest', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    mongoose.connect()
    .then(db => console.log("db is connect"))
    .catch(err => console.error(err))