const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String
});

const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;