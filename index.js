require("dotenv").config();
const bodyParser = require("body-parser");
const dateFormat = require("dateformat");
const cors = require("cors");
const express = require("express");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const { check, validationResult } = require("express-validator");

const app = express().use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const options = {
  auth: {
    api_key: process.env.SENDGRID_PASSWORD,
  },
};

const client = nodemailer.createTransport(sgTransport(options));

//const contactAddress = "step2wellbeing@gmail.com";
//const contactAddress = "adam.wright90@yahoo.co.uk";

/*const mailer = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "adamjwright32@gmail.com",
    pass: "Zeppelin32?",
  },
});*/

app.post("/booking", function (req, res) {
  console.log("req", req);
  const email = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "Booking from Website",
    html: `<div>
				<div><strong>Name:</strong> ${req.body.name}<br/></div>
				<div><strong>Email:</strong> ${req.body.email}<br/></div>
				<div><strong>Phone:</strong> ${req.body.phone}<br/></div>
				<div><strong>Postcode:</strong> ${req.body.postcode}<br/></div>
				<div><strong>Service:</strong> ${req.body.treatment}<br/></div>
				<div<strong>Date:</strong> ${dateFormat(req.body.date, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</div>
				<div><strong>Comment:</strong> ${req.body.message}<br/></div>
			</div>`,
  };

  client.sendMail(email, function (err, info) {
    console.log("error", err);
    console.log("info", info);
    if (err) {
      return res.status(500).send(err);
    } else {
      res.json({ success: true, info });
    }
  });
});

app.set("port", 3000);

app.listen(app.get("port"), function () {
  console.log("we are listening on: ", app.get("port"));
});
