const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const port = 3000;

const app = express();
app.set('view engine', 'ejs');

// set up static folder: images, css, javascript.
app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json
app.use(bodyParser.json())
 

//connect to mongodb with mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB");

//create schema for articles collection
const articlesSchema = {
    title: String,
    content: String
}

// create a model
const Article = mongoose.model("Article", articlesSchema);

/* Routes */

app.route("/articles")
.get(function(req, res) {
    
    Article.find({}, function(err, results){
        if (!err) {
            res.send(results);
        } else {
            res.send(err);
        }
    });
})
.post(function(req, res){    
    console.log(req.body.title);
    console.log(req.body.content);
    
    const newArticle = new Article({title: req.body.title, content: req.body.content});
    newArticle.save(function(err){
        if (!err){
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    });    
})
.delete(function(req, res){
    // this deletes all articles
    Article.deleteMany(function(err){
        if (err) {
            res.send(err);
        } else {
            res.sendStatus(200);
        }        
    });  
});


/* Requests for a specific article */

app.route("/articles/:articleTitle")
.get(
function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, articleFound) {
        if (articleFound) {
            res.send(articleFound);
        } else {
            res.send("No article found!");
        }
    });
})
.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content}, 
        {overwrite: true}, 
        function(err, results) {
            if (!err) {
                res.send("Sucessfully updated article.");
            } else {
                res.send(err);
            }
    });
})
.patch(function(res, req){

    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if (!err) {
                res.send("Successfully updated article.")
            } else {
                res.send(err);
            }
        });
})
.delete(function(res, req) {

    Article.deleteOne({
        title: req.params.articleTitle},
        function(err){
            if (!err) {
                res.send("Successfully deleted article");
            } else {
                res.send(err);
            }
    });
});

app.listen(port, function() {
    console.log("server started on port http://localhost:3000")
})