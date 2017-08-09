var app = require('express')()
    , exprss = require('express')
    , server = require('http').Server(app)
    , path = require('path')
    , sendmail = require('./mail');

// by default, when running on Modulus, port 8080 is used
var port = process.env.PORT || 8080;
if (app.get("env") === 'development') {
    port = 8889;
}

server.on('listening', function () {
    //console.log('ok, server is running');
});

server.listen(port, () => console.log('ok, server is running'));
console.log('Listening on port: %s', port);

// routing
app.get('/LastLogRow', function (req, res) {
    console.log("LastLogRow called...");
    GSheetData();
    res.write('<h1>Hello World!' + JSON.stringify(trello));
    res.send();
});

// routing
app.get('/LastRowProcessed', function (req, res) {
    console.log("LastRowProcessed called...");
    debugger;
    LastRowProcessed();
    res.write('<p>Last Row Processed!');
    res.send();
});

/* -------------------------------------------------------------------------- */

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
 
// spreadsheet key is the long id in the sheets URL 
var doc = new GoogleSpreadsheet('14t9KeL1mVSAbSXBGQmez0_wQeoQvQzpvf92omsIdsSQ');
var sheet;

var creds = require('./credentials/google-generated-creds.json');

var trello = {
  Board: "test",
  List: "list item",
  Name: "RequestBy",
  Description: "Here is my Description",
  Label: "none",
  CustomLabels: "Store #123"
};

function GSheetData() {
async.series([
  function setAuth(step) {
    // see notes below for authentication instructions! 
    doc.useServiceAccountAuth(creds, step);
    console.log("Authenticated sheet: " + doc);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded SpreadSheet: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      console.log('work sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      sheet2 = info.worksheets[1];
      console.log('work sheet 2: '+sheet2.title+' '+sheet2.rowCount+'x'+sheet2.colCount);

      trello.Board = "Les Schwab Content - In Houz";
      trello.Name = "Steve Test";
      trello.Description = "My test description";
      step();
    });
  },
  function workingWithRows(step) {
    // google provides some query options 
    sheet.getRows(function( err, rows ){
      console.log('Read '+ rows.length + ' rows');
 
      // the row is an object with keys set by the column headers 
      //rows[0].colname = 'new val';
      //rows[0].save(); // this is async 
 
      // deleting a row 
      // rows[0].del();  // this is async 
      step();
    })
  }], 
  function(err){
    if( err ) {
      console.log('Error: '+err);
    }

    return trello;
  });
};


function LastRowProcessed() {
async.series([
  function setAuth(step) {
    // see notes below for authentication instructions! 
    doc.useServiceAccountAuth(creds, step);
    console.log("Authenticated sheet: " + doc);
  },
  function getLastRow(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded SpreadSheet: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[1];
      console.log('Viewing Worksheet: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      step();
    });
  },
  function workingWithRows(step) {
    // google provides some query options 
    sheet.getRows({
      offset: 1,
      limit: 1
    }, function( err, rows ){
      console.log('Read '+ rows.length + ' rows');
      // the row is an object with keys set by the column headers 
      console.log('Last Row Processed: ' + rows[0].lastrowsent);
      sendmail('You done good!');
      step();
    })
  }], 
  function(err){
    if( err ) {
      console.log('Error: '+err);
    }

    return trello;
  });
};

function xxxsendmail(msg) {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'smtaylor88@captivesigns.com',
        pass: 'ChopperDog88!'
    }
    });
 
    var mailOptions = {
    from: 'mike@captivesigns.com',
    to: 'smtaylor88@gmail.com',
    subject: 'Error During Les Schwab Trello Card creation',
    text: 'The following error occurred: ' + msg
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
        var x = error.message;
        console.log(x);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}