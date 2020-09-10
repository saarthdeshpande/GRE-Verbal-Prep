var express = require('express');
var router = express.Router();
const paypal = require('paypal-rest-sdk')
const Payment = require('../models/payment')
require('../src/paypal')

router.post('/donate', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": process.env.PAYPAL_RETURN_URL,
            "cancel_url": process.env.PAYPAL_CANCEL_URL
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Contribute towards maintenance and further development!",
                    "sku": "GREVP5USD",
                    "price": "5.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "5.00"
            },
            "description": "Donate towards the development of this Web Application."
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
           for(let i = 0;i < payment.links.length;i++) {
               if(payment.links[i].rel === 'approval_url') {
                   res.redirect(payment.links[i].href)
               }
           }
        }
    });
});

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "5.00"
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            const newPayment = new Payment({ payment_id: payment.id, state: payment.state, payer_id: payment.payer.payer_info.payer_id,
                payment_method: payment.payer.payment_method, payer_email: payment.payer.payer_info.email })
            await newPayment.save()
            if (req.session.user) {
                res.render('thankyou', {image: req.session.user.picture})
            } else {
                res.render('thankyou', {layout: 'newLayout.hbs'})
            }
        }
    });
})


module.exports = router