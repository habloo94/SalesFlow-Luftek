
var moment = require('moment');
var currencyFormatter = require('currency-formatter');
var db = require('./db.js');
var numeral = require('numeral');
var dateformat = require('dateformat');

const siteTitle = "SalesFlow | Luftek";
const mainURL = "http://sales.luftek.in/";
const baseURL = "http://sales.luftek.in/enquiry";
const baseorderURL = "http://sales.luftek.in/salesorder";

const lbaseorderURL = "http://localhost:7080/salesorder";

var equery = "SELECT * FROM enquiries ORDER BY job_ref DESC";
var eazequery = "SELECT * FROM enquiries WHERE sales_per = 'Azeem';";
var esmquery = "SELECT * FROM enquiries WHERE sales_per = 'Suresh M';";

exports.nopermission = function(req,res){
  res.render('pages/nopermission', {
    siteTitle: siteTitle, pageTitle: "Dashboard",
  });
  }

