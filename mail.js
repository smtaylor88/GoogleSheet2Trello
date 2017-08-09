var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var transporter = {};

exports.createCaptiveSignsMail = function(options) {
    if (!options.useOAuth2) {
        transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'smtaylor88@captivesigns.com',
            pass: 'ChopperDog88!'
            }
        })
    } else {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                    type: "OAuth2",
                    //scope: 'https://mail.google.com/',
                    //service: 'captivesigns-gmail-access@captivesigns-gmailaccess.iam.gserviceaccount.com',
                    //serviceClient: '117032133099288821652',
                    user: 'smtaylor88@captivesigns.com',
                    clientId: '358620205155-05uh3h98rbeta4bp8qt843q08rsk692j.apps.googleusercontent.com',
                    clientSecret: 'k52xB-oMwQRNmCN7APFGISe9',
                    refreshToken: '1/5S5H5853FRsG75soosZDO176zf9lmoRFc-5Z12qB9g0'
                    //accessToken: 'ya29.GludBMQXugZyGf3u6TICEU54bSxcZPRr1SWevTjTI158txAc0Y87doQ4nitTAB6Pa6W97469h9tyoXkO_nPKgA_bkl34zaP65j0fEouVfHiDvH2Z5VUqb_UGojUg',
                    //privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxRfbeI8BRS2v+\noJAezhR2RdPzXmcXsMZR+2xK4q+nHEWyf/bSpKAlLrdv7Qnpxd4N/9tT4tmeLe+b\nj59gvScYb0R8ykwJbaRJyjTs2CGP+g+fYGmenT98F1UhS392rsHNyV30bHRsjP1U\n5Up004CzcLhCyeMS4SItN+Q+4alvhZCag0nCngOchVFQXwxqn2iZIBkjbVuiApdw\ntZ90n1RYCGuxjgRZkgtf6CTWMS6wf9tDuQcJUnKi/ADyAIM0WP4P84EVymXYtJD2\nREAtLHFdMyuzs/nfkP9ON5DkfK5VFzHihaS132o4B4F3AlFcOXRN0xo5haiwIn8b\nCrPlY1MrAgMBAAECggEAVx/lLBkTEIFKcurT2if7e4NnH2Gitkx9s9YnS4isvqtQ\n/+EPXEhnos6afipYKGpEb8nzL/+6Z5j4/ZHxSTi9qa8p0FEWXL3jtBZqu4qfuCS0\nn+ZhEoEDLghDoSj7XMeX3X1drV7OO3lxmlNUrCU0yDwae0zAyssWInYpOdRrkzCV\n6e6ktJ2ak4S1hQn7vWeEv19BFoUbhPmBE7lPvViI1zRfqYMqRi0B1hypZAQyKAh7\naFTbswlA+TxTfydTdEcc0hUME6ewvusdrGwMOUfFGIZrZg+ChXOgF3NGsDsu65uO\n/+FxDPAGbackIMQvj+NVHnI3VnbER+Vs+YMG+rJgXQKBgQDp0O3c5gvMCO3jzLSA\nNtKtPYXP0px2ci/VU5gyFmgOOvoJ5W7QIGBX30BuCBPeZ2jaGlvxD3CCfRTfX4A6\nkIH1xZJjSH0TIiR6KwQvAXhUeXpnV8gKsraOFYyAIVSUwDPA/qshteGcA1hmdpwx\nVjj1EY6lWudPrdTa8yMX7ueofQKBgQDCF7AZ+206znChJnjpEDPlL1MVuSfEJoMV\nXepkxF93G1mB2zt7B3UfqVhCHJePVbvlwSbZQy7cxWBcD78emC0BNx5XHv8/PmUJ\nxFVyKT5kfYvq0cZX/kfw6KczoEMaGIz2WEacz9uiYBVUeVpAj9QVbxFxuITmfEdx\nXm6FpKXixwKBgQDI2Nf6sQHhOqpezDEhEfbXKcoQQ3JzrJK6RRyvqd+ombC/X35Y\n+fbIhNXrrrSij2HaOFpSMFkNPjT3zClyJT/9xsGA13vZO7Lp3pmxZyneJpumuhj0\nV5/JXWlbh0YIoTHTzu9h/cLXKWh+W9S/7Ljwiyxljji0kTYO/lxe6rHEYQKBgH3U\nzZ6Kmm4dmHdhcdHnZz2WSM80kstgDGu1z1g0149oc8b0UsOYOh6ks0tpLfkHJCH3\n7y+7lo4aiDYnH0i+b67yBQGGXwSpdue2GY9BnemYWzWJeoVhnVJaAsw9gkNQ11J+\nOIlBWKsUj7+MTS6+EEk1EKIhdkfXGpotFooeDE3RAoGBAK2txCAUsyui6h12Nzk4\np8C1bNYpbUpwjKsQL9tEZgsqJVPvGnl6a+6WbU2nE4SPnk2zOq9FgDTwh11bQZjw\n7Chs37rwPs/YkjxR0neEFqRMYcHPf5kUMRkrDM4fCj9MTTGjCsqjqdYlnfVY1zRT\nxExbuP34BnJFdwfZ2yayugep\n-----END PRIVATE KEY-----\n'
                }
        });
    }

    var msg = options.mailmessage;
    var mailOptions = {
    from: 'captivesigns@gmail.com',
    to: 'smtaylor88@gmail.com',
    subject: 'GSheets to Trello Process - Info',
    text: 'The following message is from Steves Node JS process: \n\n' + msg
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log('Thise is  the error: ' + error);
        var x = error.message;
        console.log(x);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });

}