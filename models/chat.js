var mongoose = require("mongoose");

// DInh nghia cac field de luu vao db
var chatSchema = new mongoose.Schema({
    content : String
})

var chats = mongoose.model('chathistories',chatSchema);

module.exports = chats;