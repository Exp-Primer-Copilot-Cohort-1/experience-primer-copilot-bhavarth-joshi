//Create web server
var express = require('express');
var app = express();
//Create server
var http = require('http').Server(app);
//Create socket
var io = require('socket.io')(http);
//Create database
var mongoose = require('mongoose');
//Connect to database
mongoose.connect('mongodb://localhost/comments');
//Create schema
var commentsSchema = mongoose.Schema({
    name: String,
    comment: String
});
//Create model
var Comment = mongoose.model('Comment', commentsSchema);
//Create static file
app.use(express.static(__dirname + '/public'));
//Create route
app.get('/comments', function(req, res) {
    Comment.find(function(err, comments) {
        if (err) return console.error(err);
        res.json(comments);
    });
});
//Create socket connection
io.on('connection', function(socket) {
    console.log('A user connected');
    socket.on('disconnect', function() {
        console.log('A user disconnected');
    });
    socket.on('saveComment', function(comment) {
        console.log('A comment saved');
        var newComment = new Comment(comment);
        newComment.save(function(err, comment) {
            if (err) return console.error(err);
            io.emit('newComment', comment);
        });
    });
});
//Create server
http.listen(3000, function() {
    console.log('listening on localhost:3000');
});