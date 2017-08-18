import nodemailer = require('nodemailer');
import xoauth2 = require('xoauth2');  // no typescript definition file exists

    export interface mailAttributes {
        from: string
        to: string
        subject: string        
        text: string
    }

    export function sendSMTPMail (mailOptions: mailAttributes) {
        nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'smtaylor88@captivesigns.com',
            pass: 'ChopperDog88!'
            }
        }).sendMail(mailOptions, function(error, info){
            if (error) {
                console.error('This is  the error: ' + error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    export function sendOauth2Mail (mailOptions: mailAttributes) {
        nodemailer.createTransport({
            service: 'gmail',
            auth: {
                    type: "OAuth2",
                    user: 'smtaylor88@captivesigns.com',
                    clientId: '358620205155-05uh3h98rbeta4bp8qt843q08rsk692j.apps.googleusercontent.com',
                    clientSecret: 'k52xB-oMwQRNmCN7APFGISe9',
                    refreshToken: '1/5S5H5853FRsG75soosZDO176zf9lmoRFc-5Z12qB9g0'
                }
            }).sendMail(mailOptions, function(error, info){
                if (error) {
                    console.error('This is  the error: ' + error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
    }
