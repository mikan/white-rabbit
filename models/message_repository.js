require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect(process.env.MONGODB_URI + "?autoReconnect=true", function (err, client) {
    if (err) throw err;
    console.log("Database connected.");
    db = client.db(process.env.MONGODB_DB);
});

function messages() {
    return db.collection(process.env.MONGODB_COLLECTION);
}

function search(query, channnel, limit, callback) {
    var q = {
        text: /.+/
    };
    if (query) {
        q.text = new RegExp(".*" + query.trim() + ".*");
    }
    if (channnel) {
        q.channel = channnel;
    }
    var l = Number(process.env.SEARCH_LIMIT);
    switch (l) {
        case 30:
            l = 30;
            break;
        case 50:
            l = 50;
            break;
        case 100:
            l = 100;
            break;
        default:
            break; // custom values are ignored
    }
    messages().find(q, {"sort": [['time', 'desc']]}).limit(l).toArray(function (err, result) {
        if (err) throw err;
        console.log("search(" + query + ") fetched " + result.length + " message(s).");
        callback(result);
    });
}

module.exports.search = search;
