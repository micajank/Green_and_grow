require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require("express-session");
const passport = require("./config/ppConfig");
const flash = require("connect-flash");
const isLoggedIn = require("./middleware/isLoggedIn");
const helmet = require("helmet");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./models");

const app = express();

app.set('view engine', 'ejs');


app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);
app.use(helmet());

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 1000 * 60 * 30
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

sessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;

  next();
})

app.get('/', function(req, res) {
  console.log(`User is ${ req.user ? req.user.name : 'not logged in'}`)
  res.render('states/home');
});

// app.get('/profile', isLoggedIn, function(req, res) {
//   res.render('profile');
// });
app.use('/home', require('./controllers/home'));
app.use('/learn', require('./controllers/learn'));
app.use('/more', require('./controllers/more'));
app.use('/auth', require('./controllers/auth'));
app.use('/events', require('./controllers/events'));
app.use('/profile', isLoggedIn, require('./controllers/profile'));
app.use('/restaurants', require('./controllers/restaurants'));

// app.use("/", isLoggedIn, require("./controllers/test"));
// app.use('/restaurants', require('./controllers/restaurants'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
