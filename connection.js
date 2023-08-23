var mysql =require("mysql");
var con= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"rahul@a143",
    database:"Register"
});
module.exports=con;