const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

// Our scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT =  process.env.PORT || 3000;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// // Import routes and give the server access to them.
// const routes = require("./controllers/controller.js");
// app.use(routes);

// Routes
app.get("/", function(req, res) {
    res.render("index");
});

// A GET route for scraping the echoJS website
let results = [];
app.get("/scrape", function(req, res) {
    //check exist articles
    let exist;
    let existTitle = []

    db.Article.find({})
      .then(function(dbArticle) {
          dbArticle.forEach(function(el) {
              existTitle.push(el.title)
          })
      })
    // First, we grab the body of the html with axios
    axios.get("https://www.theverge.com/tech").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(response.data);

        $(".c-compact-river__entry ").each(function(i, element) {
            let result = {}

            result.title = $(this).children().find("h2").children("a").text()
            result.link = $(this).children().find("h2").children("a").attr("href")
            let imgLink = $(this).children().children("a").find("noscript").text()
            result.img = imgLink.slice(17, imgLink.length-2)
            exist = existTitle.includes(result.title)

            if (!exist && result.title && result.link && result.img) {
                results.push(result) 
            }
        })
        res.render("index", {
            articles: results
        })
    })
})

app.get("/save", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
          res.render("save",{
              save: dbArticle
          })
      })
      .catch(function(err) {
        res.json(err);
      });
})

app.post("/api/save", function(req, res) {
    db.Article.create(req.body)
      .then(function(dbArticle) {
          res.json(dbArticle)
      })
      .catch(function(err) {
          res.json(err)
      })
})

app.delete("/save/:id", function(req, res) {
    db.Article.deleteOne({
        _id: req.params.id
    }).then(function(removed) {
        res.json(removed)
    }).catch(function(err) {
        res.json(err)
    })
})

app.get("/note/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
          res.render("note", {
              note: dbArticle
          })
      })
      .catch(function(err) {
          res.json(err)
      });
})

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});