/*****************************************************************
  NAME: gopher.js
  PATH: /lib/gopher.js
  WHAT: Facilitates data transactions between this module and
        the Node Oracle Database driver "oracledb".  Returns
        a dataset (in json or as an array) based on set inputs.
******************************************************************/
var oracledb = require('oracledb');

//Set Defaults---------------------------------------
//These can be overidden by including/setting the "maxRowsReturned" or "outputFormat" properties within the "garden" object

//NUMBER OF ROWS RETURNED:
var maxRowsReturnedDEFAULT = 2000;  //set the default for the number of rows that are be returned from queries

//CALLBACK DATA FORMAT:
var outputFormatDEFAULT = "json"; //set the default for the format used for data returned from queries. choose "json" or "array"



function Gopher(tunnel) {

 //Define variables----------------------------------

    this.errorMsg = undefined;
    this.result = "ERROR";
    this.tunnel = tunnel;

    //these are mandatory variables that must be explicitly defined/set upon instantiation and included within the "garden"
    this.usr = undefined;
    this.pwd = undefined;
    this.conStr = undefined;
//*
    this.dbStmt = undefined;

    //these are mandatory, but if not explicitly defined, will be set to a default value upon instantiation
    this.outputFrmt = outputFormatDEFAULT; // use default (above) if not explicitly set/defined in the "garden"
    this.maxRowsRetrnd = maxRowsReturnedDEFAULT; // use default (above) if not explicitly set/defined in the "garden"

    //these variables are not mandatory
    this.bindVars = {};
//*/
 //Loop through the "tunnel" object---------------------------
    for (var key in tunnel) {

      if (tunnel.hasOwnProperty(key)) {
          //set what keys/properties to look for, cache (from within the "tunnel" object), and/or validate
          if (key === "user") {this.usr = tunnel[key];} // sets the user/schema name used for logging on
          if (key === "password") {this.pwd = tunnel[key];} // sets the password used for logging on
          if (key === "connectString") {this.conStr = tunnel[key];} // sets the connection string used to connect to an oracle database... use the following format: host.com:port/db.com
      }
    }
}

Gopher.prototype = {
    validateTunnel : function (callback) {
        //Validate inputs---------------------------------
           //these inputs must NOT be undefined
           if (this.usr  === undefined ||
               this.pwd  === undefined ||
               this.conStr  === undefined) {

                   this.errorMsg = 'INVALID TUNNEL: user, password, and connectString must NOT be \"undefined\"';
                   return callback(this.errorMsg,this.result);
           }

           //these inputs must NOT be null
           if (this.usr  === null ||
               this.pwd  === null ||
               this.conStr  === null) {

                   this.errorMsg = 'INVALID TUNNEL: user, password, and connectString must NOT be \"null\"';
                   return callback(this.errorMsg,this.result);
           }

           //these inputs must be a string
           if (typeof this.usr  !== "string" ||
               typeof this.pwd  !== "string" ||
               typeof this.conStr  !== "string") {

                   this.errorMsg = 'INVALID TUNNEL: user, password, and connectString must be a string';
                   return callback(this.errorMsg,this.result);
           }

           //these inputs must NOT be an empty string (blank)
           if (this.usr  === "" ||
               this.pwd  === "" ||
               this.conStr  === "") {

                   this.errorMsg = 'INVALID TUNNEL: user, password, and connectString must NOT be an empty string';
                   return callback(this.errorMsg,this.result);
           }

           this.result = 'TUNNEL VALID';
           return callback(this.errorMsg,this.result);

    },

    validateGarden: function (garden, callback) {
        for (var key in garden) {

          if (garden.hasOwnProperty(key)) {

              //set what keys/properties to look for, cache (from within the "garden" object), and/or validate
              if (key === "dbStatement") {this.dbStmt = garden[key];} // sets the statement/query to be executed within the database
              if (key === "outputFormat") {this.outputFrmt = garden[key];} // sets the format the data will be returned in... including/setting this element in the "garden" object will overide the default
              if (key === "maxRowsReturned") {this.maxRowsRetrnd = garden[key];} // sets the max number of rows that will be returned... including/setting this element in "garden" object will overide the default
              if (key === "bindVariables") {this.bindVars = garden[key];} // sets the bind variables used in SQL statement... optional, use when necessary

          }
        }

        //Validate inputs---------------------------------
           //these inputs must NOT be undefined
           if (this.dbStmt  === undefined ||
               this.outputFrmt === undefined ||
               this.maxRowsRetrnd === undefined) {

                   this.errorMsg = 'INVALID GARDEN: dbStatement must NOT be \"undefined\"';
                   return callback(this.errorMsg,this.result);
           }

           //these inputs must NOT be null
           if (this.dbStmt  === null ||
               this.outputFrmt === null ||
               this.maxRowsRetrnd === null) {

                   this.errorMsg = 'INVALID GARDEN: dbStatement must NOT be \"null\"';
                   return callback(this.errorMsg,this.result);
           }

           //these inputs must be a string
           if (typeof this.dbStmt  !== "string" ||
               typeof this.outputFrmt !== "string") {

                   this.errorMsg = 'INVALID GARDEN: dbStatement must be a string';
                   return callback(this.errorMsg,this.result);
           }

           //these inputs must NOT be an empty string (blank)
           if (this.dbStmt  === "" ||
               this.outputFrmt  === "") {

                   this.errorMsg = 'INVALID GARDEN: dbStatement must NOT be an empty string';
                   return callback(this.errorMsg,this.result);
           }

           //maxRowsReturned must NOT be a string and must be a natual number (i.e. a positive whole number)
           var maxRowsRetrndDATATYPE = typeof this.maxRowsRetrnd;
           if (maxRowsRetrndDATATYPE === "number" ) {
               //test with "regular expression" for natural numbers
               var naturalNumber = /^\+?(0|[1-9]\d*)$/.test(this.maxRowsRetrnd);
               if (naturalNumber === false) {

                   this.errorMsg = 'INPUT INVALID: the value for \"maxRowsReturned\" must be a natural number (or a positive integer)';
                   return callback(this.errorMsg,this.result);
               }
           }
           else {
               this.errorMsg = 'INPUT INVALID: the value for \"maxRowsReturned\" must NOT be a string';
               return callback(this.errorMsg,this.result);
           }

           //outputFormat must equal "json" or "array"... if undefined, use default (see further below)
           if (this.outputFrmt === "json" ||
               this.outputFrmt === "array" ||
               this.outputFrmt === "" ||
               this.outputFrmt === null ||
               this.outputFrmt === undefined) {

                   //do nothing
           }
           else
               {
                   this.errorMsg = 'INPUT INVALID: unfamiliar outputFormat specified';
                   return callback(this.errorMsg,this.result);
           }

           //if the following values are used for outputFormat... use the default instead
           if (this.outputFrmt === "" ||
               this.outputFrmt === null ||
               this.outputFrmt === undefined) {

                   this.outputFrmt = outputFormatDEFAULT;
           }

           //if defined in the "garden" Object, "bindVariables" must be stored as an array
           if (this.bindVars  !== null && this.bindVars  !== undefined && Array.isArray(this.bindVars) === true) {

                   //this.errorMsg = 'INPUT INVALID: bindVariables must be an Object';
                   return callback('INPUT INVALID: bindVariables must be an Object',this.result);
           }

           this.result = 'ALL INPUTS VALID';
           return callback(this.errorMsg,this.result);
    },

     testTunnel: function (callback) {
        var gopher = new Gopher(this.tunnel);
        //validate input values
        gopher.validateTunnel(function(err,res){
            //if found invalid, by way of validateTunnel (above), throw error
            if(err){return callback(err,res);}
        });
        var oracleConnectionObject = {
            "user"          : this.tunnel.user,
            "password"      : this.tunnel.password,
            "connectString" : this.tunnel.connectString
        };
        var testSQL = "SELECT * FROM DUAL";
        oracledb.getConnection(
          oracleConnectionObject,
          function(err, tunnel) {
            if (err) {
                return callback(err.message,"TUNNEL FAILED");
            }
            tunnel.execute(
              testSQL,
              [],
              function(err, result) {
                if (err) {
                    tunnel.release(function(err){
                        if (err) {
                            return callback(err.message,"TUNNEL FAILED");
                        }
                    });
                    return callback(err.message,"TUNNEL FAILED");
                }
                tunnel.release(function(err){
                    if (err) {
                        return callback(err.message,"TUNNEL FAILED");
                    }
                });
                if (result.rows == 'X') {
                    resMsg = "TUNNEL USABLE";
                }
                else {
                    resMsg = "TUNNEL FAILED";
                }
                return callback(undefined,resMsg);
            });
          });
    },

    vacateTunnel: function (tunnel) {

          tunnel.release(
            function(err) {
              if (err) {
                console.error(err.message);
              }
            });

    },

    forage: function (garden, callback) {
        var gopher = new Gopher(this.tunnel);
        //validate input values
        gopher.validateTunnel(function(err,res){
            //if found invalid, by way of validateTunnel (above), throw error
            if(err){return callback(err,res);}
        });
        gopher.validateGarden(garden, function(err,res){
            //if found invalid, by way of validateGarden (above), throw error
            if(err){return callback(err,res);}
        });

        for (var key in garden) {

          if (garden.hasOwnProperty(key)) {
              //set what keys/properties to look for, cache (from within the "garden" object), and/or validate
              if (key === "dbStatement") {this.dbStmt = garden[key];} // sets the statement/query to be executed within the database
              if (key === "outputFormat") {this.outputFrmt = garden[key];} // sets the format the data will be returned in... including/setting this element in the "garden" object will overide the default
              if (key === "maxRowsReturned") {this.maxRowsRetrnd = garden[key];} // sets the max number of rows that will be returned... including/setting this element in "garden" object will overide the default
              if (key === "bindVariables") {this.bindVars = garden[key];} // sets the bind variables used in SQL statement... optional, use when necessary

          }
        }
        //configure inputs for use with oracle driver
        var oracleConnectionObject = {
            "user"          : this.usr,
            "password"      : this.pwd,
            "connectString" : this.conStr
            };
        var dbStatement = this.dbStmt;
        var transactionConfig = {
            "maxRows"       : this.maxRowsRetrnd
            };
        var bindVars = this.bindVars;
        var format = this.outputFrmt;

        oracledb.getConnection(
          oracleConnectionObject ,
          function(err,tunnel) {
            if (format === 'array'){transactionConfig.outFormat = oracledb.ARRAY;}
            if (format === 'json'){transactionConfig.outFormat = oracledb.OBJECT;}
            if (err) {
              return callback(err.message,'TUNNEL ERROR');
            }
            tunnel.execute(
              dbStatement,
              bindVars,
              transactionConfig,
              function (err, res) {
                if (err) {
                  gopher.vacateTunnel(tunnel); //release tunnel
                  return callback(err.message,'TUNNEL ERROR');
                }
                gopher.vacateTunnel(tunnel); //release tunnel
                return callback(undefined,res.rows);
              }
          );
          }
      );
    }
};

module.exports = Gopher;
