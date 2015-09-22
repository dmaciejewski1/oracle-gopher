# oracle-gopher

Boilerplate Node.js middleware that facilitates connections and transactions with Oracle databases.

## Requirements
* Connects Node.js 0.10, Node.js 0.12
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
unzip instantclient-basic-macos.x64-11.2.0.4.0.zip -d /oracle
unzip instantclient-sdk-macos.x64-11.2.0.3.0.zip -d /oracle
```
2) Update your .bashrc file by appending and saving the following block of code:
```
##### Oracle Instant Client 11.2 #####
OCI_HOME=/oracle/instantclient_11_2
OCI_LIB_DIR=$OCI_HOME
OCI_INC_DIR=$OCI_HOME/sdk/include
OCI_INCLUDE_DIR=$OCI_HOME/sdk/include
OCI_VERSION=11
DYLD_LIBRARY_PATH=$OCI_LIB_DIR
```
3) Create the following symbolic links from within your Instant Client directory (e.g. /oracle/instantclient_11_2):
```
cd /oracle/instantclient_11_2
ln -s libclntsh.dylib.11.1 libclntsh.dylib
ln -s libocci.dylib.11.1 libocci.dylib
```
4) Restart your Terminal application

#### *C) oracle-gopher Installation*
```
 npm install oracle-gopher
```    
## Usage
#### *A) Example*
 ```javasript
 var Gopher = require('oracle-gopher');
 var tunnel = {
         user             : "USERNAME",   //mandatory
         password         : "PASSWORD",   //mandatory
         connectString    : "HOST:PORT/SERVICE"  //mandatory
     };
 var gopher = new Gopher(tunnel);

 /*-------------------------------Foraging for Data-------------------------------*/

 //Set Foraging Instructions via the Garden Object:
 var garden = {
         dbStatement     : "SELECT dummy FROM DUAL WHERE dummy = :DummyValue", //mandatory
         outputFormat    : "array", //not mandatory.  will use default if not explicitly set.
         maxRowsReturned : 100, //not mandatory.  will use default if not explicitly set.
         bindVariables   : {"DummyValue" : "X"} //not mandatory.  use in conjunction with dbStatement when bind variables are present.
     };

 // Send Gopher on it's way to return with data...
 gopher.forage(garden,
     function(err,result){
         if (err) {
             return console.log(err);
         }
         return console.log(result);
     }
 );
 ```   
