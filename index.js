const express=require("express");
const fs=require("fs");
 const app =express();
var con=require("./connection");
var session = require('express-session')
var MySQLStore=require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 minutes
    expiration: 86400000, // 1 day
    createDatabaseTable: true, 
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
  }, con);
  app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  }));
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
         temp=0;
        res.redirect('/');
      }
    });
  });
  function requireLogin(req, res, next) {
      console.log(req.sessionID);
    var qury="select data from sessions where session_id= '"+req.sessionID+"';"
    
   
   con.query(qury,async function(error,result){
       if(error) throw error;

   if(result.length==0){
    res.sendFile(login_path);
    
   }
   else {
    console.log(result[0]);  
req.session.data==result[0];
next();
   }
         



  
   })
  }
const port= process.env.PORT || 3000; 
// var fileUpload = require("express-fileupload");
// app.use(fileUpload());
multer=require("multer");
var upload=multer({storage:multer.memoryStorage()});
con.connect(function(error){
    if(error)throw error;
    console.log("connected with mysql");

    // con.query("select * from data",function(error,result){
    //     if(error)throw error;
    //     console.log(result);
    // })
});
    
var userTitle;
var userPincode;


var bodyParser = require('body-parser')
const path= require("path");
 app.use(express.static('public'))
app.set('view engine','ejs');
const { urlToHttpOptions } = require("url");
const { urlencoded } = require("express");
const { setInterval } = require("timers/promises");
// const multer = require("multer");



const static_path=(path.join(__dirname, "../public",'index.html'))
const login_path=(path.join(__dirname, "/public",'login.html'))
console.log(login_path);
app.get("/",(res,req)=>{
    res.send(static_path);
})
express.json();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.json({}));
app.use(express.urlencoded({
    extended:true
}))


var Title;
var Price;
var id;
var Roomno;
app.post("/getdata",async (req,res)=>{
    console.log(req.sessionID);
    var Pincode=req.body.pincode;  


     var qury="select * from Imagedata   where Pincode='"+Pincode+"' and BOOK!=1 ;"
   var Result1,Result2,pin;
   pin={
    pini:Pincode,
   }
    
    con.query(qury,async function(error,result1){
        if(error) throw error;
        Result1=result1;
        console.log(result1);

    })
    var qeury="select * from Imagedata   where Pincode='"+Pincode+"' and (BOOK=1 and ROOMSHARING=1);"
    con.query(qeury,async function(error,result2){
        if(error) throw error;
        Result2=result2;
        console.log(result2); 
        if(Result1.length + Result2.length ==0)res.send("NO ROOM AVAILABLE FOR THIS PINCODE")
        else res.render(__dirname +"/pincode" ,{products1:Result1,products2:Result2,product3:pin});
    })





})
app.get("/getdata",(req,res)=>{
    console.log(req.sessionID);
    book=req.query.id1;
        console.log(book);
    
})

app.post("/",function(req,res){
    console.log(req.sessionID);
    var a=req.body;
    console.log(a);
    if(req.body.Password === req.body.ConfirmPassword){
    var Email=req.body.Email;
    var Title=req.body.Title;
    var Password=req.body.Password;
    var ConfirmPassword=req.body.ConfirmPassword;
    var Pincode=req.body.Pincode;
    var qury="insert into  registerdata values('"+Email+"' ,'"+Password+"','"+ConfirmPassword+"','"+Pincode+"','"+Title+"' )";
   con.query(qury,function(error,result){
if(error)throw error;
console.log("record saved");
res.send("submitted");
   });    

}
    else {
        throw console.error("Password And ConfirmPassword is Not same");
    }

})

app.get("/login",(req,res)=>{
    console.log(req.sessionID);
    var qury="DELETE from sessions where session_id= '"+req.sessionID+"';"
    con.query(qury,function(error,result){
        if(error) throw error;
})

         


    res.sendFile(login_path);
})
const filename= fs.readFileSync('imag.png');
// var qury='INSERT INTO Imagedata(Title,pincode,room_id,room,Room_Type,price ) values(?,?,?,?,?,?)'; 
// var values=["abc",564737,6,filename,"single",800];
// con.query(qury,values,function(error,result){
//     if(error) throw error;
//     else console.log("data inserted");


// })
var userTitle;
app.get("/abc" ,requireLogin, (req,res)=>{
    console.log(req.sessionID);
    result=userTitle;
    var qury="select * from Imagedata where Title='"+req.session.user.Title+"';"
    con.query(qury,function(error,result){
        if(error) throw error;
    
    


      
            userTitle=result[0].Title;
            userPincode=result[0].Pincode;
            console.log(userPincode);
       
            res.render(__dirname+"/views",{products:result});

    })


 
})

app.post("/login",async (req,res)=>{
    console.log(req.session_id);
    var data=req.body;

    req.session.userID = data.email;
    console.log(req.session.data);
    var qury="select Email,Password,Pincode,Title from registerdata where Email= '"+req.body.Email+"';"
    con.query(qury,function(error,result){
        if(error) throw error;
        console.log(result[0].Password);
        const user = result[0];
        req.session.user = user;

        if(data.Password === result[0].Password){
// alert("you are logged in");
            res.render(__dirname+"/views" ,{products:result});
            userTitle=result[0].Title;
            userPincode=result[0].Pincode;
            console.log(userPincode);
       }
        else res.send("invalid password");

    })
})



var error3="";
  var email_id;
//   app.get("/login", function(req, res){
//     res.render('login', {error3:error3});
  
//   });
 




app.post("/abc",requireLogin,upload.single('Productimage'),(req,res)=>{
    console.log(req.session.userID);
console.log("abc hitted");
var image=req.file.buffer.toString('base64');
var Price =req.body.Price;
var RoomNo=req.body.RoomNo;
// var Price=req.body.Price;
var ROOMTYPE=req.body.ROOMTYPE;
var roomshare=0;var BOOK=0;

var qury="Insert into Imagedata (RoomNo,Price,ROOMTYPE, Title,Pincode,BOOK,imgHere,ROOMSHARING) values( '"+RoomNo+"', '"+Price+"','"+ROOMTYPE+"', '"+userTitle+"','"+userPincode+"',  '"+BOOK+"', '"+image+"','"+roomshare+"');"
 con.query(qury,function(error,result){
if(error) throw error;
console.log("data inserted"); 


res.redirect("/customer") 

// console.log(image)
})
})
// var qury="select * from Imagedata ;"
//     con.query(qury,function(error,result){
  
//     console.log(result[0].Title)});
app.get("/remove",requireLogin,(req,res)=>{
    console.log(req.session.userID);
    remove=req.query.id1;
    console.log(remove);


    var qury="DELETE FROM Imagedata WHERE id='"+remove+"';"
    con.query(qury,function(error,result){
        console.log(req.sessionID);
        if(error) throw error;
      
     
     console.log("deleted");
        

        res.redirect("/customer") 

   
    })




})
   
app.get("/customer",requireLogin,  async (req,res)=>{
      

     var qury="select * from Imagedata where Title='"+req.session.user.Title+"';"
    con.query(qury,function(error,result){
        if(error) throw error;
      
         if(result.length==0){
            res.send("NO ROOMS ADDED YET");
         }
    
        
      else {  res.render(__dirname +"/result" ,{products:result});
        console.log(req.session.user.Email); }
   
    })
})
app.get("/mybookings",requireLogin,async (req,res)=>{
    console.log(req.session.userID);
    var data=req.body;
     var qury="select * from Imagedata where Title='"+req.session.user.Title+"' and BOOK=1;"
    con.query(qury,function(error,result){
        if(error) throw error;
       if(result.length==0){
        res.send("NO BOOKINGS FOUND YET");
       }
       else { console.log(result);
    
        
        res.render(__dirname +"/responsivee" ,{products:result});}

   
    })
})


app.get("/userdetails",requireLogin,async (req,res)=>{
    console.log(req.session.userID);
    var roomnumber=req.query.id1;
    console.log("am " + roomnumber);
     var qury="select * from Imagedata where Title='"+req.session.user.Title+"' and RoomNo= '"+roomnumber+"' ;"
    con.query(qury,function(error,object){
        if(error) throw error;
       if(object.length==0){   
        res.send("NO BOOKINGS FOUND YET");
       }
       else { console.log(object);
    
        
        res.render(__dirname +"/boot" ,{product:object});}

   
    }) 
})


var dat;
app.get("/getdetails",(req,res)=>{
    console.log(req.sessionID);
     
      
   dat=req.query.id1;
   console.log(dat);

   var qury="select id,Title,Price,ROOMTYPE from Imagedata where id='"+dat+"';"
    con.query(qury,function(error,result){
        if(error) throw error;
      
         console.log(result);
    
        
        res.render(__dirname +"/datacollect" ,{products:result});

    });
    })



    app.get("/bookasshare",(req,res)=>{
        console.log(req.sessionID);
         
          
       var bookas=req.query.id1;
       console.log(bookas);
    
       var qury="select id,Title,Price,ROOMTYPE,C1NAME,C1CONTACT,TIMESTAMP from Imagedata where id='"+bookas+"';"
        con.query(qury,function(error,result){
            if(error) throw error;
          
             console.log(result);
        
            
            res.render(__dirname +"/datacollbook" ,{products:result});
    
        });
        })





    app.post("/getdetails",(req,res)=>{
        console.log(req.sessionID);



        var day=new Date;


        
        
        let dat = day.getDate();
        

     
        var C1NAME=req.body.name;
        var C1CONTACT=req.body.contact;
        var C1EMAIL=req.body.email;
        var C1PROOF=req.body.Proof;
        var id=req.body.id;
        var bupto=req.body.bookingupto;
        console.log(" before change" +day);
        var l=Number(dat)+Number(bupto); 
         console.log("am l" +l);
        day.setDate(l)
        console.log("After change " + day);
        // console.log(C1NAME);
        // console.log(C1CONTACT);
        // console.log(C1PROOF);
        // console.log(C1EMAIL);
        console.log("I am day " + day);
        countDownDate=day.getTime();
        console.log(countDownDate);
        var roomsharing=req.body.ROOMSHARING;
    
       qury= "UPDATE imagedata SET BOOK=1,ROOMSHARING='"+roomsharing+"', C1NAME = '"+C1NAME+"', C1CONTACT = '"+C1CONTACT+"',C1EMAIL='"+C1EMAIL+"',C1PROOF='"+C1PROOF+"',TIMESTAMP='"+countDownDate+"' WHERE id='"+id+"';"
      
       con.query(qury,function(error,result){
    if(error)throw error;
    console.log("customer data registered; with " + id);
    res.send("submitted");
       });    

  
   
 
});

app.get("/resetbooking",(req,res)=>{

   var idp=req.query.id1;


   qury= "UPDATE imagedata SET BOOK=0,ROOMSHARING= 0 WHERE id='"+idp+"';"
  
   con.query(qury,function(error,result){
if(error)throw error;
console.log("reset");
res.redirect("/mybookings")

   });    




});
function resetbooking(r){
    qury= "UPDATE imagedata SET BOOK=0,ROOMSHARING= 0 WHERE id='"+r+"';"
  
   con.query(qury,function(error,result){
if(error)throw error;
else console.log("reset");
 

   });    
}
function abc(){
    qury= "select id,TIMESTAMP from imagedata;"
  
   con.query(qury,function(error,result){
if(error)throw error;
else {
    var datee= new Date;
    var currtime=datee.getTime();
    result.forEach(element => {
        console.log( Number(currtime), Number(element.TIMESTAMP))
        if(Number(element.TIMESTAMP)-Number(currtime) <0){
           
            resetbooking(element.id);
        }
    });
}




   }); 
   console.log("i am runnig") 
    
}
setInterval(abc(), 1000);






app.post("/moredetails",(req,res)=>{
    console.log(req.sessionID);



   

   
 
    var C2NAME=req.body.name;
    var C2CONTACT=req.body.contact;
 
    var C2PROOF=req.body.Proof;
    var idl=req.body.id;
 var roomsharevalue=2;
   qury= "UPDATE imagedata SET BOOK=1,ROOMSHARING='"+roomsharevalue+"', C2NAME = '"+C2NAME+"', C2CONTACT = '"+C2CONTACT+"',C2PROOF='"+C2PROOF+"' WHERE id='"+idl+"';"
  
   con.query(qury,function(error,result){
if(error)throw error;
console.log("customer data registered; with " + idl);
res.send("submitted");
   });    




});

app.listen(port,()=>{
    console.log(`SERVER IS RUNNING AT PORT NO ${port}`);
});
  