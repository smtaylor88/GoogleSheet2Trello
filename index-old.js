// Reference the node-schedule npm package.
var schedule = require('node-schedule');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

var APP = {
  scheduleJob: function() {
    // This rule is standard cron syntax for once per minute.
    // See http://stackoverflow.com/a/5398044/1252653
    rule = '* * * * *'

    // Kick off the job
    var job = schedule.scheduleJob(rule, function() {
      console.log('ping! ' + new Date().toLocaleTimeString());
      AnyLesSchwabChangeRequests();
    });
  },

  init: function() {
    APP.scheduleJob();
  }
};

(function(){
  APP.init();
})();


function AnyLesSchwabChangeRequests() {
    // spreadsheet key is the long id in the sheets URL 
    var doc = new GoogleSpreadsheet('14t9KeL1mVSAbSXBGQmez0_wQeoQvQzpvf92omsIdsSQ');
    var sheet;
    var creds = require('./credentials/google-generated-creds.json');
    var anyItems = false;
    var requestId;
    var lesSchwabListId = "591dd13309f95b642a64fc9b" // les schwab content - in house Trello Key

    var trello = {
        key: "50c2a05152cfe651a924f13bbe60b427",
        token: "e3e32bb7307a6162f41106c6514f73a44e792fa05904226fb419694a8dd79799", // (mike@captivesigns.com)
        name: "Requestor Name",
        description: "Change Description",
        storenum: "1234", location: "Fresno, CA", type: "ADD", duedate: "", 
        imagename: "", imageurl: "", filename: "", fileurl: ""
    };


    GSheetData();

    function GSheetData() {

                doc.useServiceAccountAuth(creds);
                console.log("Authenticated sheet: " + doc);

                doc.getInfo(function(err, info) {
                    console.log('Loaded SpreadSheet: '+info.title+' by '+info.author.email);
                    sheet = info.worksheets[0];
                    console.log('work sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
                });

                sheet.getRows({query: "!totrello"}, function( err, rows ){
                    if ( rows ) {
                        if( rows.length > 0 ) {
                            // the row is an object with keys set by the column headers 
                            console.log('Latest Change created: ' + rows[0].requestdate);
                            console.log('By: ' + rows[0].firstname + ' ' + rows[0].lastname);
                            console.log('Changes To Send to Trello: ' + rows.length);
                            requestId = rows[0].requestid;
                            trello.name = rows[0].firstname + ' ' + rows[0].lastname;
                            trello.description = rows[0].description;
                            trello.CustomLabels = rows[0].storenumber;
                            trello.storenum = rows[0].storenumber;
                            trello.location = rows[0].location;
                            trello.type = rows[0].type;
                            trello.duedate = rows[0].playbegin;
                            trello.imagename=  rows[0].image1;
                            trello.imageurl = rows[0].image1url;
                            trello.filename = rows[0].file1;
                            trello.fileurl = rows[0].file1url;
                        }
                    } else {
                        throw new Error("No change requests to process!");
                    }
                });

/*
            function(step) {
                var Trello = require("trello");
                var trelloapi = new Trello(trello.key, trello.token);
                trelloapi.addCard('Change Request (' + trello.name + ') (appsheet)', 
                    trello.description, lesSchwabListId,
                    function (error, trelloCard) {
                        if (error) {
                            console.log('Could not add card:', error);
                        }
                        else {
                            console.log('Added card:', trelloCard);

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
                // if we have made the trello card, update the 'toTrello' with the current date/time on spreadsheet
                var rqstId = "requestid="+requestId;
                sheet.getRows({query: rqstId}, function( err, rows ){
                    rows[0].totrello = Date();
                    rows[0].save(); // this is async 
                    step();
                })
            }

        function(err){
            if( err ) {
            console.log('Error: '+err);
            }

            return trello;
        });
    */
    };
}
