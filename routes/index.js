var express = require('express');
var router = express.Router();
var url = require('url');
var repository = require('../models/message_repository');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        var params = url.parse(req.url, true).query;
        repository.search(params.q, params.channel, params.limit, function (result) {
            res.render('index', {
                title: 'AOSN Slack Archive',
                authenticated: req.isAuthenticated(),
                messages: result,
                moment: require('moment')
            });
        })
    } else {
        res.render('index', {
            title: 'AOSN Slack Archive',
            authenticated: req.isAuthenticated(),
            messages: [],
            moment: require('moment')
        });
    }
});
module.exports = router;
