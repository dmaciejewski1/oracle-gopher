/*****************************************************************
  NAME: gopher-tools.js
  PATH: /lib/gopher-tools.js
  ADVISORY: fetchBindVariableNames uses the "indexOf" method
  (introduced in JavaScript 1.6), and will not work in Internet
  Explorer 8 and earlier versions.
******************************************************************/
"use strict";
var fs = require('fs');
var os = require('os');
var tools = require('./gopher-tools.js');

//a simple json detetctor
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

//Reads a group of json files (from an array of given path
//statements) and returns the first object that matches the
//given name
exports.fetchInputs = function(name,libraries){

 //create a return promise-------------
  return new Promise(function(resolve, reject){
    let response;
    //loop through json text file line by line
    for (let i = 0; i < libraries.length; i++){
      let planFile = fs.readFileSync(libraries[i]).toString().split("\n"),
          obj,
          string = '';
     //Append each new line to the next in string var
      for(let line in planFile) {
        string = (string.concat(planFile[line]));
      }
      if (string.length === 0){reject(name +' not found');}
     //If string var is JSON....
      if (isJson(string)===true) {
        obj = JSON.parse(string);
       //Search for name
        for (let j = 0 ; j < obj.length; j++){
          if(Object.keys(obj[j])==name){
            response = obj[j][Object.keys(obj[j])];
          }
        }
      }else{
        reject('Library files must be in JSON format');
      }
    }

  //some error handling----------------
    //if name or libraries are undefined
    if (name, libraries === undefined){
      reject('Inputs for both \"Name\" and \"Libraries\" must not be undefined');
    }else{
      //if name or libraries are blank
      if(name.length === 0 || libraries.length === 0){
        reject('Inputs for both \"Name\" and \"Libraries\" must not be blank');}
      //if name is not a string
      if (name.constructor  != String) {
        reject('The \"Name\" input must be a String');}
      //if libraries is not an array
      if (libraries.constructor != Array) {
        reject('The \"Libraries\" input must be an Array');}
    }
    //If no data returned
    if (response === undefined) {reject('\"'+name+'\" not found')};
  //return data upon success-----------
    resolve(response);
  });
};

// DEPRECIATE???
//takes a tunnel object and returns Connection Info from a specified java file------------------
exports.fetchConnectionInputs = function (tunnelObj) {
  //create a: "return connection inputs promise"
  return new Promise(function(resolve, reject){
    //run "fetchInputs" function
    //console.log(connectionObject);
    tools.fetchInputs(
      tunnelObj.tunnel,
      tunnelObj.tunnelLibraries
    )
    //collect results upon "fetchInputs" success
    .then(function(connectionObject){
         resolve(connectionObject);
      })
      //1)catch errors from "fetchInputs" call
      //2)rebrand error as a "Connection not found"
      .catch(function(err){
        if(err){
          if (err === 'No inputs not found') {
            reject('Connection not found');
          }else{
            reject(err);
          }
        }
      })
    })
}

//Parses a Db Statement and returns all bind variable names
//(i.e. any word that preceeds a colon ":") within that
//Statment
exports.fetchBindVariableNames = function(dbStatement,callback) {
  //err if dbStatement is not a string
  if (dbStatement.constructor != String)
    {return callback('Db Statement must be a string',undefined);}
  //Use regex to filter for bind variables in the dbStatement
  var bindVariableExtract = dbStatement.match(/\B:[\w]+/g);
  //if no bind variables detected, return null
  if (bindVariableExtract === null)
    {return callback(undefined,null);
  }else{
    var bindVariablesNames = [],
        bindVariableObj={};
    //Collect, format, and remove duplicates
        for (var i = 0; i < bindVariableExtract.length; i++) {
          if (bindVariablesNames.indexOf(bindVariableExtract[i].substr(1)) === -1) {
            bindVariablesNames.push(bindVariableExtract[i].substr(1));
          }
        }
    return callback(undefined,bindVariablesNames);
  }
}

//set defaults or apply overides
exports.setProperties = function (transactionObjOverides, transactionObject,defaultValue) {
  //-------------Bind Variables
    if (!transactionObjOverides.bindVariables) {
      if (!transactionObject["bindVariables"]) {
        Object.assign(transactionObject,{"bindVariables":{}});
      }
    }else{Object.assign(transactionObject,{"bindVariables":transactionObjOverides.bindVariables});}
  //-------------Output Format
    if (!transactionObjOverides.outputFormat) {
      if (!transactionObject["outputFormat"]) {
        Object.assign(transactionObject,{"outputFormat":defaultValue.outputFormat});
      }
    }else{Object.assign(transactionObject,{"outputFormat":transactionObjOverides.outputFormat});}
  //-------------Zero Row Message
    if (!transactionObjOverides.zeroRowMessage) {
      if (!transactionObject["zeroRowMessage"]) {
        Object.assign(transactionObject,{"zeroRowMessage":defaultValue.zeroRowMessage});
      }
    }else{Object.assign(transactionObject,{"zeroRowMessage":transactionObjOverides.zeroRowMessage});}
  //-------------Row Limit
    if (!transactionObjOverides.maxRowsReturned) {
      if (!transactionObject["maxRowsReturned"]) {
        Object.assign(transactionObject,{"maxRowsReturned":defaultValue.maxRowsReturned});
      }
    }else{Object.assign(transactionObject,{"maxRowsReturned":transactionObjOverides.maxRowsReturned});}
  //-------------Response Output
    if (!transactionObjOverides.responseOutput) {
      if (!transactionObject["responseOutput"]) {
        Object.assign(transactionObject,{"responseOutput":defaultValue.responseOutput});
      }
    }else{Object.assign(transactionObject,{"responseOutput":transactionObjOverides.responseOutput});}
  //-------------Time Zone
    if (!transactionObjOverides.timeZone) {
      if (!transactionObject["timeZone"]) {
        Object.assign(transactionObject,{"timeZone":defaultValue.timeZone});
      }
    }else{Object.assign(transactionObject,{"timeZone":transactionObjOverides.timeZone});}
  //-------------
  }

//build connection string and append to connectionObject
exports.setConnectionString = function(connectionObject,err){

      //some validation of connection Object: host port and service or SID must be present
      if (connectionObject.host && connectionObject.port && connectionObject.service ||
          connectionObject.host && connectionObject.port && connectionObject.SID){
        //host and service (or SID) must be a string, and port must be a number
        if(connectionObject.service.constructor, connectionObject.host.constructor === String && connectionObject.port.constructor === Number||
           connectionObject.SID.constructor, connectionObject.host.constructor === String && connectionObject.port.constructor === Number){
          //append new connectionString to connectionObject
          for(var key in connectionObject){
            if(connectionObject.hasOwnProperty(key)){
              if(key==="service"){
                Object.assign(connectionObject,
                 {"connectString" : connectionObject.host+':'+ connectionObject.port+'/'+connectionObject.service}
                );
              }
              if(key==="SID"){
                Object.assign(connectionObject,
                 {"connectString" : connectionObject.host+':'+ connectionObject.port+'/'+connectionObject.SID}
                );
              }
            }
          }

        }else{
          return err('Failed to build connection string. Check Host, Port, and either Service or SID formats. Port must be a number, and Host and Service or SID must be a string.');
        }
      }else{
        return err('Each Connection must have it\'s own defined values for Host, Port, and either Service or SID','Each Connection must have it\'s own defined values for Host, Port, and either Service or SID.');
      }
}

//a simple "select" statement detector
exports.stringStartsWithSelect = function(dbStatement){
  var firstSixChars = dbStatment.slice(0,6).toLowerCase();
  if (firstSixChars === 'select') {
    return false;
  }else{
    return true;
  }
}
