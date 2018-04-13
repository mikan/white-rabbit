require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect(process.env.MONGODB_URI + "?autoReconnect=true", function (err, client) {
    if (err) throw err;
    console.log("Database connected.");
    db = client.db(process.env.MONGODB_URI.replace(/^.*[\\/]/, ''));
});

function messages() {
    return db.collection(process.env.MONGODB_COLLECTION);
}

function search(query, channnel, limit, callback) {
    const q = {text: /.+/};
    if (query) {
        q.text = new RegExp(".*" + query.trim() + ".*");
    }
    if (channnel) {
        q.channel = channnel;
    }
    const l = Number(process.env.SEARCH_LIMIT);
    messages().find(q, {"sort": [['time', 'desc']]}).limit(l).toArray(function (err, result) {
        if (err) throw err;
        console.log("search(" + query + ") fetched " + result.length + " message(s).");
        callback(result);
    });
}

module.exports.search = search;
