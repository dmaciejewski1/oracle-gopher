/*----------REMOVE (FROM THIS LINE TO LINE BELOW) AFTER DUPLICATING THIS FILE----------

      NOTE: This is a template file which serves to provide an example of how to
            configure a database connection within this application. For oracle-gopher
            to run tests properly:
                1) PLEASE CREATE A COPY OF THIS FILE AND RENAME IT so that
                   it reads "connections.js" (NOT "connections_EXAMPLE.js")
                2) Make sure the copy is saved the "config" file of this application
                   (i.e. /config/connections.js)
                3) So this application may run tests against itself,
                   add a valid test database configuration (i.e. fill in
                   real values for the User, Password, and Connection String
                   parameters)
                4) Remove this note (from the line above, to the line just
                   below)

----------REMOVE (FROM THIS LINE TO LINE ABOVE) AFTER DUPLICATING THIS FILE----------*/

/*****************************************************************
NAME: connections.js
PATH: /config/connections.js
WHAT: Where you go to configure database connections
NOTE: Due to the sensitive nature of this file, for security
      purposes, "connections.js" is ignored by Git.

EXAMPLE:
            exports.scott = {
                user              : "scott",
                password          : "tiger"
                connectString     : "localhost:1521/ORCL"
                };
******************************************************************/

 exports.test = {
    user              : "UserNameHere",
    password          : "PasswordHere",
    connectString     : "HostNameHere:PortNumberHere/ServiceNameHere"
    };
