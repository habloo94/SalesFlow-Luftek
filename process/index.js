
var moment = require('moment');
var currencyFormatter = require('currency-formatter');
var db = require('./db.js');

const siteTitle = "SalesFlow | Luftek";
const mainURL = "http://sales.luftek.in/";

var dquery = "SELECT COUNT(*) as pending FROM enquiries WHERE status = 'Processing';";
var listdquery = "SELECT * FROM enquiries WHERE status = 'Processing';";
var listsquery = "SELECT * FROM salesorder_b WHERE po_date >= NOW()- INTERVAL 14 DAY;";
var dsquery = "SELECT count(*) as recent_order FROM salesorder_b WHERE po_date >= NOW()- INTERVAL 14 DAY";

exports.home = function (req, res) {
  if (req.user) {
    db.query(dquery, function (err, result) {
      if (err) { throw err; }
      else {
        db.query(dsquery, function (err, result1) {
          if (err) { throw err; }
          else {
            db.query(listdquery, function (err, plistresult) {
              if (err) { throw err; }
              else {
                db.query(listsquery, function (err, olistresult) {
                  if (err) { throw err; }
                  else { 
                res.render('pages/dashboard', {
                  siteTitle: siteTitle,
                  moment: moment,
                  currencyFormatter: currencyFormatter,
                  pageTitle: "Dashboard",
                  sales: result1[0].recent_order,
                  items: result[0].pending,
                  plists: plistresult,
                  olists: olistresult,
                  user: req.user
                });
              }
              });
              }
            });
          }
        });
      }
    });
  }
  else {
    res.render('pages/login', {
      siteTitle: siteTitle,
      moment: moment,
      pageTitle: "Login",
      items: ''
    });
  }
}