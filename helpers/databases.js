const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://hassan:RCv4mUtefbTAZBOJ@cluster0.ru5cwqx.mongodb.net/?retryWrites=true&w=majority')
        .then(client => {
            console.log('CONNECTED !');
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = mongoConnect;