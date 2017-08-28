'use strict'

// Reference the node-schedule npm package.
var schedule = require('node-schedule')
var GoogleSpreadsheet = require('google-spreadsheet') // no typescript definition file exists
var async = require('async')
import {mailAttributes, sendSMTPMail, sendOauth2Mail} from "./CaptiveSignsMail"

let mailOpts = {
    Text: 'The following message is from Steves Node JS process', 
    From: 'captivesigns@gmail.com', 
    To:   'smtaylor88@gmail.com', 
    Subject: 'GSheets to Trello Process - Info'}

const useOAuth2forGMail:boolean = false
// var config = require('config') // no typescript definition file exists

var APP = {
  scheduleJob: function() {
    // This rule is standard cron syntax for once per minute.
    // See http://stackoverflow.com/a/5398044/1252653
    var rule = '* * * * *'

    // var someText = config.get('siteTitle')
    // console.log(process.env.NODE_ENV + ' : ' + someText)

    // Kick off the job
    var job = schedule.scheduleJob(rule, function() {
      console.warn('ping! ' + new Date().toLocaleTimeString())
      AnyNewChangeRequests()
    })
  },

  init: function() {
    APP.scheduleJob()
  }
};

(function(){
  APP.init()
})()


function AnyNewChangeRequests() {
    // spreadsheet key is the long id in the sheets URL 
    var doc = new GoogleSpreadsheet('14t9KeL1mVSAbSXBGQmez0_wQeoQvQzpvf92omsIdsSQ');  
    var sheet;
    var creds = require('../credentials/googlesheetsaccess.json');
    var requestId;

    var trello = {
        CustomLabels: [],
        key: "50c2a05152cfe651a924f13bbe60b427",
        token: "e3e32bb7307a6162f41106c6514f73a44e792fa05904226fb419694a8dd79799", // (mike@captivesigns.com)
        name: "Requestor Name",
        description: "Change Description",
        storenum: "1234", location: "Fresno, CA", type: "ADD", duedate: "", 
        imagename: "", imageurl: "", filename: "", fileurl: ""
    };
 
    var lesSchwabListId = "591dd13309f95b642a64fc9b" // les schwab content - in house 
    var Trello = require("trello");
    var trelloapi = new Trello(trello.key, trello.token);
    var newTrelloCard;

    GSheetData();

    function GSheetData() {
        async.series([

            // authenticate against the Google oAuth server using Nodejs special credentails
            function(step) {
                // see notes below for authentication instructions! 
                doc.useServiceAccountAuth(creds, step)
                console.log("Step 1 - Authenticated Google Spreadsheet")
                if (useOAuth2forGMail) {
                    sendOauth2Mail({subject: mailOpts.Subject, from: mailOpts.From, to: mailOpts.To, text: mailOpts.Text})
                } else {
                    sendSMTPMail({subject: mailOpts.Subject, from: mailOpts.From, to: mailOpts.To, text: mailOpts.Text})
                }
            },

            // open the spreadsheet document and it's 1st worksheet and show some identifying details
            function(step) {
            doc.getInfo(function(err, info) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('Loaded SpreadSheet: %s by %s', info.title, info.author.email);
                    sheet = info.worksheets[0];
                    console.log('Worksheet Name: %s  (Size: %s Rows x %s Columns)', sheet.title, sheet.rowCount, sheet.colCount);
                    step();
                });
            },

            function(step) {
                // get the specified rows from the spreadsheet - there may be more than 1, but just process a single row per exectuion
                sheet.getRows({query: 'totrello=""'}, function( err, rows ){
                    if( rows.length > 0 ) {
                        // the row is an object with keys set by the column headers 
                        console.log('Latest Change created: %s', rows[0].requestdate);
                        console.log('By: %s %s', rows[0].firstname, rows[0].lastname);
                        console.log('Changes To Send to Trello: %s', rows.length);
                        requestId = rows[0].requestid;
                        // transfer spreadsheet values onto the trello array for processing to a new card
                        // NOTE: Special formatting used by Trello is "Markdown" (see: https://daringfireball.net/projects/markdown/basics)
                        trello.name = rows[0].firstname + ' ' + rows[0].lastname;
                        trello.description = "**REQUESTED BY:** " + trello.name
                        + "\n **STORE NUMBER:** " + trello.storenum + "\n **LOCATION:** " + trello.location + "\n **DESCRIPTION:** " + rows[0].description;
                        trello.CustomLabels = rows[0].storenumber;
                        trello.storenum = rows[0].storenumber;
                        trello.location = rows[0].location;
                        trello.type = rows[0].type;
                        trello.duedate = rows[0].playbegin;
                        trello.imagename=  rows[0].image1;
                        trello.imageurl = rows[0].image1url;
                        trello.filename = rows[0].file1;
                        trello.fileurl = rows[0].file1url;
                    } else {
                        mailOpts.Text = "No change requests to process! (" + new Date() + ")";
                        if (useOAuth2forGMail) {
                            sendOauth2Mail({subject: mailOpts.Subject, from: mailOpts.From, to: mailOpts.To, text: mailOpts.Text})
                        } else {
                            sendSMTPMail({subject: mailOpts.Subject, from: mailOpts.From, to: mailOpts.To, text: mailOpts.Text})
                        }
                        return console.warn(mailOpts.Text);
                    }
                    step();
                })
            },

            function(step) {
                // add a new trello card to the specified List (on some board)
                trelloapi.addCard('Change Request (' + trello.name + ') ( via appsheet)', 
                    trello.description, lesSchwabListId,
                    function (error, trelloCard) {
                        if (error) {
                            console.error('Could not add card:', error);
                        }
                        else {
                            console.log('Added card:', trelloCard);
                            newTrelloCard = trelloCard;

                            trelloapi.updateCard(trelloCard.id, "due", trello.duedate);

                            // create other parts of the card here
                            if (trello.imageurl !== ''){
                                trelloapi.addAttachmentToCard(trelloCard.id, trello.imageurl, 
                                function (error, attachmentID){
                                    console.log('Added attachment:', attachmentID);
                                });
                            }
                            if (trello.fileurl !== ''){
                                trelloapi.addAttachmentToCard(trelloCard.id, trello.fileurl, 
                                function (error, attachmentID){
                                    console.log('Added attachment:', attachmentID);
                                });
                            }
                        }
                        step();
                    });
            },

            function(step) {
                // if we have created a trello card, set the 'toTrello' date with the current date/time on spreadsheet to it wont be done again
                try {
                    var rqstId = "requestid="+requestId;
                    // search for the spreadsheet row just added (by unique id)
                    sheet.getRows({query: rqstId}, function( err, rows ){
                        if( rows.length > 0 ) {
                            rows[0].totrello = Date();
                            rows[0].save(); // this is async
                        }
                        else {
                            // roll back any card added (this may show internal server errors for attachments! no problem tho.)
                            trelloapi.deleteCard(newTrelloCard.id, function (err){
                                console.warn('Trello Card Removed!');
                            });
                            return console.error('SERIOUS ERROR!!! Unable to set ToTrello Date!!!');                            
                        }
                        step();
                    });
                } catch (ex) {
                    // unknown error
                    return console.error('BIG BAD ERROR!!! Unknown issue setting ToTrello Date!!!');
                }
            }
        ],

        function(err){
            if( err ) {
            console.error('Error: '+err);
            }

            return trello;
        });
    };
}
