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

var squery = "SELECT * FROM salesorder_b";
var azequery = "SELECT * FROM salesorder_b WHERE sales_per = 'Azeem';";
var azequery1 = "SELECT SUM(amount) as total FROM salesorder_b WHERE sales_per = 'Azeem';";
var smquery = "SELECT * FROM salesorder_b WHERE sales_per = 'Suresh M';";
var smquery1 = "SELECT SUM(amount) as total FROM salesorder_b WHERE sales_per = 'Suresh M';";
var faquery1 = "SELECT SUM(amount) as total FROM salesorder_b WHERE sales_per = 'Factory';";
var squery1 = "SELECT SUM(amount) as total FROM salesorder_b";

exports.list = function (req, res) {

  db.query(squery, function (err, result) {
    if (err) { throw err; }
    else {
      db.query(squery1, function (err, result1) {
        if (err) throw err;
        else {
          db.query(azequery1, function (err, result2) {
            if (err) throw err;
            else {
              db.query(smquery1, function (err, result3) {
                if (err) throw err;
                else {
                  db.query(azequery, function (err, azeresult) {
                    if (err) throw err;
                    else {
                      db.query(faquery1, function (err, result4) {
                        if(err) throw err;
                        else{
                          res.render('pages/salesorder', {
                            siteTitle: siteTitle,
                            moment: moment,
                            numeral: numeral,
                            currencyFormatter: currencyFormatter,
                            pageTitle: "Sales Order",
                            salesf: result4[0].total,
                            salest: result1[0].total,
                            salesa: result2[0].total,
                            saless: result3[0].total,
                            items: result,
                            azeitems: azeresult,
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
      });
    }
  });

}

exports.addorderform = function (req, res) {
  db.query("SELECT * FROM enquiries WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].reci_date = dateformat(result[0].reci_date, "yyyy-mm-dd");
    result[0].sent_date = dateformat(result[0].sent_date, "yyyy-mm-dd");
    res.render('pages/add-salesorder', {
      siteTitle: siteTitle,
      moment: moment,
      pageTitle: "Book Job#" + result[0].job_ref,
      item: result,
      user: req.user
    });
  });
}

exports.send = function (req, res) {
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
  db.query(query, function (err, result) {
    if (err) { throw err; }
    else {
      db.query("UPDATE `salesflow`.`enquiries` SET `status`='Booked' WHERE `job_ref`='" + req.body.job_ref + "'; ", function (err, result1) {
        if (result1) { res.redirect(baseorderURL); }
      });
    }
  });
}

exports.editform = function (req, res) {
  db.query("SELECT * FROM salesorder_b WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].order_date = dateformat(result[0].order_date, "yyyy-mm-dd");
    result[0].po_date = dateformat(result[0].po_date, "yyyy-mm-dd");
    result[0].deli_date = dateformat(result[0].deli_date, "yyyy-mm-dd");
    if(result[0].app_date!=null){result[0].app_date = dateformat(result[0].app_date, "yyyy-mm-dd");}
    res.render('pages/editorder', {
      siteTitle: siteTitle,
      moment: moment,
      pageTitle: "Editing Order : " + result[0].project,
      item: result,
      user: req.user
    });
  });
}

exports.update = function (req, res) {
  db.query("UPDATE salesorder_b SET job_ref = ?, order_date = ?, project = ?, customer = ?, sales_per = ?, po_num = ?, po_date = ?, qty = ?, amount = ?, discount = ?, advance_amt = ? , deli_date = ? , app_date = ? , pay_term = ? , lead_time = ? , remarks = ?, po_file = ? WHERE job_ref = ? ", [req.body.job_ref, req.body.order_date, req.body.project, req.body.customer, req.body.sales_per, req.body.po_num, req.body.po_date, req.body.qty, req.body.amount, req.body.discount, req.body.advance_amt, req.body.deli_date, req.body.app_date, req.body.pay_term, req.body.lead_time, req.body.remarks, req.body.po_file, req.params.id], function (err, result) {
    if (result) {
      res.redirect("/vieworder/" + req.params.id + "");
    }
  });
}

exports.view = function (req, res) {
  db.query("SELECT * FROM salesorder_b  WHERE job_ref = '" + req.params.id + "'", function (err, result) {
    result[0].order_date = dateformat(result[0].order_date, "dd-mmm-yy");
    result[0].po_date = dateformat(result[0].po_date, "dd-mmm-yy");
    result[0].deli_date = dateformat(result[0].deli_date, "dd-mmm-yy");
    result[0].app_date = dateformat(result[0].app_date, "dd-mmm-yy");
    res.render('pages/vieworder', {
      siteTitle: siteTitle,
      moment: moment,
      currencyFormatter: currencyFormatter,
      pageTitle: "Job No. : " + result[0].job_ref,
      item: result
    });
  });
}