 const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(14);
const http = require("http");
const ejs = require('ejs');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose");


var conn;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));
app.set('view engine','ejs');

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/LOL",{useNewUrlParser: true,  useUnifiedTopology: true  },function(err){if(err){console.log(err);};});
mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const contactSchema = new mongoose.Schema({
  index : Number,
  name : String,
  Divison : String,
  No : Number,
  MIS : String
})


const User = mongoose.model("user",userSchema);

const Info = new mongoose.model("info",contactSchema);

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){
  res.redirect("/search");
      })

app.get("/search",function(req,res){
  res.render("main_search");
})

var result = ""

app.post("/search",function(req,res){
  if (1){ //req.isAuthenticated()
    if(req.body.name === 'on'){
      results1 = [];
      Info.find(function(err,result){
        for(i=0;i<result.length-1;i++){
          name = result[i].name
          if (name == undefined){
            continue
          }
          if(name.toLowerCase().includes((req.body.Value).toLowerCase())==true){
              results1.push(result[i]);
            }
          }
          res.render("search",{Data:results1});
      })
    }else if(req.body.phoneNumber === 'on'){
      Info.find({No: req.body.Value},function(err,result){
        if(result.length===0){
          res.render("Invalid")
        }else{
          res.render("result",{Data:result});
        }
      })
    }else if(req.body.MIS === 'on'){
      Info.find({MIS: req.body.Value},function(err,result){
        if(result.length===0){
          res.render("Invalid")
        }else{
          res.render("result",{Data:result});
        }
      })
    }else if(req.body.Divison === 'on'){
      Info.find({Divison: req.body.Value},function(err,result){
        if(result.length===0){
          res.render("Invalid")
        }else{
          res.render("search",{Data:result});
        }
      })
    }
    else{
      res.render("main_search")
        }
  } else {
    res.redirect("/")
  }
    })



app.listen("3000",function(err){
  console.log("Server started at 3000");
})
