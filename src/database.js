const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yoneiker:yoneiker@cluster0-t41nx.mongodb.net/finterest', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(db => console.log("db is connect"))
    .catch(err => console.error(err))