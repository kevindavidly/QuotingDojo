//Imports
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var flash = require("express-flash");
var moment = require("moment");
mongoose.Promise = global.Promise;

//Config
app.use(flash());
app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({useNewUrlParser: true}));
app.use(session({
    secret: "quotes",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//Database
mongoose.connect("mongodb://localhost/QuotingDojo");

var QuoteSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3},
    quote: {type: String, required: true, minlength: 3},
    }, {timestamps: true});
    mongoose.model("Quote", QuoteSchema);
    var Quote = mongoose.model("Quote");

// Routes
app.get("/", function(req, res){
    console.log("root");
    res.render("index");
})

app.get("/quotes", function(req, res){
    console.log("getty");
    Quote.find({}, function(err, quotes) {
        if(err){
            console.log("Error find quotes!");
        }
        else {
            res.render("quotes", {info: quotes, moment: moment});
        }
    }).sort({_id:-1});
})

app.post("/quotes", function(req, res){
    console.log("posty", req.body);
    var quote = new Quote({name: req.body.name, quote: req.body.quote});
    quote.save(function(err){
        if(err){
            console.log("ERROR", err);
            for(var key in err.errors){
                req.flash("quoteform", err.errors[key].message);
            }
            res.redirect("/");
        }
        else{
            console.log("Success Quote");
            res.redirect("/quotes");
        }
    })
})

// Port
app.listen(8000, function() {
    console.log("listening on port 8000");
})

