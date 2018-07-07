
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

exports.list = function (req, res) {

  if (req.user.user_id == "Azeem") {
    db.query(eazequery, function (err, result) {
      if (err) { throw err; }
      else {
        res.render('pages/enquiry', {
          siteTitle: siteTitle,
          moment: moment,
          numeral: numeral,
          currencyFormatter: currencyFormatter,
          pageTitle: "Enquiry List",
          items: result,
          user: req.user
        });
      }
    });
  }

  else {
    db.query(equery, function (err, result) {
      if (err) { throw err; }
      else {
        res.render('pages/enquiry', {
          siteTitle: siteTitle,
          moment: moment,
          numeral: numeral,
          currencyFormatter: currencyFormatter,
          pageTitle: "Enquiry List",
          items: result,
          user: req.user
        });
      }
    });
  }

}

exports.addform = function (req, res) {
  res.render('pages/add-enquiry', {
    siteTitle: siteTitle,
    pageTitle: "New Enquiry",
    items: '',
    user: req.user
  });
}

exports.send = function (req,res) {
  var query = "INSERT INTO `enquiries`(project, location, project_type, consultant, contractor, client, customer_type, customer, contact_per, contact_num, product, qty, amount, reci_date,  sales_per, app_engg, status) VALUES (";
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
  query += " '" + req.body.app_engg + "',";
  query += " 'Processing')";
  db.query(query, function (err, result) {
    res.redirect(baseURL);
  });
}

exports.editform = function (req, res) {
  db.query("SELECT * FROM enquiries WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].reci_date = dateformat(result[0].reci_date, "yyyy-mm-dd");
    result[0].sent_date = dateformat(result[0].sent_date, "yyyy-mm-dd");
    res.render('pages/editenquiry', {
      siteTitle: siteTitle,
      moment: moment,
      pageTitle: "Editing Enquiry : " + result[0].project,
      item: result,
      user: req.user
    });
  });
}

exports.update = function (req, res){
  db.query("UPDATE enquiries SET  project = ?, location = ? , project_type = ? , consultant = ? , contractor = ? , client = ? , customer_type = ? , customer = ? , contact_per = ? , contact_num = ? , product = ? , qty = ? , amount = ? , reci_date = ? , sent_date = ? , sales_per = ? , app_engg = ? , comment = ? , status = ? , offer_file = ? , tds_file = ? WHERE job_ref = ? ", [req.body.project, req.body.location, req.body.project_type, req.body.consultant, req.body.contractor, req.body.client, req.body.customer_type, req.body.customer, req.body.contact_per, req.body.contact_num, req.body.product, req.body.qty, req.body.amount, req.body.reci_date, req.body.sent_date, req.body.sales_per, req.body.app_engg, req.body.comment, req.body.status, req.body.offer_file, req.body.tds_file, req.params.id], function (err, result) {
    if (result) { res.redirect(baseURL); }
    else { console.log(err); }
  });
}

exports.revision = function (req, res) {
  db.query("SELECT * FROM enquiries WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].reci_date = dateformat(result[0].reci_date, "yyyy-mm-dd");
    result[0].sent_date = dateformat(result[0].sent_date, "yyyy-mm-dd");
    res.render('pages/revenquiry', {
      siteTitle: siteTitle,
      moment: moment,
      pageTitle: "Add Revision to Enquiry No. " + result[0].job_ref,
      item: result,
      user: req.user
    });
  });
}

exports.addrevision = function (req, res){
switch (req.body.rev_num) {
  case "R1" : db.query("UPDATE enquiries SET r1amt = ? , r1date = ? , r1note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
    if (result) { res.redirect(baseURL); }
    else { console.log(err); }
  });
  break;
  case "R2" : db.query("UPDATE enquiries SET r2amt = ? , r2date = ? , r2note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
    if (result) { res.redirect(baseURL); }
    else { console.log(err); }
  });
  break;
  case "R3" : db.query("UPDATE enquiries SET  r3amt = ? , r3date = ? , r3note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
    if (result) { res.redirect(baseURL); }
    else { console.log(err); }
  });
  break;
  case "R4" : db.query("UPDATE enquiries SET  r4amt = ? , r4date = ? , r4note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
    if (result) { res.redirect(baseURL); }
    else { console.log(err); }
  });
  break;
  case "R5" : db.query("UPDATE enquiries SET  r5amt = ? , r5date = ? , r5note = ?  WHERE job_ref = ? ", [req.body.amount_r, req.body.sent_date_r, req.body.note, req.params.id], function (err, result) {
    if (result) { res.redirect(baseURL); }
    else { console.log(err); }
  });
  break;
}
}

exports.view = function(req, res) {
  db.query("SELECT * FROM enquiries  WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].reci_date = dateformat(result[0].reci_date, "dd-mmm-yy");
    if (result[0].sent_date != null) { result[0].sent_date = dateformat(result[0].sent_date, "dd-mmm-yy"); }
    if (result[0].r1date != null) { result[0].r1date = dateformat(result[0].r1date, "dd-mmm-yy"); }
    if (result[0].r2date != null) { result[0].r2date = dateformat(result[0].r2date, "dd-mmm-yy"); }
    if (result[0].r3date != null) { result[0].r3date = dateformat(result[0].r3date, "dd-mmm-yy"); }
    if (result[0].r4date != null) { result[0].r4date = dateformat(result[0].r4date, "dd-mmm-yy"); }
    if (result[0].r5date != null) { result[0].r5date = dateformat(result[0].r5date, "dd-mmm-yy"); }
    res.render('pages/viewenquiry', {
      siteTitle: siteTitle,
      moment: moment,
      currencyFormatter: currencyFormatter,
      pageTitle: "Enquiry No. : " + result[0].job_ref,
      item: result
    });
  });
}