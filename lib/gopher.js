/*****************************************************************
  NAME: gopher.js
  PATH: /lib/gopher.js
  WHAT: Facilitates data transactions between this module and
        the oracledb Database driver "oracledb". Applies
        application defaults when necessary, utilizes other gopher
        function libraries and returns a dataset based on set inputs.
******************************************************************/
"use strict";

//include gopher libraries-------------------------------------------------
var connection = require('./gopher-connect.js');
var tools = require('./gopher-tools.js');


//Set Constants/Defaults---------------------------------------------------
//TIME ZONE DEFAULT
const TIME_ZONE_DEFAULT = 'utc'; //choose either 'local' or 'utc'
//NO ROWS RETURNED MESSAGE DEFAUT-----------
//the default message returned if no rows are returned via the transaction plan
const ZERO_ROW_MESSAGE_DEFAULT = "0 rows returned";

//NUMBER OF ROWS RETURNED DEFAULT-----------
//the default for the number of rows that are be returned from queries. can be
//overidden by including/setting the "maxRowsReturned" property within the
//transaction plan
const MAX_ROWS_RETURNED_DEFAULT = 2000;

//RETURNED DATA FORMAT----------------------
const OUTPUT_FORMAT_DEFAULT = "json";
//the default for the format used for data returned from queries. choose "json"
//or "array". can be overidden by including/setting the "outputFormat" properties
//within the transaction plan

//AMOUNT OF RESPONSE DEFAULT-----------------
//the level of response verbosity from your gopher...add what is needed to the array.
// the choices: 'dbResponse', 'metaData', 'dbStatement', 'metics', 'host', 'network', 'connection'
const RESPONSE_OUTPUT_DEFAULT =['dataOnly'];

//CONFIGURE CONSOLE PROMPT------------------
const PROMPT_DISPLAY_TEXT = '<GOPHER}~';
const COLOR_CODE = 3;  //CODES: 0=Black, 1=Red, 2=Green, 3=Yellow, 4=Blue, 5=Magenta, 6=Cyan, 7=White

//CONFIGURE ERROR PROMPT--------------------
const ERROR_PROMPT_DISPLAY_TEXT = 'ERROR:';
const ERROR_COLOR_CODE = 1; //CODES: 0=Black, 1=Red, 2=Green, 3=Yellow, 4=Blue, 5=Magenta, 6=Cyan, 7=White



var GOPHER_PROMPT = '\x1b[3'+COLOR_CODE+'m'+'\n'+PROMPT_DISPLAY_TEXT+' \x1b[0m';
var GOPHER_ERROR_PROMPT = GOPHER_PROMPT+'\x1b[3'+ERROR_COLOR_CODE+'m'+ERROR_PROMPT_DISPLAY_TEXT+' \x1b[0m';
//Goppher Constructor:
//--------------------------------------------------------------------------------------------------------------
function Gopher(tunnelObj) {

  this.tunnelObj = tunnelObj;
  this.fetchConnectionInputs =  tools.fetchConnectionInputs;// perhaps put this into the callback function itself (below)???
  this.setProperties = tools.setProperties; // perhaps put this into the callback function itself (below)???
  this.defaultObj = {
    "maxRowsReturned" : MAX_ROWS_RETURNED_DEFAULT,
    "outputFormat"    : OUTPUT_FORMAT_DEFAULT,
    "zeroRowMessage"  : ZERO_ROW_MESSAGE_DEFAULT,
    "responseOutput"  : RESPONSE_OUTPUT_DEFAULT,
    "timeZone"        : TIME_ZONE_DEFAULT
  };

}

//Constructor Prototypes:
//--------------------------------------------------------------------------------------------------------------
Gopher.prototype.run = function (transactionPlan,callback){
      let setProperties = this.setProperties;
      let defaultObj = this.defaultObj;

  //gopherTime.getTimestampObjFunc(function(timeresponse){console.log(timeresponse)});
      //upon retrieval of inputs....
      this.fetchConnectionInputs(this.tunnelObj)
        //when successfull...
        .then(
          //using the output from fetchConnectionInputs...
          function(connectionObject){
            //get inputs from config file
            tools.fetchInputs(transactionPlan.transaction,connectionObject.transactionLibraries)
              .then(
                function(transactionObject){
                //apply defaults/overrides
                setProperties(transactionPlan,transactionObject,defaultObj);
                //send transaction to oracle driver
                connection.sendTransaction(
                  connectionObject,
                  transactionObject,
                  function(err,res){
                    //when error using oracle driver, handle...
                    if(err){
                      //display error on console
                      console.log(GOPHER_ERROR_PROMPT+err+'\n');
                      return callback(err,res);
                    }
                    callback(err,res);
                })

              })
              //when error in fetching transaction inputs, handle...
              .catch(function(err,res){
                //display error on console
                console.log(GOPHER_ERROR_PROMPT+err+'\n');
                reject(err,'ERROR');
              })
        })
        //when error in fetching connection inputs, handle...
        .catch(function(err,res){
          //display error on console
          console.log(GOPHER_ERROR_PROMPT+err+'\n');
          //Object.assign(transactionObject,{"endTimeObject":gopherTime.getTimestampObj});

          reject(err,'ERROR');
        })
}
module.exports = Gopher;
