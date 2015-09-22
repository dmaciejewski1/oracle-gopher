/*****************************************************************
  NAME: gopher-test.js
  PATH: test/gopher-test.js
  WHAT: Unit tests for "gopher.js"
******************************************************************/
var should = require('chai').should();
var expect = require('chai').expect();
var Gopher = require('../lib/gopher.js');

var database = require('../config/connections.js');
var dbConfig = database.test;
var testTunnel = {
                   "user"         : "test",
                   "password"     : "test",
                   "connectString": "test"
                  };

describe('Testing \"Gopher.validateTunnel()\" function', function (){

  describe('It will return an error when specific \"tunnel\" inputs are undefined:', function (){

      it('An error is returned if \"user\" is undefined', function (){
        var tunnel = {
                           "user"         : undefined,
                           "password"     : "test",
                           "connectString": "test"
                          };
        var gopher = new Gopher(tunnel);
        gopher.validateTunnel(function (errorMsg){
            errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must NOT be \"undefined\"");
        });
      });

      it('An error is returned if \"password\" is undefined', function (){
        var tunnel = {
                           "user"         : "test",
                           "password"     : undefined,
                           "connectString": "test"
                          };
        var gopher = new Gopher(tunnel);
        gopher.validateTunnel(function (errorMsg){
          errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must NOT be \"undefined\"");
        });
      });

      it('An error is returned if \"connectString\" is undefined', function (){
        var tunnel = {
                           "user"         : "test",
                           "password"     : "test",
                           "connectString": undefined
                            };
        var gopher = new Gopher(tunnel);
        gopher.validateTunnel(function (errorMsg){
          errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must NOT be \"undefined\"");
        });
      });
  });

  describe('It will return an error when specific \"tunnel\" inputs are null:', function (){

      it('An error is returned if \"user\" is null', function (){
        var tunnel = {
                           "user"         : null,
                           "password"     : "test",
                           "connectString": "test"
                          };
        var gopher = new Gopher(tunnel);
        gopher.validateTunnel(function (errorMsg){
            errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must NOT be \"null\"");
        });
      });

      it('An error is returned if \"password\" is null', function (){
        var tunnel = {
                           "user"         : "test",
                           "password"     : null,
                           "connectString": "test"
                          };
        var gopher = new Gopher(tunnel);
        gopher.validateTunnel(function (errorMsg){
            errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must NOT be \"null\"");
        });
      });

      it('An error is returned if \"connectString\" is null', function (){
        var tunnel = {
                           "user"         : "test",
                           "password"     : "test",
                           "connectString": null
                          };
        var gopher = new Gopher(tunnel);
        gopher.validateTunnel(function (errorMsg){
            errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must NOT be \"null\"");
        });
      });
  });

  describe('It will return an error when specific \"tunnel\" inputs are NOT a string:', function (){

      it('An error is returned if \"user\" is NOT a string', function (){
        var tunnel = {
                           "user"         : 1,
                           "password"     : "test",
                           "connectString": "test"
                          };
        var gopher = new Gopher(tunnel);
        gopher.validateTunnel(function (errorMsg){
            errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must be a string");
        });
      });

      it('An error is returned if \"password\" is NOT a string', function (){
        var tunnel = {
                           "user"         : "test",
                           "password"     : 1,
                           "connectString": "test"
                          };
        var gopher = new Gopher(tunnel);
        gopher.validateTunnel(function (errorMsg){
          errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must be a string");
        });
      });

      it('An error is returned if \"connectString\" is NOT a string', function (){
        var tunnel = {
                           "user"         : "test",
                           "password"     : "test",
                           "connectString": 1
                          };
        var gopher = new Gopher(tunnel);
        gopher.validateTunnel(function (errorMsg){
          errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must be a string");
        });
      });
  });
   describe('It will return an error when specific \"tunnel\" inputs are an empty string:', function (){


       it('An error is returned if \"user\" is an empty string', function (){
         var tunnel = {
                            "user"         : "",
                            "password"     : "test",
                            "connectString": "test"
                           };
         var gopher = new Gopher(tunnel);
         gopher.validateTunnel(function (errorMsg){
              errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must NOT be an empty string");
          });
       });

       it('An error is returned if \"password\" is an empty string', function (){
         var tunnel = {
                            "user"         : "test",
                            "password"     : "",
                            "connectString": "test"
                           };
         var gopher = new Gopher(tunnel);
         gopher.validateTunnel(function (errorMsg){
             errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must NOT be an empty string");
         });
       });

       it('An error is returned if \"connectString\" is an empty string', function (){
         var tunnel = {
                            "user"         : "test",
                            "password"     : "test",
                            "connectString": ""
                           };
         var gopher = new Gopher(tunnel);
         gopher.validateTunnel(function (errorMsg){
             errorMsg.should.eql("INVALID TUNNEL: user, password, and connectString must NOT be an empty string");
         });
       });

   });
});

//--------


describe('Testing \"Gopher.validateGarden()\" function', function (){

  describe('It will return an error when specific inputs are undefined:', function (){

    it('An error is returned if \"dbStatement\" is undefined', function (){
      var garden = {
                         "dbStatement"  : undefined
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
        errorMsg.should.eql("INVALID GARDEN: dbStatement must NOT be \"undefined\"");
      });
    });

    it('An error is returned if \"outputFormat\" is undefined', function (){
      var garden = {
                         "dbStatement"      : "test",
                         "outputFormat"   : undefined
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
        errorMsg.should.eql("INVALID GARDEN: dbStatement must NOT be \"undefined\"");
      });
    });

    it('An error is returned if \"maxRowsReturned\" is undefined', function (){
      var garden = {
                         "dbStatement"      : "test",
                         "maxRowsReturned"  : undefined
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
        errorMsg.should.eql("INVALID GARDEN: dbStatement must NOT be \"undefined\"");
      });
    });

  });

  describe('It will return an error when specific inputs are null:', function (){

    it('An error is returned if \"dbStatement\" is null', function (){
      var garden = {
                         "dbStatement"  : null
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
          errorMsg.should.eql("INVALID GARDEN: dbStatement must NOT be \"null\"");
      });
    });

    it('An error is returned if \"outputFormat\" is null', function (){
        var garden = {
                           "dbStatement"      : "test",
                           "outputFormat"  : null
                          };
                          var gopher = new Gopher(testTunnel);
                          gopher.validateGarden(garden, function (errorMsg){
            errorMsg.should.eql("INVALID GARDEN: dbStatement must NOT be \"null\"");
      });
    });

    it('An error is returned if \"maxRowsReturned\" is null', function (){
        var garden = {
                           "dbStatement"      : "test",
                           "maxRowsReturned"  : null
                          };
                          var gopher = new Gopher(testTunnel);
                          gopher.validateGarden(garden, function (errorMsg){
            errorMsg.should.eql("INVALID GARDEN: dbStatement must NOT be \"null\"");
      });
    });
  });

  describe('It will return an error when specific inputs are NOT a string:', function (){

    it('An error is returned if \"dbStatement\" is NOT a string', function (){
      var garden = {
                         "dbStatement"  : 1
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
        errorMsg.should.eql("INVALID GARDEN: dbStatement must be a string");
      });
    });

    it('An error is returned if \"outputFormat\" is NOT a string', function (){
      var garden = {
                         "dbStatement"      : "test",
                         "outputFormat"   : 1
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
        errorMsg.should.eql("INVALID GARDEN: dbStatement must be a string");
      });
    });

  });

  describe('It will return an error when specific inputs are an empty string:', function (){

    it('An error is returned if \"dbStatement\" is an empty string', function (){
      var garden = {
                         "dbStatement"  : ""
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
          errorMsg.should.eql("INVALID GARDEN: dbStatement must NOT be an empty string");
      });
    });

    it('An error is returned if \"outputFormat\" is an empty string', function (){
      var garden = {
                         "dbStatement"      : "test",
                         "outputFormat"   : ""
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
          errorMsg.should.eql("INVALID GARDEN: dbStatement must NOT be an empty string");
      });
    });

 });

  describe('It will return an error when specific inputs are non-numeric or are incorrect in their numeric formatting:', function (){

    it('An error is returned if \"maxRowsReturned\" is NOT a number', function (){
      var garden = {
                         "dbStatement"      : "test",
                         "maxRowsReturned"  : "test"
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
          errorMsg.should.eql("INPUT INVALID: the value for \"maxRowsReturned\" must NOT be a string");
      });
    });

    it('An error is returned if \"maxRowsReturned\" is NOT a natural number (or positive integer)', function (){
      var garden = {
                         "dbStatement"      : "test",
                         "maxRowsReturned"  : -2.1
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
           errorMsg.should.eql("INPUT INVALID: the value for \"maxRowsReturned\" must be a natural number (or a positive integer)");
      });
    });

  });

  describe('It will return an error when specific inputs are incorrect:', function (){

    it('An error is returned if \"outputFormat\" is NOT equal to either \"json\" or \"array\"', function (){
      var garden = {
                         "dbStatement"      : "test",
                         "outputFormat"   : "test"
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
          errorMsg.should.eql("INPUT INVALID: unfamiliar outputFormat specified");
      });
    });

    it('An error is returned if the data type for \"bindVariables\" is NOT an Object', function (){
      var garden = {
                         "dbStatement"      : "test",
                         "bindVariables"    : [1]
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
          errorMsg.should.eql("INPUT INVALID: bindVariables must be an Object");
      });
    });

  });

  describe('It will return a successful message when all inputs are correct:', function (){
    it('An \"undefined\" Error Message is returned for \"errorMsg\" when all inputs are correct', function (){
      var garden = {
                         "dbStatement"      : "test"
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg){
          var err;
          if(errorMsg === undefined) { err = "undefined"; }
          err.should.eql("undefined");
      });
    });

    it('The Result Message \"ALL INPUTS VALID\" is returned for \"result\" when all inputs are correct\n', function (){
      var garden = {
                         "dbStatement"      : "test"
                        };
      var gopher = new Gopher(testTunnel);
      gopher.validateGarden(garden, function (errorMsg,result){
          result.should.eql("ALL INPUTS VALID");
      });
    });

  });
 });

 describe('Testing \"Gopher.testTunnel()\" function', function (){

     describe('It will return a success message when a connection can be made with a database', function (){
         it('The Result Message \"TUNNEL USABLE\" is returned for \"result\" when a tunnel can be used', function (done){
             var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
             var gopher = new Gopher(tunnel);
             gopher.testTunnel(function (errorMsg,result){
                 result.should.eql("TUNNEL USABLE");
                 done();
             });
         });
     });

     describe('It will return a fail message when a connection CANNOT be made with a database', function (){
         it('The Result Message \"TUNNEL FAILED\" is returned for \"result\" when a tunnel CANNOT be used', function (done){
             var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
             tunnel.user = "somerandomusername";
             var gopher = new Gopher(tunnel);
             gopher.testTunnel(function (errorMsg,result){
                 result.should.eql("TUNNEL FAILED");
                 done();
             });
         });

         it('When given an invalid username or password, the following error message is returned: \"ORA-01017: invalid username/password; logon denied\"', function (done){
             var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
             tunnel.user = "somerandomusername";
             var gopher = new Gopher(tunnel);
             gopher.testTunnel(function (errorMsg,result){
                 errorMsg.should.eql("ORA-01017: invalid username/password; logon denied");
                 done();
             });
         });
//THIS TEST WILL TAKE ABOUT 1 MINUTE TO COMPLETE
        it('When given an invalid connection string, the following error message is returned: \"ORA-12170: TNS:Connect timeout occurred\"', function (done){
            console.log('\tTHIS TEST TAKES ABOUT 1 MINUTE TO COMPLETE...');
            this.timeout(600000);//this step should take 1min to complete, offset this test's timeout to 10min
            var tunnel = JSON.parse(JSON.stringify(dbConfig));
            tunnel.connectString = "db.com:5000/db.com";
            var gopher = new Gopher(tunnel);
            gopher.testTunnel(function (errorMsg,result){
                errorMsg.should.eql("ORA-12170: TNS:Connect timeout occurred");
                done();
            });
        });
  });
 });

 describe('Testing \"Gopher.tunnel()\" function', function (){

  describe('It will return data', function (){

      it('When given the Db Statement \"SELECT * FROM DUAL\" the following result is returned in \"json\" (default) format: [{\"DUMMY\" : \"X\"}]', function (done){
          var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
          var garden = {
                        "dbStatement" : "SELECT * FROM DUAL"
                       };
          var gopher = new Gopher(tunnel);
          gopher.forage(garden, function (errorMsg,result){
              result.should.eql([{"DUMMY": "X"}]);
              done();
          });
      });

      it('When given the Db Statement \"SELECT * FROM DUAL\" and the \"outputFormat\" property is set to \"array\" the following result is returned: [[\"X\"]]', function (done){
          var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
          var garden = {
                        "dbStatement"  : "SELECT * FROM DUAL",
                        "outputFormat" : "array"
                       };
          var gopher = new Gopher(tunnel);
          gopher.forage(garden, function (errorMsg,result){
              result.should.eql([["X"]]);
              done();
          });
      });

      it('When given the Db Statement \"SELECT * FROM DUAL\" and the \"maxRowsReturned\" property is set to \"0\" the following result is returned: []', function (done){
          var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
          var garden = {
                        "dbStatement"  : "SELECT * FROM DUAL",
                        "maxRowsReturned" : 0};
          var gopher = new Gopher(tunnel);
          gopher.forage(garden, function (errorMsg,result){
              result.should.eql([]);
              done();
          });
      });

      it('When given the Db Statement \"SELECT * FROM DUAL\" and the \"maxRowsReturned\" property is set to \"1\" the following result is returned: [{\"DUMMY\" : \"X\"}]', function (done){
          var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
          var garden = {
                        "dbStatement"     : "SELECT * FROM DUAL",
                        "maxRowsReturned" : 1};
          var gopher = new Gopher(tunnel);
          gopher.forage(garden, function (errorMsg,result){
              result.should.eql([{"DUMMY":"X"}]);
              done();
          });
      });

      it('When given the Db Statement \"SELECT * FROM DUAL WHERE dummy = :DUMMYVALUE\" and the \"bindVariables\" property is set to {DUMMYVALUE : \"Y\"} the following result is returned: []', function (done){
          var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
          var garden = {
                        "dbStatement"     : "SELECT * FROM DUAL WHERE dummy = :DUMMYVALUE",
                        "bindVariables"   : {DUMMYVALUE : "Y"}
                       };
          var gopher = new Gopher(tunnel);
          gopher.forage(garden, function (errorMsg,result){
              result.should.eql([]);
              done();
          });
      });

      it('When given the Db Statement \"SELECT * FROM DUAL WHERE dummy = :DUMMYVALUE\" and the \"bindVariables\" property is set to {DUMMYVALUE : \"X\"} the following result is returned: [{\"DUMMY\" : \"X\"}]', function (done){
          var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
          var garden = {
                        "dbStatement"     : "SELECT * FROM DUAL WHERE dummy = :DUMMYVALUE",
                        "bindVariables"   : {DUMMYVALUE : "X"}
                       };
          var gopher = new Gopher(tunnel);
          gopher.forage(garden, function (errorMsg,result){
              result.should.eql([{"DUMMY":"X"}]);
              done();
          });
      });
  });

  describe('It will return a fail message upon error', function (){

      it('The Result Message \"TUNNEL FAILED\" is returned for \"result\" when a forage CANNOT be used', function (done){
           var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
           var garden = {
                         "dbStatement"     : "SELECT * FROM"
                        };
           var gopher = new Gopher(tunnel);
           gopher.forage(garden, function (errorMsg,result){
               result.should.eql("TUNNEL ERROR");
               done();
           });
         });
  });

  describe('It will return the following Oracle Errors', function (){

      it('When given the Db Statement \"SELECT * FROM\" the following error is returned: \"ORA-00903: invalid table name\"', function (done){
          var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
          var garden = {
                        "dbStatement"     : "SELECT * FROM"
                       };
          var gopher = new Gopher(tunnel);
          gopher.forage(garden, function (errorMsg,result){
              errorMsg.should.eql("ORA-00903: invalid table name");
              done();
          });
      });

      it('When given the Db Statement \"SELECT * FROM SomeRandomAndObscureTableName\" the following error is returned: \"ORA-00942: table or view does not exist\"', function (done){
          var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
          var garden = {
                        "dbStatement"     : "SELECT * FROM SomeRandomAndObscureTableName"
                       };
          var gopher = new Gopher(tunnel);
          gopher.forage(garden, function (errorMsg,result){
              errorMsg.should.eql("ORA-00942: table or view does not exist");
              done();
          });
      });

      it('When given the Db Statement \"* FROM SomeRandomAndObscureTableName\" the following error is returned: \"ORA-00900: invalid SQL statement\"', function (done){
          var tunnel = JSON.parse(JSON.stringify(dbConfig)); //done this way so that dbConfig properties remain unchanged by garden updates
          var garden = {
                        "dbStatement"     : "* FROM SomeRandomAndObscureTableName"
                       };
          var gopher = new Gopher(tunnel);
          gopher.forage(garden, function (errorMsg,result){
              errorMsg.should.eql("ORA-00900: invalid SQL statement");
              done();
          });
      });
  });
 });
