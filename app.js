var express = require('express');
var app = express();
var path = require('path');
var virtualDirPath = process.env.virtualDirPath || '';
var bodyParser = require('body-parser');
var mysql = require('mysql');
var async = require("async");
var moment = require('moment');
var logger = require('morgan');
var expresValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var url = require('url');
const http = require('http');
var currencyFormatter = require('currency-formatter');
var numeral = require('numeral');

http.createServer(app).listen(process.env.PORT);
app.listen(7430);



// Authentication Packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcrypt');



const router = express.Router();

require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expresValidator());

var dateformat = require('dateformat');
var now = new Date();

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

passport.use(new LocalStrategy({

  
},
  function (username, password, done) {

    con.query('SELECT * FROM users WHERE username = ?', [username], function (err, results, fields) {
      if (err) 
      return done(err);
      if (!results.length) {
        return done(null, false);
      }
      if(!(results[0].password == password))
      return done(null, false);

      return done(null, { user_id: results[0].Name });

      
    });
  }));

app.use(function(req, res, next) {
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
  res.render('pages/login', {
    siteTitle: siteTitle,
    moment: moment,
    pageTitle: "Login"
  });
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
app.use(express.static('/bootstrap/js'));
app.use(express.static('/font-awesome/fonts'));
//js
app.get('/vendor/jquery/jquery.min.js', (req, res) => {
  res.sendFile(path.join(__dirname + "/vendor/jquery/jquery.min.js"));
});
// app.get('/vendor/bootstrap/js/bootstrap.js', (req, res)=>{
//   res.sendFile(path.join(__dirname + "/vendor/bootstrap/js/bootstrap.js"));
// });
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


const con = mysql.createConnection({
  host: "localhost",
  user: "salesflow-admin",
  password: "LSFAdmin-101",
  database: "salesflow",
  multipleStatements: true
});

const siteTitle = "SalesFlow | Luftek";
const mainURL = "http://sales.luftek.in/";
const baseURL = "http://sales.luftek.in/enquiry";
const baseorderURL = "http://sales.luftek.in/salesorder";

const lbaseorderURL = "http://localhost:7080/salesorder";


app.get('/', function (req, res) {
  if(req.user){
    con.query(dquery, function(err, result){
      if (err) {throw err;}
  else{
    con.query(dsquery, function(err, result1){
      if (err) {throw err;}
  else{
      res.render('pages/dashboard', {
        siteTitle: siteTitle,
        moment: moment,      
        currencyFormatter: currencyFormatter,
        pageTitle: "Dashboard",
        sales:result1[0].total,
        items: result[0].pending,
        user : req.user
        });
      }
    });
  }
    });
  }
  else{
  res.render('pages/login', {
    siteTitle: siteTitle,
    moment: moment,
    pageTitle: "Login",
    items: ''
  });
}
});


//Dashboard
var dquery = "SELECT COUNT(*) as pending FROM enquiries WHERE amount = 0";
var dsquery = "SELECT count(*) as recent_order FROM salesorder_b WHERE po_date >= NOW()- INTERVAL 14 DAY";

app.get('/dashboard', authenticationMiddleware(), function (req, res, next) {
  if(req.user){
  con.query(dquery, function(err, result){
    if (err) {throw err;}
else{
  con.query(dsquery, function(err, result1){
    if (err) {throw err;}
else{
    res.render('pages/dashboard', {
      siteTitle: siteTitle,
      moment: moment,      
      currencyFormatter: currencyFormatter,
      pageTitle: "Dashboard",
      sales:result1[0].recent_order,
      items: result[0].pending,
      user : req.user
      });
    }
  });
}
  });
}
  else{res.redirect(mainURL);}
});

//Enquiry
var equery= "SELECT * FROM enquiries ORDER BY job_ref DESC";
var equery1= "SELECT job_ref AS compare FROM enquiries WHERE enquiries.job_ref IN (SELECT job_ref FROM salesorder_b WHERE salesorder_b.job_ref = enquiries.job_ref);"
app.get('/enquiry', authenticationMiddleware(), function (req, res) {

  con.query(equery, function (err, result1) {
    if(err) {throw err;}
    else{
      
          res.render('pages/enquiry', {
            siteTitle: siteTitle,
            moment: moment,
            numeral: numeral,
            currencyFormatter: currencyFormatter,
            pageTitle: "Enquiry List",
            items: result1,
            items1: result1[0].status,
            user : req.user
          });
          
        }
      });
  });

//SALES ORDER

var squery = "SELECT * FROM salesorder_b ORDER BY job_ref DESC";
var azequery = "SELECT * FROM salesorder_b WHERE sales_per = 'Azeem';";
var azequery1 = "SELECT SUM(amount) as total FROM salesorder_b WHERE sales_per = 'Azeem';";
var squery1 = "SELECT SUM(amount) as total FROM salesorder_b";
app.get('/salesorder', authenticationMiddleware(), function (req, res) {
  if(req.user.user_id=="Azeem"){
    con.query(azequery, function (err, result) {
      if (err) {throw err;}
      else{
        con.query(azequery1, function (err,result1){
        res.render('pages/salesorder', {
          siteTitle: siteTitle,
          moment: moment,
          numeral: numeral,
          currencyFormatter: currencyFormatter,
          pageTitle: "Sales Order",
          sales:result1[0].total,
          items: result,
          user : req.user
        });
      });
      }
    });
  }
  else{
  con.query(squery, function (err, result) {
    if (err) {throw err;}
    else{
      con.query(squery1, function (err,result1){
      res.render('pages/salesorder', {
        siteTitle: siteTitle,
        moment: moment,
        numeral: numeral,
        currencyFormatter: currencyFormatter,
        pageTitle: "Sales Order",
        sales:result1[0].total,
        items: result,
        user : req.user
      });
    });
    }
  });}
});

//Add New Event
app.get('/addenquiry', authenticationMiddleware(), function (req, res) {
  res.render('pages/add-enquiry', {
    siteTitle: siteTitle,
    pageTitle: "New Enquiry",
    items: '',
    user : req.user
  });
});

app.get('/addsalesorder', authenticationMiddleware(), function (req, res) {
  con.query("SELECT * FROM enquiries ORDER BY job_ref DESC", function (err, result) {
    res.render('pages/addsalesorder', {
      siteTitle: siteTitle,
      moment: moment,
      numeral: numeral,
      currencyFormatter: currencyFormatter,
      pageTitle: "Sales Order",
      items: result,
      user : req.user
    });
  });
});

app.post('/addenquiry', function (req, res) {
  var query = "INSERT INTO `enquiries`(project, location, project_type, consultant, contractor, client, customer_type, customer, contact_per, contact_num, product, qty, amount, reci_date,  sales_per, app_engg) VALUES (";
  query += " '" + req.body.project + "',";
  query += " '" + req.body.location + "',";
  query += " '" + req.body.project_type + "',";
  query += " '" + req.body.consultant + "',";
  query += " '" + req.body.contractor + "',";
  query += " '" + req.body.client + "',";
  query += " '" + req.body.customer_type + "',";
  query += " '" + req.body.customer + "',";
  query += " '" + req.body.contact_per + "',";
  query += " '" + req.body.contact_num + "',";
  query += " '" + req.body.product + "',";
  query += " '" + req.body.qty + "',";
  query += " '" + req.body.amount + "',";
  query += " '" + dateformat(req.body.reci_date, "yyyy-mm-dd") + "',";
  query += " '" + req.body.sales_per + "',";
  query += " '" + req.body.app_engg + "')";
  con.query(query, function (err, result) {
    res.redirect(baseURL);
  });
});
//Move to PO

app.post('/addorder', function (req, res) {
  
  var query = "INSERT INTO `salesorder_b`(job_ref, order_date, project, customer, sales_per, po_num, po_date, qty, amount,  discount, advance_amt,  deli_date, pay_term, lead_time, remarks) VALUES (";
  query += " '" + req.body.job_ref + "',";
  query += " '" + req.body.order_date + "',";
  query += " '" + req.body.project + "',";
  query += " '" + req.body.customer + "',";
  query += " '" + req.body.sales_per + "',";
  query += " '" + req.body.po_num + "',";
  query += " '" + dateformat(req.body.po_date, "yyyy-mm-dd") + "',";
  query += " '" + req.body.qty + "',";
  query += " '" + req.body.amount + "',";
  query += " '" + req.body.discount + "',";
  query += " '" + req.body.advance_amt + "',";
  query += " '" + dateformat(req.body.deli_date, "yyyy-mm-dd") + "',";
  query += " '" + req.body.pay_term + "',";
  query += " '" + req.body.lead_time + "',";
  query += " '" + req.body.remarks + "')";
  con.query(query, function (err, result) {
    if(err) {throw err;}
    else{
con.query("UPDATE `salesflow`.`enquiries` SET `status`='Booked' WHERE `job_ref`='"+ req.body.job_ref +"'; ", function(err, result1){
  if(result1){res.redirect(baseorderURL);}
});
    }
    
  });
});

app.get('/editenquiry/:id',authenticationMiddleware(), function (req, res) {
  con.query("SELECT * FROM enquiries WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].reci_date = dateformat(result[0].reci_date, "yyyy-mm-dd");
    result[0].sent_date = dateformat(result[0].sent_date, "yyyy-mm-dd");
    res.render('pages/editenquiry', {
      siteTitle: siteTitle,
      moment: moment,
      pageTitle: "Editing Enquiry : " + result[0].project,
      item: result,
      user : req.user
    });
  });
});

app.get('/revenquiry/:id',authenticationMiddleware(), function (req, res) {
  con.query("SELECT * FROM enquiries WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].reci_date = dateformat(result[0].reci_date, "yyyy-mm-dd");
    result[0].sent_date = dateformat(result[0].sent_date, "yyyy-mm-dd");
    res.render('pages/revenquiry', {
      siteTitle: siteTitle,
      moment: moment,
      pageTitle: "Add Revision to Enquiry No. " + result[0].job_ref,
      item: result,
      user : req.user
    });

  });
});

app.get('/booking/:id', authenticationMiddleware(), function (req, res) {
  con.query("SELECT * FROM enquiries WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].reci_date = dateformat(result[0].reci_date, "yyyy-mm-dd");
    result[0].sent_date = dateformat(result[0].sent_date, "yyyy-mm-dd");
    res.render('pages/add-salesorder', {
      siteTitle: siteTitle,
      moment: moment,
      pageTitle: "Book Job#" + result[0].job_ref,
      item: result,
      user : req.user
    });
  });
});

app.get('/editorder/:id', authenticationMiddleware(), function (req, res) {
  con.query("SELECT * FROM salesorder_b WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].po_date = dateformat(result[0].po_date, "yyyy-mm-dd");
    res.render('pages/editorder', {
      siteTitle: siteTitle,
      moment: moment,
      pageTitle: "Editing Enquiry : " + result[0].project,
      item: result,
      user : req.user
    });
  });
});

app.post('/revenquiry/:id', authenticationMiddleware(), function (req, res) {
  if (req.body.rev_num == "R1")
  {
    con.query("UPDATE enquiries SET r1amt = ? , r1date = ? , r1note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
      if (result) { res.redirect(baseURL); }
      else { console.log(err); }
    });
  }
  else if(req.body.rev_num == "R2")
  {
    con.query("UPDATE enquiries SET r2amt = ? , r2date = ? , r2note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
      if (result) { res.redirect(baseURL); }
      else { console.log(err); }
    });
  }
  else if(req.body.rev_num == "R3")
  {
    con.query("UPDATE enquiries SET  r3amt = ? , r3date = ? , r3note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
      if (result) { res.redirect(baseURL); }
      else { console.log(err); }
    });
  }
  else if(req.body.rev_num == "R4")
  {
    con.query("UPDATE enquiries SET  r4amt = ? , r4date = ? , r4note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
      if (result) { res.redirect(baseURL); }
      else { console.log(err); }
    });
  }
  else if(req.body.rev_num == "R5")
  {
    con.query("UPDATE enquiries SET  r5amt = ? , r5date = ? , r5note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
      if (result) { res.redirect(baseURL); }
      else { console.log(err); }
    });
  }

});


app.post('/editenquiry/:id', function (req, res) {
  con.query("UPDATE enquiries SET  project = ?, location = ? , project_type = ? , consultant = ? , contractor = ? , client = ? , customer_type = ? , customer = ? , contact_per = ? , contact_num = ? , product = ? , qty = ? , amount = ? , reci_date = ? , sent_date = ? , sales_per = ? , app_engg = ? , comment = ? , status = ? , offer_file = ? , tds_file = ? WHERE job_ref = ? ", [req.body.project, req.body.location, req.body.project_type, req.body.consultant, req.body.contractor, req.body.client, req.body.customer_type, req.body.customer, req.body.contact_per, req.body.contact_num, req.body.product, req.body.qty, req.body.amount, req.body.reci_date, req.body.sent_date, req.body.sales_per, req.body.app_engg, req.body.comment, req.body.status, req.body.offer_file, req.body.tds_file, req.params.id], function (err, result) {
    if (result) { res.redirect(baseURL); }
    else { console.log(err); }
  });
});

app.post('/editorder/:id', function (req, res) {
  con.query("UPDATE salesorder_b SET job_ref = ?, order_date = ?, project = ?, customer = ?, sales_per = ?, po_num = ?, po_date = ?, qty = ?, amount = ?, discount = ?, advance_amt = ? , deli_date = ? , app_date = ? , pay_term = ? , lead_time = ? , remarks = ?, po_file = ? WHERE so_num = ? ", [req.body.job_ref, req.body.order_date, req.body.project, req.body.customer, req.body.sales_per, req.body.po_num, req.body.po_date, req.body.qty, req.body.amount, req.body.discount, req.body.advance_amt, req.body.deli_date, req.body.app_date, req.body.pay_term, req.body.lead_time, req.body.remarks, req.body.po_file, req.params.id], function (err, result) {
    if (result) { res.redirect(baseorderURL); }
    else { console.log(err); }
  });
});


app.get('/viewenquiry/:id', function (req, res) {
  con.query("SELECT * FROM enquiries  WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].reci_date = dateformat(result[0].reci_date, "dd-mmm-yy");
    if(result[0].sent_date!=null){result[0].sent_date = dateformat(result[0].sent_date, "dd-mmm-yy");}
    if(result[0].r1date!=null){result[0].r1date = dateformat(result[0].r1date, "dd-mmm-yy");}
    if(result[0].r2date!=null){result[0].r2date = dateformat(result[0].r2date, "dd-mmm-yy");}
    if(result[0].r3date!=null){result[0].r3date = dateformat(result[0].r3date, "dd-mmm-yy");}
    if(result[0].r4date!=null){result[0].r4date = dateformat(result[0].r4date, "dd-mmm-yy");}
    if(result[0].r5date!=null){result[0].r5date = dateformat(result[0].r5date, "dd-mmm-yy");}
    res.render('pages/viewenquiry', {
      siteTitle: siteTitle,
      moment: moment,
      currencyFormatter: currencyFormatter,
      pageTitle: "Enquiry No. : " + result[0].job_ref,
      item: result
    });
  });
});

app.get('/vieworder/:id', function (req, res) {
  con.query("SELECT * FROM salesorder_b  WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].po_date = dateformat(result[0].po_date, "dd-mmm-yy");
    if(result[0].order_date!=null){result[0].order_date = dateformat(result[0].order_date, "dd-mmm-yy");}
    res.render('pages/vieworder', {
      siteTitle: siteTitle,
      moment: moment,
      currencyFormatter: currencyFormatter,
      pageTitle: "Job No. : " + result[0].job_ref,
      item: result
    });
  });
});
