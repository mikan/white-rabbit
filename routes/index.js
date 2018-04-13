const express = require('express');
const router = express.Router();
const url = require('url');
const repository = require('../models/message_repository');

/* GET home page. */
router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        const params = url.parse(req.url, true).query;
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
