var express = require('express');
var router = express.Router();
const { isLoggedOut } = require('../middleware/auth')
require('../src/sendgrid')
const sgMail = require('@sendgrid/mail');

router.get('/about', isLoggedOut, function (req, res, next) {
  try {
    res.render('about', {layout: 'newLayout.hbs'})
  } catch(e) {
    console.log(e)
  }
})

router.get('/contactMe', function (req, res, next) {
  try {
    if (req.session.user) {
      res.render('contactMe', {image: req.session.user.picture})
    } else {
      res.render('contactMe', {layout: 'newLayout.hbs'})
    }

  } catch(e) {
    console.log(e)
    res.redirect('/')
  }
})

router.post('/contactMe', function (req, res, next) {
  try {
    console.log(req.body)
    const msg = {
      to: process.env.SENDER_EMAIL,
      from: process.env.RECEIVER_EMAIL, // Use the email address or domain you verified above
      subject: `GRE Verbal Prep - Mail from ${req.body.name}`,
      text: `Name: ${req.body.name}\nE-Mail ID: ${req.body.email}\n\nMessage:\n\n` + req.body.message
    }

    sgMail.send(msg).then(() => {}, error => {
          console.error(error);
          if (error.response) {
            console.error(error.response.body)
          }
        });
    res.redirect('/')
  } catch(e) {
    console.log(e)
    res.redirect('/')
  }
})

module.exports = router;
