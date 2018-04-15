require('dotenv').config();
if (process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
}
if (process.env.SQREEN_TOKEN) {
    require('sqreen');
}
const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const LdapStrategy = require('passport-ldapauth');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, maxAge: 2419200000}
}));

// passport w/ ldap
const ldap = {
    url: process.env.LDAP_URL,
    bindDN: process.env.LDAP_BIND_DN,
    bindCredentials: process.env.LDAP_BIND_CRED,
    searchBase: process.env.LDAP_SEARCH_BASE,
    searchFilter: process.env.LDAP_SEARCH_FILTER
};
passport.use(new LdapStrategy({server: ldap}));
app.use(passport.initialize());
app.post('/login', passport.authenticate('ldapauth', {
    session: true,
    successRedirect: '/'
}));
app.use(passport.session());
passport.serializeUser(function (user, done) {
    console.log('serializeUser ' + user.uid + ' / ' + user.displayName);
    done(null, user.uid);
});
passport.deserializeUser(function (user, done) {
    console.log('deserializeUser ' + user);
    done(null, user);
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
