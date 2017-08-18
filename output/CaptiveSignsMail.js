"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
function sendSMTPMail(mailOptions) {
    nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'smtaylor88@captivesigns.com',
            pass: 'ChopperDog88!'
        }
    }).sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('This is  the error: ' + error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}
exports.sendSMTPMail = sendSMTPMail;
function sendOauth2Mail(mailOptions) {
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: 'smtaylor88@captivesigns.com',
            clientId: '358620205155-05uh3h98rbeta4bp8qt843q08rsk692j.apps.googleusercontent.com',
            clientSecret: 'k52xB-oMwQRNmCN7APFGISe9',
            refreshToken: '1/5S5H5853FRsG75soosZDO176zf9lmoRFc-5Z12qB9g0'
        }
    }).sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('This is  the error: ' + error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}
exports.sendOauth2Mail = sendOauth2Mail;
//# sourceMappingURL=CaptiveSignsMail.js.map