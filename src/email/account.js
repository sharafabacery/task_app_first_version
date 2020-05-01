// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
  to: 'abacerysharaf@gmail.com',
  from: 'abacerysharaf@gmail.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg).then(()=>{
  console.log(1)
}).catch((er)=>{
  console.log(er)
})