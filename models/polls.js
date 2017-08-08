const mongoose = require('mongoose');



var PollSchema = new mongoose.Schema({
  title: String,
  description: String,
  choices: {
    choices: Array,
    values: Array
  },
  author: {
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Polls", PollSchema);
