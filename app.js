var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var moment = require('moment');
var expresValidator = require('express-validator');
var cookieParser = require('cookie-parser');
const http = require('http');
var db = require('./process/db');


http.createServer(app).listen(process.env.PORT);
app.listen(8200);


// Authentication Packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

//routes
var index = require('./process/index');
var dashboard = require('./process/dashboard');
var enquiry = require('./process/enquiry');
var salesorder = require('./process/salesorder');
var nopermission = require('./process/nopermission');

//Loggin in
require('dotenv').config();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expresValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

var options = {
  host: "localhost",
  user: "salesflow-admin",
  password: "LSFAdmin-101",
  database: "salesflow"
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

passport.use(new LocalStrategy({},
  function (username, password, done) {

    db.query('SELECT * FROM users WHERE username = ?', [username], function (err, results, fields) {
      if (err)
        return done(err);
      if (!results.length) {
        return done(null, false);
      }
      if (!(results[0].password == password))
        return done(null, false);

      return done(null, { user_id: results[0].Name, user_data : results[0] });


    });
  }));

app.use(function (req, res, next) {
  res.locals.user = req.user; // This is the important line
  next();
});

app.post('/access', passport.authenticate(
  'local', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  }
));

app.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy();
  res.redirect("https://sales.luftek.in");
});

passport.serializeUser(function (user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
  done(null, user_id);
});

function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(`req.session.passport.user:${JSON.stringify(req.session.passport)}`);
    if (req.isAuthenticated()) return next();
  }
}


app.use(express.static('vendor'));
app.use(express.static('/bootstrap/css'));
app.use(express.static('/bootstrap/fonts'));
app.use(express.static('/img'));
app.use(express.static('/uploads'));
app.use(express.static('/bootstrap/js'));
app.use(express.static('/font-awesome/fonts'));


//Image
app.get('/img/salesflow-logo-1.svg', (req, res) => {
  res.sendFile(path.join(__dirname + "/img/salesflow-logo-1.svg"));
});
app.get('/img/salesflow-logo-2.svg', (req, res) => {
  res.sendFile(path.join(__dirname + "/img/salesflow-logo-2.svg"));
});
//js
app.get('/vendor/jquery/jquery.min.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/jquery/jquery.min.js"));
});
app.get('/vendor/bootstrap/js/bootstrap.min.js', (req, res)=>{
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/js/bootstrap.min.js"));
});
app.get('/vendor/bootstrap/js/bootstrap.js', (req, res)=>{
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/js/bootstrap.js"));
});
app.get('/vendor/metisMenu/metisMenu.min.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/metisMenu/metisMenu.min.js"));
});
app.get('/vendor/raphael/raphael.min.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/raphael/raphael.min.js"));
});
app.get('/vendor/datatables/js/jquery.dataTables.min.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/datatables/js/jquery.dataTables.min.js"));
});
app.get('/vendor/datatables-plugins/dataTables.bootstrap.min.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/datatables-plugins/dataTables.bootstrap.min.js"));
});
app.get('/vendor/datatables-responsive/dataTables.responsive.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/datatables-responsive/dataTables.responsive.js"));
});
app.get('/js/sb-admin-2.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/js/sb-admin-2.js"));
});
app.get('/vendor/morrisjs/morris.min.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/morrisjs/morris.min.js"));
});
app.get('/data/morris-data.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/data/morris-data.js"));
});
app.get('/vendor/jquery.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/jquery.js"));
});
//css
app.get('/vendor/bootstrap/fonts/glyphicons-halflings-regular.svg', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/fonts/glyphicons-halflings-regular.svg"));
});
app.get('/vendor/bootstrap/fonts/glyphicons-halflings-regular.eot', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/fonts/glyphicons-halflings-regular.eot"));
});
app.get('/vendor/bootstrap/fonts/glyphicons-halflings-regular.ttf', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/fonts/glyphicons-halflings-regular.ttf"));
});
app.get('/vendor/bootstrap/fonts/glyphicons-halflings-regular.woff', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/fonts/glyphicons-halflings-regular.woff"));
});
app.get('/vendor/bootstrap/fonts/glyphicons-halflings-regular.woff2', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/fonts/glyphicons-halflings-regular.woff2"));
});

app.get('/vendor/font-awesome/fonts/fontawesome-webfont.eot', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/font-awesome/fonts/fontawesome-webfont.eot"));
});
app.get('/vendor/font-awesome/fonts/fontawesome-webfont.svg', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/font-awesome/fonts/fontawesome-webfont.svg"));
});
app.get('/vendor/font-awesome/fonts/fontawesome-webfont.ttf', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/font-awesome/fonts/fontawesome-webfont.ttf"));
});
app.get('/vendor/font-awesome/fonts/fontawesome-webfont.woff', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/font-awesome/fonts/fontawesome-webfont.woff"));
});
app.get('/vendor/font-awesome/fonts/fontawesome-webfont.woff2', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/font-awesome/fonts/fontawesome-webfont.woff2"));
});
app.get('/vendor/font-awesome/fonts/Fontawesome.otf', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/font-awesome/fonts/Fontawesome.otf"));
});


app.get('/vendor/datatables/images/sort_asc.png', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/datatables/images/sort_asc.png"));
});
app.get('/vendor/bootstrap/css/bootstrap.min.css', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/css/bootstrap.min.css"));
});
app.get('/vendor/bootstrap/css/bootstrap4.min.css', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/css/bootstrap.4min.css"));
});
app.get('/vendor/bootstrap/css/bootstrap4.min.css', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/bootstrap/css/bootstrap.4min.css"));
});
app.get('/vendor/metisMenu/metisMenu.css', (req, res) => {
  res.sendFile(path.join(__dirname, "/vendor/metisMenu/metisMenu.css"));
});
app.get('/less/sb-admin-2.css', (req, res) => {
  res.sendFile(path.join(__dirname, "/less/sb-admin-2.css"));
});
app.get('/dist/css/sb-admin-2.css', (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/css/sb-admin-2.css"));
});
app.get('/vendor/datatables/css/dataTables.bootstrap.css', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/datatables/css/dataTables.bootstrap.css"));
});
app.get('/vendor/datatables-plugins/dataTables.bootstrap.css', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/datatables-plugins/dataTables.bootstrap.css"));
});
app.get('/vendor/datatables-responsive/dataTables.responsive.css', (req, res) => {
  res.sendFile(path.join(__dirname, "/vendor/datatables-responsive/dataTables.responsive.css"));
});
app.get('/vendor/font-awesome/css/font-awesome.min.css', (req, res) => {
  res.sendFile(path.join(__dirname, "/vendor/font-awesome/css/font-awesome.min.css"));
});

app.get('/vendor/morrisjs/morris.css', (req, res) => {
  res.sendFile(path.join(__dirname, "/vendor/morrisjs/morris.css"));
});
// app.use(express.static(__dirname + '/vendor'));
// app.use(express.static(__dirname + '/dist'));
// app.use(express.static(__dirname + '/data'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/', express.static(__dirname + '/node_modules/moment'));

//css directory declaration
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const siteTitle = "SalesFlow | Luftek";

app.get('/', index.home );
app.get('/nopermission', authenticationMiddleware(), nopermission.nopermission);
app.get('/dashboard', authenticationMiddleware(), dashboard.dboard);
//Enquiry
app.get('/enquiry', authenticationMiddleware(), enquiry.list );
app.get('/addenquiry', authenticationMiddleware(), enquiry.addform );
app.post('/addenquiry', authenticationMiddleware(), enquiry.send );
app.get('/editenquiry/:id', authenticationMiddleware(), enquiry.editform);
app.post('/editenquiry/:id', authenticationMiddleware(), enquiry.update);
app.get('/revenquiry/:id', authenticationMiddleware(), enquiry.revision);
app.post('/revenquiry/:id', authenticationMiddleware(), enquiry.addrevision);
app.get('/viewenquiry/:id', authenticationMiddleware(), enquiry.view);
//SALES ORDER
app.get('/salesorder', authenticationMiddleware(), salesorder.list);
app.get('/booking/:id', authenticationMiddleware(), salesorder.addorderform);
app.post('/addorder', authenticationMiddleware(), salesorder.send);
app.get('/editorder/:id', authenticationMiddleware(), salesorder.editform);
app.post('/editorder/:id', authenticationMiddleware(), salesorder.update);
app.get('/vieworder/:id', authenticationMiddleware(), salesorder.view);














