# oracle-gopher
Maintain, Organize, Retrieve and Send your database statements from the middle of the stack.

Gopher keeps track of your Database Connection and Transaction Configurations while giving you handy data output options, as well as valuable feedback about the process.

## Requirements
* Node.js 5.6.0
* Oracle Instant Client

## Setup
#### *A) Oracle Instant Client Download*
1. Download the following **TWO** Oracle Instant Client Packages (here: http://www.oracle.com/technetwork/database/features/instant-client/index-097480.html ). Please make sure to download the correct packages for your system architecture (i.e. 64 bit vs 32 bit)

    * **Instant Client Package - Basic or Basic Lite**: Contains files required to run OCI, OCCI, and JDBC-OCI applications

    * **Instant Client Package - SDK**: Contains additional header files and an example makefile for developing Oracle applications with Instant Client

#### *B) Oracle Instant Client Installation and Configuration (this example procedure is for Mac OS X 64bit ONLY)*
From a terminal window:

1) Unzip files:
```
unzip instantclient-basic-macos.x64-11.2.0.4.0.zip -d ~/oracle
unzip instantclient-sdk-macos.x64-11.2.0.3.0.zip -d ~/oracle
```
2) Update your .bashrc file by appending and saving the following block of code:
```
##### Oracle Instant Client 11.2 #####
 export OCI_HOME=~/oracle/instantclient_11_2
 export OCI_LIB_DIR=~/oracle/lib
 export OCI_INC_DIR=$OCI_HOME/sdk/include
 export OCI_INCLUDE_DIR=$OCI_HOME/sdk/include
 export OCI_VERSION=11
 export DYLD_LIBRARY_PATH=$OCI_LIB_DIR
```
3) Create the following symbolic links from within your Instant Client directory (e.g. /oracle/instantclient_11_2):
```
cd /oracle/instantclient_11_2
ln -s libclntsh.dylib.11.1 libclntsh.dylib
ln -s libocci.dylib.11.1 libocci.dylib
```
4) Restart your Terminal application
#### *C) Install Gopher*
```
 npm install oracle-gopher
```    
#### *D) Configure Gopher*
1) Create a Connection library (or Libraries):
```
[
  {"myDatabase-Prod" :{
        "user"                 : "me",
        "password"             : "myProdPassword",
        "host"                 : "databases.arecool.com",
        "port"                 : 12345,
        "service"              : "databases.arecool.com"
  }},
  {"myDatabase-Dev" :{
        "user"                 : "me",
        "password"             : "myDevPassword",
        "host"                 : "propvd1.gene.com",
        "port"                 : 12345,
        "SID"                  : "propvd1.gene.com"
  }}
]

```
2) Create a Transaction Library (or Libraries) and setup transaction defaults:
```
[
  {"db-Tables" :{
    "dbStatement"     : "SELECT a.object_name AS \"TABLE\" FROM sys.user_objects a INNER JOIN sys.user_all_tables b ON a.object_name = b.table_name WHERE a.object_type = 'TABLE' ORDER BY b.table_name",
    "zeroRowMessage"  : "No Tables found",
    "outputFormat"    : "array"
    "responseOutput"  : ["connection","error","dbResponse","metaData","metrics"]
  }},
  {"db-Columns" :{
      "dbStatement"     : "SELECT column_name AS \"COLUMN\" FROM sys.user_tab_columns WHERE lower(table_name) = lower(:tableName)",
      "bindVariables"   : {"tableName":"dual"},
      "zeroRowMessage"  : "No columns found",
      "outputFormat"    : "array",
      "responseOutput"  : ["connection","error","dbResponse","metaData","metrics"]

  }}
]

```
3) Assign Transaction Libraries to Individual Connections:
```
[
  {"myDatabase-Prod" :{
        "user"                 : "prodMe",
        "password"             : "myProdPassword",
        "host"                 : "databases.areCool.com",
        "port"                 : 12345,
        "service"              : "databases.areCool.com",
        "transactionLibraries" : ["./libraries/transaction/oracle-dictionary-transactions.json",
                                  "./libraries/transaction/finance-production-transactions.json"]
  }},
  {"myDatabase-Dev" :{
        "user"                 : "devMe",
        "password"             : "myDevPassword",
        "host"                 : "devDatabases.areCool2.com",
        "port"                 : 12345,
        "SID"                  : "devDatabases.areCool2.com",
        "transactionLibraries" : ["./libraries/transaction/oracle-dictionary-transactions.json",
                                  "./libraries/transaction/finance-development-transactions.json"]
  }}
]

```
## Usage
### *A) A Simple Example:*
 ```javasript
 "use strict";

 var Gopher = require('oracle-gopher');

 const CONNECTIONS = ['./libraries/connection/myDatabase-connections.json',
                      './libraries/connection/corporate-connections.json',
                      './libraries/connection/finance-connections.json'];

//------------------------------------------------------------------------------//
//            Create a Gopher and Configure it's Transaction Properties         //
//------------------------------------------------------------------------------//

   var runGopher = function(dbConnection,transactionName,callback){

     let transactionObject = {transaction : transactionName};

     new Gopher({"tunnel":dbConnection,"tunnelLibraries":CONNECTIONS})
       .run(transactionObject,
         function(err,res){
           if (err)  {
             return callback(err,res);
           }
           return callback(err,res);
         }
       );
   }

//------------------------------------------------------------------------------//
//                          Send Gopher on it's way                             //
//------------------------------------------------------------------------------//

   runGopher('myDatabase-Prod','db-Tables',
     function(gophErr, gophRes){
       if(gophErr){console.log(gophRes);}
     console.log(gophRes)
     }
   );

 ```  
 ### *B) Build a simple abstraction*
 #### 1) Create a gopher-schema.js file and load it up with paths to your connection libraries, and build/standardize your transaction configuration types

  ```javasript
  "use strict";

  var Gopher = require('oracle-gopher');


  //----------------------------------------------------------------------------//
  //   Assign Gardens (Gopher vernacular for Db Connection Configurations)      //
  //----------------------------------------------------------------------------//

  const CONNECTIONS = ['./libraries/connection/myDatabase-connections.json',
                       './libraries/connection/corporate-connections.json',
                       './libraries/connection/finance-connections.json'];



 //-----------------------------------------------------------------------------//
 //     Create Different Gophers (i.e. a Gopher Schema) and Configure their     //
 //     Transaction Properties                                                  //
 //-----------------------------------------------------------------------------//

   //--------------------Without Bind Variables--------------------

    exports.run = function(dbConnection,transactionName,callback){

      let transactionObject = {transaction : transactionName};

      new Gopher({"tunnel":dbConnection,"tunnelLibraries":CONNECTIONS})
        .run(transactionObject,
          function(err,res){
            if (err)  {return callback(err,res);}
            return callback(err,res);
          }
        );
    }

   //----------------------With Bind Variables---------------------

    exports.runWBindVariables = function(dbConnection,transactionName,bindVariables,callback){

      let transactionObject = {
        transaction        : transactionName,
        bindVariables      : bindVariables
      };

      new Gopher({"tunnel":dbConnection,"tunnelLibraries":CONNECTIONS})
        .run(transactionObject,
          function(err,res){
            if (err)  {return callback(err,res);}
            return callback(err,res);
          }
        );
    }

   //---------------------------Show SQL---------------------------

    exports.showSql = function(dbConnection,transactionName,callback){

      let transactionObject = {
        transaction        : transactionName,
        responseOutput     : ['sqlOnly']
      };

      new Gopher({"tunnel":dbConnection,"tunnelLibraries":CONNECTIONS})
        .run(transactionObject,
          function(err,res){
            if (err) {return callback(err,res);}
            return callback(err,res);
          }
        );
    }

   //---------------------------Verbose----------------------------

    exports.runVerbose = function(dbConnection,transactionName,callback){

      let transactionObject = {
        transaction        : transactionName,
        responseOutput     : ['verbose']
      };

      new Gopher({"tunnel":dbConnection,"tunnelLibraries":CONNECTIONS})
        .run(transactionObject,
          function(err,res){
            if (err) {return callback(err,res);}
            return callback(err,res);
          }
        );
    }

   //------------------------Get Db Tables-------------------------

    exports.getTables = function(dbConnection,callback){

      let transactionObject = {transaction  : 'db-Tables'};

      new Gopher({"tunnel":dbConnection,"tunnelLibraries":CONNECTIONS})
        .run(transactionObject,
          function(err,res){
            if (err) {return callback(err,res);}
            return callback(err,res);
          }
        );
    }  

   //------------------------Get Db Columns------------------------

    exports.getColumns = function(dbConnection,table,callback){

      let transactionObject = {
        transaction    : 'db-Columns',
        bindVariables  : {tableName:table}
      };

      new Gopher({"tunnel":dbConnection,"tunnelLibraries":CONNECTIONS})
        .run(transactionObject,
          function(err,res){
            if (err)  {return callback(err,res);}
            return callback(err,res);
          }
        );
    }  

   //--------------------------Modifiable--------------------------

    exports.runModifiable = function(dbConnection,transactionObject,callback){

      new Gopher({"tunnel":dbConnection,"tunnelLibraries":CONNECTIONS})
        .run(transactionObject,
          function(err,res){
            if (err) {return callback(err,res);}
            return callback(err,res);
           }
         );
     }                  
  ```
  #### 2) Some example gopher calls
  ```  
"use strict";  
var gopher = require('./gopher-schema.js');

 //-----------------------------------------------------------------------------//
 //                          Send Gophers on their way                          //
 //-----------------------------------------------------------------------------//

   //--------------------Without bind variables--------------------

     let connectTo = 'myDatabase-Prod';
     let transactionToSend = 'db-Tables';

     gopher.run(connectTo,transactionToSend,
       function(gophErr, gophRes){
         if(gophErr){console.log(gophRes);}
         console.log(gophRes)
       }
     );


   //---------------------With bind variables---------------------

     let connectTo = 'finance-Prod';
     let transactionToSend = 'quarterly-report';     
     let bindVariables = {
       region     : 'North America',
       division   : 'Sales',
       storeID    : '1234'

     };

     gopher.runWBindVariables(connectTo,transactionToSend, bindVariables,
       function(gophErr, gophRes){
         if(gophErr){console.log(gophRes);}
         console.log(gophRes)
       }
     );


   //---------------------View SQL Statement----------------------

     let connection = 'finance-Prod';
     let transaction = 'quarterly-report';

     gopher.showSql(connection,transaction,
       function(gophErr, gophRes){
         if(gophErr){console.log(gophRes);}
         console.log(gophRes)
       }
     );

   //---------------------View Database Tables---------------------

     let connectTo = 'myDatabase-Prod';

     gopher.getTables(connection',
       function(gophErr, gophRes){
         if(gophErr){console.log(gophRes);}
         console.log(gophRes)
       }
     );

   //----------------------View Table Columns----------------------

     let connectTo = 'myDatabase-Prod';
     let showColumnsFor = 'myFavoriteTable';


     gopher.getColumns(connectTo, showColumnsFor
       function(gophErr, gophRes){
         if(gophErr){console.log(gophRes);}
         console.log(gophRes)
       }
     );

   //--------------------------Modifiable--------------------------

     let connectTo = 'myDatabase-Prod';
     let transactionPlan = {
         transaction       :'quarterly-report'
        ,bindVariables     :{ region     : 'North America',
                              division   : 'Sales',
                              storeID    : '1234'}
        ,outputFormat      : 'object'
        ,maxRowsReturned   : 3000
        ,zeroRowMessage    : 'This quarterly report was not found.'
        ,responseOutput    : ['host','network','connection','dbStatement','error','dbResponse','metaData','metrics']
        ,timeZone          : 'local'
     };

     gopher.runModifiable(connectTo,transactionPlan,
       function(gophErr, gophRes){
         if(gophErr){console.log(gophRes);}
         console.log(gophRes)
       }
     );          

  ```
